import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TransferContext = createContext();

export function TransferProvider({ children }) {
  const { user } = useAuth();
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('transfers');
    if (stored) setTransfers(JSON.parse(stored));
  }, []);

  const createTransfer = (transferData) => {
    const newTransfer = {
      id: `FX${Date.now()}`,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userPhone: user.phone,
      status: 'pending_payment',
      createdAt: new Date().toISOString(),
      receiptUrl: null,
      steps: { paymentReceived: false, transferSent: false },
      ...transferData
    };
    const updated = [newTransfer, ...transfers];
    setTransfers(updated);
    localStorage.setItem('transfers', JSON.stringify(updated));
    addNotification({
      userId: user.id, title: 'Transfert initié',
      message: `Votre transfert de ${transferData.amountSent} ${transferData.currencyFrom} est en attente de paiement.`,
      type: 'transfer', transferId: newTransfer.id
    });
    return newTransfer;
  };

  const updateTransferStatus = (transferId, status, stepUpdate = {}) => {
    const updated = transfers.map(t => {
      if (t.id === transferId) {
        const updatedTransfer = { ...t, status, steps: { ...t.steps, ...stepUpdate }, updatedAt: new Date().toISOString() };
        let notifTitle, notifMessage;
        if (status === 'payment_received') { notifTitle = 'Paiement confirmé'; notifMessage = 'Nous avons reçu votre paiement. Traitement en cours...'; }
        else if (status === 'completed') { notifTitle = 'Transfert terminé'; notifMessage = `Votre transfert de ${t.amountReceived} ${t.currencyTo} a été envoyé au destinataire.`; }
        if (notifTitle) addNotification({ userId: t.userId, title: notifTitle, message: notifMessage, type: 'transfer', transferId });
        return updatedTransfer;
      }
      return t;
    });
    setTransfers(updated);
    localStorage.setItem('transfers', JSON.stringify(updated));
  };

  const uploadReceipt = (transferId, receiptDataUrl) => {
    const updated = transfers.map(t => t.id === transferId ? { ...t, receiptUrl: receiptDataUrl, receiptUploadedAt: new Date().toISOString() } : t);
    setTransfers(updated);
    localStorage.setItem('transfers', JSON.stringify(updated));
    addNotification({ userId: user.id, title: 'Reçu reçu', message: 'Votre reçu de paiement a été transmis à notre équipe.', type: 'transfer', transferId });
  };

  const addFavorite = (recipientData) => {
    const fav = { id: Date.now().toString(), ...recipientData, createdAt: new Date().toISOString() };
    const updated = [...(user.favorites || []), fav];
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = { ...users[idx], favorites: updated };
      localStorage.setItem('users', JSON.stringify(users));
      const current = JSON.parse(localStorage.getItem('currentUser'));
      localStorage.setItem('currentUser', JSON.stringify({ ...current, favorites: updated }));
    }
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

  const getUnreadCount = () => {
    return getNotifications().filter(n => !n.read).length;
  };

  const markNotificationRead = (notifId) => {
    const notifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifs.map(n => n.id === notifId ? { ...n, read: true } : n);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  return (
    <TransferContext.Provider value={{ transfers, createTransfer, updateTransferStatus, uploadReceipt, addFavorite, getUserTransfers, getNotifications, getUnreadCount, markNotificationRead }}>
      {children}
    </TransferContext.Provider>
  );
}

export const useTransfer = () => useContext(TransferContext);
