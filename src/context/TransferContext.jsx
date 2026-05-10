import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const TransferContext = createContext();

export function TransferProvider({ children }) {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('transfers');
    if (stored) setTransfers(JSON.parse(stored));
    
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
  }, []);

  const createTransfer = (transferData) => {
    const newTransfer = {
      id: `FX${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userPhone: user.phone,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      steps: { paymentReceived: false, transferSent: false },
      ...transferData
    };
    const updated = [newTransfer, ...transfers];
    setTransfers(updated);
    localStorage.setItem('transfers', JSON.stringify(updated));
    addNotification({
      userId: user.id,
      title: 'Transfert initié',
      message: `Votre transfert de ${transferData.amountSent} ${transferData.currencyFrom} est en attente de paiement.`,
      type: 'transfer',
      transferId: newTransfer.id
    });
    return newTransfer;
  };

  const updateTransferStatus = (transferId, status, stepUpdate = {}) => {
    const updated = transfers.map(t => {
      if (t.id === transferId) {
        const updatedTransfer = { 
          ...t, status,
          steps: { ...t.steps, ...stepUpdate },
          updatedAt: new Date().toISOString()
        };
        let notifTitle, notifMessage;
        if (status === 'payment_received') {
          notifTitle = 'Paiement confirmé';
          notifMessage = 'Nous avons reçu votre paiement. Traitement en cours...';
        } else if (status === 'completed') {
          notifTitle = 'Transfert terminé';
          notifMessage = `Votre transfert de ${t.amountReceived} ${t.currencyTo} a été envoyé au destinataire.`;
        }
        if (notifTitle) {
          addNotification({ userId: t.userId, title: notifTitle, message: notifMessage, type: 'transfer', transferId });
        }
        return updatedTransfer;
      }
      return t;
    });
    setTransfers(updated);
    localStorage.setItem('transfers', JSON.stringify(updated));
  };

  const addNotification = (notif) => {
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    notifs.unshift({ ...notif, id: Date.now().toString(), read: false, createdAt: new Date().toISOString() });
    localStorage.setItem('notifications', JSON.stringify(notifs));
  };

  const getUserTransfers = () => {
    if (!user) return [];
    if (user.role === 'admin') return transfers;
    return transfers.filter(t => t.userId === user.id);
  };

  const getNotifications = () => {
    if (!user) return [];
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    return notifs.filter(n => n.userId === user.id);
  };

  const markNotificationRead = (notifId) => {
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifs.map(n => n.id === notifId ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const addToFavorites = (recipient) => {
    if (!user) return;
    const userFavorites = favorites.filter(f => f.userId === user.id);
    if (userFavorites.find(f => f.recipient.phone === recipient.phone)) return; // Already exists
    
    const newFavorite = {
      id: Date.now().toString(),
      userId: user.id,
      recipient,
      createdAt: new Date().toISOString()
    };
    const updated = [...favorites, newFavorite];
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const removeFromFavorites = (favoriteId) => {
    const updated = favorites.filter(f => f.id !== favoriteId);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const getUserFavorites = () => {
    if (!user) return [];
    return favorites.filter(f => f.userId === user.id);
  };

  return (
    <TransferContext.Provider value={{ 
      transfers, 
      createTransfer, 
      updateTransferStatus, 
      getUserTransfers, 
      getNotifications, 
      markNotificationRead,
      favorites,
      addToFavorites,
      removeFromFavorites,
      getUserFavorites
    }}>
      {children}
    </TransferContext.Provider>
  );
}

export const useTransfer = () => useContext(TransferContext);
