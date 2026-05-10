import { FiArrowLeft, FiBell, FiMoon, FiSun } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTransfer } from '../../context/TransferContext';

export default function Header() {
  const { user } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { getNotifications } = useTransfer();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const isHome = location.pathname === '/';

  const notifications = getNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  const titles = {
    '/': '',
    '/transfer': 'Nouveau Transfert',
    '/history': 'Historique',
    '/notifications': 'Notifications',
    '/support': 'Support',
    '/profile': 'Mon Profil',
    '/admin': 'Dashboard',
    '/admin/transfers': 'Gestion Transferts'
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {!isHome && (
          <FiArrowLeft size={24} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
        )}
        {isHome ? (
          <div className="header-logo">Flick-exchange</div>
        ) : (
          <h1>{titles[location.pathname] || 'Flick-exchange'}</h1>
        )}
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {isAdmin && location.pathname === '/' && (
          <button onClick={() => navigate('/admin')} style={{
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
            color: 'white', padding: '6px 14px', borderRadius: '10px',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', backdropFilter: 'blur(10px)'
          }}>
            Admin
          </button>
        )}
        <div onClick={toggleDarkMode} style={{ cursor: 'pointer', padding: '4px' }}>
          {isDarkMode ? <FiSun size={20} color="white" /> : <FiMoon size={20} color="white" />}
        </div>
        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/notifications')}>
          <FiBell size={22} color="white" />
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              background: 'var(--danger)',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
