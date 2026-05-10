import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiArrowRight, FiClock, FiDollarSign, FiRepeat, FiShield, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTransfer } from '../context/TransferContext';
import { useExchangeRate } from '../hooks/useExchangeRate';

export default function Home() {
  const { user } = useAuth();
  const { getUserTransfers } = useTransfer();
  const { rate, lastUpdate } = useExchangeRate();
  const navigate = useNavigate();
  const transfers = getUserTransfers().slice(0, 3);
  const pendingCount = transfers.filter(t => t.status === 'pending_payment').length;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bon retour,</div>
        <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
          {user?.firstName} {user?.lastName}
          {user?.verified && <span style={{ marginLeft: '8px', fontSize: '0.7rem' }}>✅</span>}
        </div>
      </div>

      <div className="rate-banner">
        <div>
          <div className="rate-label">Taux du jour</div>
          <div className="rate-value">1 RUB = {rate.toFixed(2)} XOF</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiClock size={12} /> Mis à jour {formatDistanceToNow(lastUpdate, { locale: fr, addSuffix: true })}
          </div>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FiDollarSign size={24} />
        </div>
      </div>

      {/* Calculator shortcut */}
      <div onClick={() => navigate('/calculator')} style={{ 
        background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)', padding: '14px 20px',
        borderRadius: '14px', marginBottom: '16px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #BBF7D0'
      }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
          <FiRepeat size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#065F46' }}>Calculatrice de transfert</div>
          <div style={{ fontSize: '0.8rem', color: '#047857' }}>Estimez sans connexion →</div>
        </div>
        <FiArrowRight color="#065F46" />
      </div>

      <div className="card" style={{ padding: '16px' }}>
        <div className="card-title" style={{ marginBottom: '16px' }}>Nouveau transfert</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button className="btn btn-primary" onClick={() => navigate('/transfer', { state: { direction: 'BJ_TO_RU' } })} style={{ flexDirection: 'column', padding: '24px 12px', borderRadius: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <FiTrendingUp size={24} />
            </div>
            <span style={{ fontSize: '0.85rem' }}>Bénin → Russie</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>Envoyer en RUB</span>
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/transfer', { state: { direction: 'RU_TO_BJ' } })} style={{ flexDirection: 'column', padding: '24px 12px', borderRadius: '14px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
              <FiTrendingDown size={24} />
            </div>
            <span style={{ fontSize: '0.85rem' }}>Russie → Bénin</span>
            <span style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>Envoyer en XOF</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{transfers.length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Transferts</div>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--success)' }}>{transfers.filter(t => t.status === 'completed').length}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Terminés</div>
        </div>
        <div className="card" style={{ padding: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--warning)' }}>{pendingCount}</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>En attente</div>
        </div>
      </div>

      {pendingCount > 0 && (
        <div onClick={() => navigate('/history')} style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', padding: '16px 20px', borderRadius: '16px', marginBottom: '16px', color: '#92400E', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '1.5rem' }}>⏳</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{pendingCount} transfert{pendingCount > 1 ? 's' : ''} en attente</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '2px' }}>Finalisez le paiement pour lancer le transfert</div>
          </div>
          <FiArrowRight />
        </div>
      )}

      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="card-title" style={{ margin: 0 }}>Derniers transferts</div>
          <button onClick={() => navigate('/history')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Voir tout →</button>
        </div>
        {transfers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
            <FiRepeat size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem' }}>Aucun transfert pour le moment</p>
            <button className="btn btn-primary" style={{ marginTop: '16px', maxWidth: '200px', margin: '16px auto 0' }} onClick={() => navigate('/transfer')}>Effectuer un transfert</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {transfers.map(t => (
              <div key={t.id} onClick={() => navigate('/history')} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg)', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)' }}>{t.amountSent.toLocaleString()} {t.currencyFrom}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→ {t.amountReceived.toLocaleString()} {t.currencyTo} • {t.recipient.fullName || `${t.recipient.firstName} ${t.recipient.lastName}`}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className={`badge badge-${t.status.replace('_', '-')}`}>
                    {t.status === 'pending_payment' && 'En attente'}
                    {t.status === 'payment_received' && 'Payé'}
                    {t.status === 'processing' && 'Traitement'}
                    {t.status === 'completed' && 'Terminé'}
                    {t.status === 'cancelled' && 'Annulé'}
                  </span>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>{formatDistanceToNow(new Date(t.createdAt), { locale: fr, addSuffix: true })}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)', padding: '16px', borderRadius: '16px', marginTop: '8px', border: '1px solid #A7F3D0', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
          <FiShield size={20} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#065F46' }}>Transferts sécurisés</div>
          <p style={{ fontSize: '0.8rem', color: '#047857', lineHeight: 1.5, marginTop: '2px' }}>Vos transactions sont vérifiées manuellement sous 2h ouvrables.</p>
        </div>
      </div>
    </div>
  );
}
