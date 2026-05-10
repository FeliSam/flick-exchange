import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransfer } from '../../context/TransferContext';
import { FiUsers, FiRepeat, FiDollarSign, FiTrendingUp, FiArrowRight, FiAlertCircle, FiCheckCircle, FiDownload, FiFileText } from 'react-icons/fi';
import { generateReceipt } from '../../utils/validators';

export default function Dashboard() {
  const navigate = useNavigate();
  const { transfers } = useTransfer();
  const [expandedTransfer, setExpandedTransfer] = useState(null);

  // Stats globales
  const stats = {
    totalTransfers: transfers.length,
    pending: transfers.filter(t => t.status === 'pending_payment').length,
    completed: transfers.filter(t => t.status === 'completed').length,
    totalVolume: transfers.reduce((acc, t) => acc + t.amountSent, 0),
    totalFees: transfers.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.fees, 0)
  };

  // Stats par devise
  const xofTransfers = transfers.filter(t => t.currencyFrom === 'XOF');
  const rubTransfers = transfers.filter(t => t.currencyFrom === 'RUB');

  const xofStats = {
    count: xofTransfers.length,
    volume: xofTransfers.reduce((acc, t) => acc + t.amountSent, 0),
    fees: xofTransfers.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.fees, 0),
    completed: xofTransfers.filter(t => t.status === 'completed').length
  };

  const rubStats = {
    count: rubTransfers.length,
    volume: rubTransfers.reduce((acc, t) => acc + t.amountSent, 0),
    fees: rubTransfers.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.fees, 0),
    completed: rubTransfers.filter(t => t.status === 'completed').length
  };

  const recentTransfers = transfers.slice(0, 5);

  const downloadReceipt = (transfer) => {
    const text = generateReceipt(transfer);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reçu-${transfer.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.3rem', marginBottom: '4px', fontWeight: 800 }}>Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Vue d'ensemble Flick-exchange</p>
      </div>

      {/* Stats globales */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><FiRepeat size={20} /></div>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>{stats.totalTransfers}</div>
          </div>
          <div className="stat-label">Transferts totaux</div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}><FiAlertCircle size={20} /></div>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--warning)' }}>{stats.pending}</div>
          </div>
          <div className="stat-label">En attente</div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}><FiCheckCircle size={20} /></div>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--success)' }}>{stats.completed}</div>
          </div>
          <div className="stat-label">Terminés</div>
        </div>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--info)' }}><FiDollarSign size={20} /></div>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--info)' }}>{Math.round(stats.totalVolume).toLocaleString()}</div>
          </div>
          <div className="stat-label">Volume total</div>
        </div>
      </div>

      {/* Revenus */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '4px' }}>Revenus (frais)</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{Math.round(stats.totalFees).toLocaleString()} XOF</div>
          </div>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiTrendingUp size={24} /></div>
        </div>
      </div>

      {/* Stats par devise */}
      <div className="card">
        <div className="card-title">Par devise</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🇧🇯 XOF (Bénin)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{xofStats.count}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>transferts</div>
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{xofStats.volume.toLocaleString()} XOF</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>volume • {xofStats.fees.toLocaleString()} frais</div>
            </div>
          </div>
          <div style={{ padding: '16px', background: 'var(--bg)', borderRadius: '12px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>🇷🇺 RUB (Russie)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>{rubStats.count}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>transferts</div>
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{rubStats.volume.toLocaleString()} RUB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>volume • {rubStats.fees.toLocaleString()} frais</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={() => navigate('/admin/transfers')} style={{ flex: 1 }}>Gérer les transferts <FiArrowRight /></button>
      </div>

      {/* Recent transfers */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="card-title" style={{ margin: 0 }}>Dernières demandes</div>
          <button onClick={() => navigate('/admin/transfers')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Voir tout →</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentTransfers.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Aucun transfert</p>
          ) : (
            recentTransfers.map(t => (
              <div key={t.id}>
                <div onClick={() => setExpandedTransfer(expandedTransfer === t.id ? null : t.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px', background: 'var(--bg)', borderRadius: '12px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{t.userName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.amountSent.toLocaleString()} {t.currencyFrom} → {t.amountReceived.toLocaleString()} {t.currencyTo}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge badge-${t.status.replace('_', '-')}`}>
                      {t.status === 'pending_payment' && '⏳'}
                      {t.status === 'payment_received' && '💰'}
                      {t.status === 'completed' && '✅'}
                    </span>
                    <button className="receipt-btn" onClick={(e) => { e.stopPropagation(); downloadReceipt(t); }}><FiDownload /></button>
                  </div>
                </div>
                {expandedTransfer === t.id && (
                  <div style={{ padding: '12px', background: 'var(--bg)', borderRadius: '0 0 12px 12px', marginTop: '-4px', fontSize: '0.85rem', color: 'var(--text-light)' }}>
                    <div>Destinataire: {t.recipient.fullName || `${t.recipient.firstName} ${t.recipient.lastName}`}</div>
                    <div>Téléphone: {t.recipient.phone}</div>
                    <div>Expéditeur: {t.senderName}</div>
                    <div>Date: {new Date(t.createdAt).toLocaleString('fr-FR')}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
