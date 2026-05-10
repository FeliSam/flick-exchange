import { FiClock, FiHeadphones, FiHome, FiRepeat, FiUser } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FiHome />
        <span>Accueil</span>
      </NavLink>
      <NavLink to="/transfer" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FiRepeat />
        <span>Transfert</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FiClock />
        <span>Historique</span>
      </NavLink>
      <NavLink to="/support" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FiHeadphones />
        <span>Support</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FiUser />
        <span>Profil</span>
      </NavLink>
    </nav>
  );
}
