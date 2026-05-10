import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiMoon, FiSun, FiLock, FiCheck, FiX } from 'react-icons/fi';

export default function Settings() {
  const { user, updateUser, darkMode, toggleDarkMode } = useAuth();
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinSet, setPinSet] = useState(false);
  const [pinError, setPinError] = useState('');

  const handlePinChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setPinError('');
    if (val && idx < 3) document.getElementById(`pin-${idx + 1}`)?.focus();
  };

  const savePin = () => {
    const code = pin.join('');
    if (code.length !== 4) { setPinError('Le PIN doit contenir 4 chiffres'); return; }
    updateUser({ pin: code });
    setPinSet(true);
    setTimeout(() => setPinSet(false), 2000);
    setPin(['', '', '', '']);
  };

  const clearPin = () => {
    updateUser({ pin: null });
    setPin(['', '', '', '']);
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '20px', color: 'var(--text)' }}>Paramètres</h2>

      {/* Dark Mode */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Mode sombre</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{darkMode ? 'Activé' : 'Désactivé'}</div>
          </div>
        </div>
        <div className={`toggle-switch ${darkMode ? 'on' : ''}`} onClick={toggleDarkMode} />
      </div>

      {/* PIN */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
            <FiLock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Code PIN</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.pin ? '✅ Configuré' : 'Non configuré'}</div>
          </div>
        </div>

        {pinSet && (
          <div style={{ background: '#ECFDF5', color: '#065F46', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiCheck /> PIN enregistré !
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '16px' }}>
          {pin.map((d, i) => (
            <input key={i} id={`pin-${i}`} type="password" maxLength={1} className="pin-input" value={d} onChange={e => handlePinChange(i, e.target.value)} />
          ))}
        </div>
        {pinError && <div className="error-text" style={{ textAlign: 'center', marginBottom: '12px' }}>⚠️ {pinError}</div>}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-primary btn-sm" onClick={savePin}><FiCheck /> Enregistrer</button>
          {user?.pin && <button className="btn btn-ghost btn-sm" onClick={clearPin}><FiX /> Supprimer</button>}
        </div>
      </div>

      {/* Version */}
      <div className="card" style={{ background: 'var(--bg)', border: '1px dashed var(--border)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>Flick-exchange v1.1.0</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Dernière mise à jour : Mai 2026</div>
        </div>
      </div>
    </div>
  );
}
