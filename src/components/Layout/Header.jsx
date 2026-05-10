import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTransfer } from '../../context/TransferContext';
import { FiArrowLeft, FiBell } from 'react-icons/fi';

export default function Header() {
  const { user } = useAuth();
  const { getUnreadCount } = useTransfer();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isHome = location.pathname === '/';
  const unreadCount = getUnreadCount();

  const titles = {
    '/': '', '/transfer': 'Nouveau Transfert', '/history': 'Historique',
    '/notifications': 'Notifications', '/support': 'Support',
    '/profile': 'Mon Profil', '/settings': 'Paramètres',
    '/calculator': 'Calculatrice',
    '/admin': 'Dashboard', '/admin/transfers': 'Gestion Transferts'
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isHome && <FiArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />}
        {isHome ? <div className="header-logo">Flick-exchange</div> : <h1>{titles[location.pathname] || 'Flick-exchange'}</h1>}
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {isAdmin && location.pathname === '/' && (
          <button onClick={() => navigate('/admin')} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '6px 14px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)' }}>
            Admin
          </button>
        )}
        <div style={{ position: 'relative' }}>
          <FiBell size={22} style={{ cursor: 'pointer' }} onClick={() => navigate('/notifications')} />
          {unreadCount > 0 && <div className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>}
        </div>
      </div>
    </header>
  );
}
