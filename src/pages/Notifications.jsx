import React from 'react';
import { useTransfer } from '../context/TransferContext';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiBell, FiCheckCircle } from 'react-icons/fi';

export default function Notifications() {
  const { getNotifications, markNotificationRead } = useTransfer();
  const notifications = getNotifications();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Notifications</h2>
        {notifications.some(n => !n.read) && (
          <button onClick={() => notifications.filter(n => !n.read).forEach(n => markNotificationRead(n.id))}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            Tout lire
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FiBell size={48} color="var(--border)" style={{ marginBottom: '16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Aucune notification</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map(n => (
            <div key={n.id} onClick={() => markNotificationRead(n.id)} style={{ 
              background: 'white', padding: '16px', borderRadius: '14px',
              borderLeft: `4px solid ${n.read ? 'var(--border)' : 'var(--primary)'}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)', cursor: 'pointer',
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{n.title}</div>
                {!n.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5, marginBottom: '8px' }}>{n.message}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <FiCheckCircle size={12} /> {formatDistanceToNow(new Date(n.createdAt), { locale: fr, addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
