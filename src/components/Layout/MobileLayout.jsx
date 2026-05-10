import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from './BottomNav';
import Header from './Header';

export default function MobileLayout() {
  const { user, darkMode } = useAuth();
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container" data-theme={darkMode ? 'dark' : 'light'}>
      {!hideNav && <Header />}
      <main className="content">
        <Outlet /> {/* 🔥 OBLIGATOIRE */}
      </main>
      {!hideNav && user && <BottomNav />}
    </div>
  );
}