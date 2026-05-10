import React, { useState } from 'react';
import { useTransfer } from '../../context/TransferContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiCheck, FiX, FiUser, FiPhone, FiMapPin, FiGlobe, FiChevronDown, FiChevronUp, FiDownload, FiFileText } from 'react-icons/fi';
import { generateReceipt } from '../../utils/validators';

export default function TransfersManagement() {
  const { transfers, updateTransferStatus } = useTransfer();
  const [filter, setFilter] = useState('all');
  const [expandedIds, setExpandedIds] = useState({});
  const filtered = filter === 'all' ? transfers : transfers.filter(t => t.status === filter);

  const toggleExpand = (id) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleConfirmPayment = (id) => {
    if (window.confirm('Confirmer la réception du paiement ?')) {
      updateTransferStatus(id, 'payment_received', { paymentReceived: true });
    }
  };

  const handleConfirmTransfer = (id) => {
    if (window.confirm("Confirmer l'envoi du transfert au destinataire ?")) {
      updateTransferStatus(id, 'completed', { transferSent: true });
    }
  };

  const handleCancel = (id) => {
    if (window.confirm('Annuler ce transfert ?')) {
      updateTransferStatus(id, 'cancelled');
    }
  };

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
      <div style={{ marginBottom: '16px' }}>
        <div className="card-title">Filtrer par statut</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[{ key: 'all', label: 'Tous' }, { key: 'pending_payment', label: 'En attente' }, { key: 'payment_received', label: 'Payé' }, { key: 'completed', label: 'Terminé' }, { key: 'cancelled', label: 'Annulé' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '6px 14px', borderRadius: '16px', border: 'none', background: filter === f.key ? 'var(--primary)' : 'var(--bg)', color: filter === f.key ? 'white' : 'var(--text)', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer' }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(t => (
          <div key={t.id} className="card" style={{ padding: '16px' }}>
            {/* Header - toujours visible */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t.userName}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}><FiPhone size={12} /> {t.userPhone}</div>
              </div>
              <span className={`badge badge-${t.status.replace('_', '-')}`}>
                {t.status === 'pending_payment' && '⏳ En attente'}
                {t.status === 'payment_received' && '💰 Payé'}
                {t.status === 'processing' && '⚙️ Traitement'}
                {t.status === 'completed' && '✅ Terminé'}
                {t.status === 'cancelled' && '❌ Annulé'}
              </span>
            </div>

            {/* Mini résumé */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.9rem' }}>
                <span style={{ fontWeight: 700 }}>{t.amountSent.toLocaleString()} {t.currencyFrom}</span>
                <span style={{ color: 'var(--text-muted)', margin: '0 8px' }}>→</span>
                <span>{t.amountReceived.toLocaleString()} {t.currencyTo}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button className="receipt-btn" onClick={() => downloadReceipt(t)}><FiDownload /></button>
                <button onClick={() => toggleExpand(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}>
                  {expandedIds[t.id] ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
            </div>

            {/* Contenu dépliable */}
            {expandedIds[t.id] && (
              <div className="animate-slide-up">
                <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '12px', marginBottom: '14px', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>ID</span><span style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{t.id}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Frais</span><span>{t.fees.toLocaleString()} {t.currencyFrom}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}><span style={{ color: 'var(--text-muted)' }}>Direction</span><span>{t.direction === 'BJ_TO_RU' ? '🇧🇯→🇷🇺' : '🇷🇺→🇧🇯'}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Date</span><span>{format(new Date(t.createdAt), 'dd/MM/yy HH:mm', { locale: fr })}</span></div>
                </div>

                <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(79,70,229,0.04)', borderRadius: '10px', border: '1px solid rgba(79,70,229,0.1)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}><FiUser size={14} /> Expéditeur</div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
                    <div><strong>Nom:</strong> {t.senderName}</div>
                    <div><strong>Téléphone:</strong> {t.senderPhone || 'N/A'}</div>
                    <div><strong>Type:</strong> {t.senderOption === 'my_account' ? 'Depuis mon compte' : 'Depuis un autre compte'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FiMapPin size={12} /> {t.senderInfo?.city}, {t.senderInfo?.country === 'BJ' ? 'Bénin' : 'Russie'}</div>
                  </div>
                </div>

                <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(16,185,129,0.04)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.1)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}><FiGlobe size={14} /> Destinataire</div>
                  <div style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
                    <div><strong>Nom:</strong> {t.recipient.fullName || `${t.recipient.firstName} ${t.recipient.lastName}`}</div>
                    <div><strong>Téléphone:</strong> {t.recipient.phone}</div>
                    {t.recipient.network && <div><strong>Réseau:</strong> {t.recipient.network}</div>}
                    {t.recipient.bankName && <div><strong>Banque:</strong> {t.recipient.bankName}</div>}
                  </div>
                </div>

                {t.receiptUrl && (
                  <div style={{ marginBottom: '14px', padding: '12px', background: '#ECFDF5', borderRadius: '10px', fontSize: '0.85rem', color: '#065F46' }}>
                    <FiFileText size={14} style={{ marginRight: '6px' }} /> Reçu de paiement transmis par le client
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px' }}>
                  {t.status === 'pending_payment' && (
                    <>
                      <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleConfirmPayment(t.id)}><FiCheck /> Confirmer paiement</button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '10px 16px' }} onClick={() => handleCancel(t.id)}><FiX /></button>
                    </>
                  )}
                  {t.status === 'payment_received' && (
                    <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleConfirmTransfer(t.id)}><FiCheck /> Confirmer envoi final</button>
                  )}
                  {t.status === 'completed' && (
                    <div style={{ width: '100%', textAlign: 'center', padding: '10px', background: '#ECFDF5', color: '#065F46', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}>✅ Transfert complété</div>
                  )}
                  {t.status === 'cancelled' && (
                    <div style={{ width: '100%', textAlign: 'center', padding: '10px', background: '#FEF2F2', color: '#991B1B', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}>❌ Transfert annulé</div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
