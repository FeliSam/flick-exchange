import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import BottomNav from './BottomNav';

export default function MobileLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      {!hideNav && <Header />}
      <main className="content">
        {children}
      </main>
      {!hideNav && user && <BottomNav />}
    </div>
  );
}
