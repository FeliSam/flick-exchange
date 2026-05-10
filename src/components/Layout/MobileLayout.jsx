import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import BottomNav from './BottomNav';
import Header from './Header';

export default function MobileLayout({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  const hideNav = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="app-container">
      {!hideNav && <Header />}
      <main className="content">
        {children ?? <Outlet />}
      </main>
      {!hideNav && user && <BottomNav />}
    </div>
  );
}
