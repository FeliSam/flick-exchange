import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiPhone, FiMail, FiMapPin, FiShield, FiCheckCircle, FiUpload, FiCamera, FiInfo, FiChevronRight, FiSettings, FiMoon } from 'react-icons/fi';
import { APP_NAME, APP_VERSION } from '../utils/validators';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showVerify, setShowVerify] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  if (!user) return null;

  const handleVerify = () => {
    updateUser({ verified: true, verificationDate: new Date().toISOString() });
    setUploaded(true);
    setTimeout(() => setShowVerify(false), 2000);
  };

  const infoItems = [
    { icon: FiUser, label: 'Nom', value: `${user.firstName} ${user.lastName}` },
    { icon: FiMail, label: 'Email', value: user.email },
    { icon: FiPhone, label: 'Téléphone', value: user.phone },
    { icon: FiMapPin, label: 'Localisation', value: `${user.city}, ${user.country === 'BJ' ? 'Bénin 🇧🇯' : 'Russie 🇷🇺'}` },
    { icon: FiShield, label: 'Passeport', value: user.passportNumber },
  ];

  const transferCount = JSON.parse(localStorage.getItem('transfers') || '[]').filter(t => t.userId === user.id).length;
  const completedCount = JSON.parse(localStorage.getItem('transfers') || '[]').filter(t => t.userId === user.id && t.status === 'completed').length;

  return (
    <div>
      <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none', padding: '32px 20px' }}>
        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: '3px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2.2rem', fontWeight: 800, backdropFilter: 'blur(10px)' }}>
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
        <h3 style={{ marginBottom: '4px', fontSize: '1.3rem', fontWeight: 700 }}>{user.firstName} {user.lastName}</h3>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{user.email}</p>
        <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
          {user.verified ? (
            <span className="verified-badge"><FiCheckCircle size={14} /> Identité vérifiée</span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.15)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>⚠️ Non vérifié</span>
          )}
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.1)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>{user.role === 'admin' ? '👑 Admin' : '👤 Client'}</span>
        </div>
      </div>

      {!user.verified && (
        <div onClick={() => setShowVerify(true)} style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', padding: '16px 20px', borderRadius: '16px', marginBottom: '16px', color: '#92400E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '1.5rem' }}>🛡️</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Vérifiez votre identité</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>Gagnez la confiance des autres utilisateurs</div>
          </div>
          <FiChevronRight />
        </div>
      )}

      {showVerify && (
        <div className="card animate-slide-up">
          <div className="card-title">Vérification d'identité</div>
          {!uploaded ? (
            <>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', lineHeight: 1.6, marginBottom: '16px' }}>Pour gagner le badge "Identité vérifiée", téléchargez une photo de votre passeport.</p>
              <div style={{ border: '2px dashed var(--primary)', borderRadius: '14px', padding: '40px 20px', textAlign: 'center', marginBottom: '16px', background: 'rgba(79,70,229,0.03)', cursor: 'pointer' }}>
                <FiCamera size={40} color="var(--primary)" style={{ marginBottom: '12px' }} />
                <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>Cliquez pour télécharger</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG, PNG ou PDF (max 5MB)</div>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-secondary" onClick={() => setShowVerify(false)}>Annuler</button>
                <button className="btn btn-primary" onClick={handleVerify}><FiUpload /> Vérifier</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
              <div style={{ fontWeight: 700, color: 'var(--success)', fontSize: '1.1rem' }}>Identité vérifiée !</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Votre compte est maintenant certifié.</p>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <div className="card-title">Informations personnelles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {infoItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <item.icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Réseau mobile</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: user.phoneNetwork === 'MTN' ? '#FFCC20' : user.phoneNetwork === 'Moov' ? '#0066CC' : '#00A651', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem' }}>
            {user.phoneNetwork?.[0] || '?'}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Opérateur détecté</div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{user.phoneNetwork || 'Non détecté'}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{transferCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Transferts</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--success)' }}>{completedCount}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Complétés</div>
        </div>
      </div>

      <div onClick={() => navigate('/settings')} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <FiSettings size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>Paramètres</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PIN, mode sombre</div>
          </div>
        </div>
        <FiChevronRight color="var(--text-muted)" />
      </div>

      <div className="card" style={{ background: 'var(--bg)', border: '1px dashed var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiInfo size={20} color="var(--text-muted)" />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{APP_NAME}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Version {APP_VERSION} • Mis à jour Mai 2026</div>
          </div>
        </div>
      </div>

      <button className="btn btn-danger" onClick={() => { logout(); navigate('/login'); }} style={{ marginBottom: '20px' }}>
        <FiLogOut /> Se déconnecter
      </button>
    </div>
  );
}
