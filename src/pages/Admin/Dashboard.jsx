import { FiAlertCircle, FiArrowRight, FiCheckCircle, FiDollarSign, FiRepeat, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../../context/TransferContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { transfers } = useTransfer();

  const stats = {
    totalTransfers: transfers.length,
    pending: transfers.filter(t => t.status === 'pending_payment').length,
    completed: transfers.filter(t => t.status === 'completed').length,
    totalVolume: transfers.reduce((acc, t) => acc + t.amountSent, 0),
    totalFees: transfers.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.fees, 0),
    // Separate stats by currency
    xofTransfers: transfers.filter(t => t.currencyFrom === 'XOF'),
    rubTransfers: transfers.filter(t => t.currencyFrom === 'RUB'),
    xofVolume: transfers.filter(t => t.currencyFrom === 'XOF').reduce((acc, t) => acc + t.amountSent, 0),
    rubVolume: transfers.filter(t => t.currencyFrom === 'RUB').reduce((acc, t) => acc + t.amountSent, 0),
    xofFees: transfers.filter(t => t.status === 'completed' && t.currencyFrom === 'XOF').reduce((acc, t) => acc + t.fees, 0),
    rubFees: transfers.filter(t => t.status === 'completed' && t.currencyFrom === 'RUB').reduce((acc, t) => acc + t.fees, 0)
  };

  const recentTransfers = transfers.slice(0, 5);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '4px', fontWeight: 800 }}>Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vue d'ensemble de l'activité Flick-exchange</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <FiRepeat size={20} />
            </div>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{stats.totalTransfers}</div>
          </div>
          <div className="stat-label">Transferts totaux</div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
              <FiAlertCircle size={20} />
            </div>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--warning)' }}>{stats.pending}</div>
          </div>
          <div className="stat-label">En attente</div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
              <FiCheckCircle size={20} />
            </div>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--success)' }}>{stats.completed}</div>
          </div>
          <div className="stat-label">Terminés</div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}>
              <FiDollarSign size={20} />
            </div>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--info)' }}>{Math.round(stats.totalVolume).toLocaleString()}</div>
          </div>
          <div className="stat-label">Volume total</div>
        </div>
      </div>

      {/* Currency-specific Stats */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--text)' }}>Statistiques par devise</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {/* CFA Stats */}
          <div className="admin-card" style={{ border: '2px solid #22C55E' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#22C55E' }}>🇧🇯 CFA (XOF)</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Transferts</span>
              <span style={{ fontWeight: 700 }}>{stats.xofTransfers.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Volume</span>
              <span style={{ fontWeight: 700 }}>{Math.round(stats.xofVolume).toLocaleString()} XOF</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Frais générés</span>
              <span style={{ fontWeight: 700, color: '#22C55E' }}>{Math.round(stats.xofFees).toLocaleString()} XOF</span>
            </div>
          </div>

          {/* Ruble Stats */}
          <div className="admin-card" style={{ border: '2px solid #3B82F6' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#3B82F6' }}>🇷🇺 Ruble (RUB)</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Transferts</span>
              <span style={{ fontWeight: 700 }}>{stats.rubTransfers.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Volume</span>
              <span style={{ fontWeight: 700 }}>{Math.round(stats.rubVolume).toLocaleString()} RUB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Frais générés</span>
              <span style={{ fontWeight: 700, color: '#3B82F6' }}>{Math.round(stats.rubFees).toLocaleString()} RUB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>Revenus générés (frais)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Math.round(stats.totalFees).toLocaleString()} XOF</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiTrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => navigate('/admin/transfers')} style={{ flex: 1 }}>
          Gérer les transferts <FiArrowRight />
        </button>
      </div>

      {/* Recent Transfers */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="card-title" style={{ margin: 0 }}>Dernières demandes</div>
          <button onClick={() => navigate('/admin/transfers')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            Voir tout →
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentTransfers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Aucun transfert</p>
          ) : (
            recentTransfers.map(t => (
              <div key={t.id} onClick={() => navigate('/admin/transfers')} style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px', background: 'var(--bg)', borderRadius: '12px', cursor: 'pointer',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.userName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {t.amountSent.toLocaleString()} {t.currencyFrom} → {t.amountReceived.toLocaleString()} {t.currencyTo}
                  </div>
                </div>
                <span className={`badge badge-${t.status.replace('_', '-')}`}>
                  {t.status === 'pending_payment' && '⏳ En attente'}
                  {t.status === 'payment_received' && '💰 Payé'}
                  {t.status === 'processing' && '⚙️ Traitement'}
                  {t.status === 'completed' && '✅ Terminé'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
