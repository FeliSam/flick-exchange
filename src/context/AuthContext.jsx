import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem('currentUser', JSON.stringify(found));
      return { success: true };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  };

  const register = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === userData.email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
    }
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: userData.email.includes('admin') ? 'admin' : 'user',
      createdAt: new Date().toISOString(),
      verified: false,
      verificationDocs: [],
      pin: userData.pin, // Add PIN to user data
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('currentUser', JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = updated;
      localStorage.setItem('users', JSON.stringify(users));
    }
  };

  const validatePin = (pin) => {
    return user && user.pin === pin;
  };

  const getUserLimits = () => {
    if (!user) return { daily: 0, monthly: 0 };
    
    // Limits based on verification status
    if (user.verified) {
      return { daily: 500000, monthly: 2000000 }; // Verified users: 500k/day, 2M/month
    } else {
      return { daily: 50000, monthly: 200000 }; // Unverified users: 50k/day, 200k/month
    }
  };

  const checkTransferLimit = (amount, currency) => {
    if (!user) return { allowed: false, reason: 'Utilisateur non connecté' };
    
    const limits = getUserLimits();
    const transfers = JSON.parse(localStorage.getItem('transfers') || '[]');
    
    // Get today's transfers
    const today = new Date().toDateString();
    const todayTransfers = transfers.filter(t => 
      t.senderId === user.id && 
      new Date(t.createdAt).toDateString() === today
    );
    const todayTotal = todayTransfers.reduce((sum, t) => sum + t.amountSent, 0);
    
    // Get this month's transfers
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const monthTransfers = transfers.filter(t => {
      const date = new Date(t.createdAt);
      return t.senderId === user.id && date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    });
    const monthTotal = monthTransfers.reduce((sum, t) => sum + t.amountSent, 0);
    
    if (todayTotal + amount > limits.daily) {
      return { 
        allowed: false, 
        reason: `Limite journalière dépassée. Maximum: ${limits.daily.toLocaleString()} ${currency}/jour` 
      };
    }
    
    if (monthTotal + amount > limits.monthly) {
      return { 
        allowed: false, 
        reason: `Limite mensuelle dépassée. Maximum: ${limits.monthly.toLocaleString()} ${currency}/mois` 
      };
    }
    
    return { allowed: true };
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, validatePin, getUserLimits, checkTransferLimit, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
