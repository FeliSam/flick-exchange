import React, { useState } from 'react';
import { useTransfer } from '../context/TransferContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FiChevronDown, FiChevronUp, FiRepeat, FiSearch, FiDownload, FiFileText } from 'react-icons/fi';
import { generateReceipt } from '../utils/validators';

export default function History() {
  const { getUserTransfers } = useTransfer();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const transfers = getUserTransfers();

  const filtered = transfers.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const term = search.toLowerCase();
    const matchesSearch = !term ||
      t.id.toLowerCase().includes(term) ||
      (t.recipient.fullName || `${t.recipient.firstName} ${t.recipient.lastName}`).toLowerCase().includes(term) ||
      t.recipient.phone.includes(term) ||
      t.amountSent.toString().includes(term);
    return matchesFilter && matchesSearch;
  });

  const statusConfig = {
    pending_payment: { label: 'En attente', color: '#F59E0B', bg: '#FFFBEB' },
    payment_received: { label: 'Payé', color: '#3B82F6', bg: '#EFF6FF' },
    processing: { label: 'Traitement', color: '#8B5CF6', bg: '#F5F3FF' },
    completed: { label: 'Terminé', color: '#10B981', bg: '#ECFDF5' },
    cancelled: { label: 'Annulé', color: '#EF4444', bg: '#FEF2F2' }
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
      <div className="card" style={{ padding: '14px' }}>
        <div className="card-title" style={{ marginBottom: '10px' }}>Rechercher</div>
        <div style={{ position: 'relative', marginBottom: '12px' }}>
          <FiSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="search-input" style={{ paddingLeft: '42px' }} placeholder="Nom, numéro, montant, ID..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[{ key: 'all', label: 'Tous' }, { key: 'pending_payment', label: 'En attente' }, { key: 'processing', label: 'En cours' }, { key: 'completed', label: 'Terminés' }].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{ padding: '8px 16px', borderRadius: '20px', border: 'none', background: filter === f.key ? 'var(--primary)' : 'var(--bg)', color: filter === f.key ? 'white' : 'var(--text)', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', boxShadow: filter === f.key ? '0 4px 12px rgba(79,70,229,0.25)' : 'none' }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px 20px' }}>
            <FiRepeat size={40} color="var(--border)" style={{ marginBottom: '12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Aucun transfert trouvé</p>
          </div>
        ) : (
          filtered.map(t => (
            <div key={t.id} className="card" style={{ padding: '16px' }}>
              <div onClick={() => setExpandedId(expandedId === t.id ? null : t.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t.amountSent.toLocaleString()} {t.currencyFrom}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>→ {t.amountReceived.toLocaleString()} {t.currencyTo}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{format(new Date(t.createdAt), 'dd MMM yyyy • HH:mm', { locale: fr })}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-block', padding: '5px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: statusConfig[t.status].bg, color: statusConfig[t.status].color }}>{statusConfig[t.status].label}</span>
                  <div style={{ marginTop: '8px', color: 'var(--text-muted)' }}>{expandedId === t.id ? <FiChevronUp /> : <FiChevronDown />}</div>
                </div>
              </div>

              {expandedId === t.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>ID</span><span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.id}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Destinataire</span><span style={{ fontWeight: 500 }}>{t.recipient.fullName || `${t.recipient.firstName} ${t.recipient.lastName}`}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Téléphone</span><span>{t.recipient.phone}</span></div>
                    {t.recipient.network && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Réseau</span><span>{t.recipient.network}</span></div>}
                    {t.recipient.bankName && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Banque</span><span>{t.recipient.bankName}</span></div>}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Direction</span><span>{t.direction === 'BJ_TO_RU' ? 'Bénin → Russie' : 'Russie → Bénin'}</span></div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Expéditeur</span><span>{t.senderName}</span></div>
                    {t.receiptUrl && <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-muted)' }}>Reçu</span><span style={{ color: 'var(--success)', fontWeight: 600 }}>✅ Envoyé</span></div>}
                    <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg)', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-light)' }}>Progression</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[{ done: true, label: 'Demande créée' }, { done: t.steps.paymentReceived, label: 'Paiement reçu' }, { done: t.steps.transferSent, label: 'Transfert effectué' }].map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: step.done ? 'var(--success)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step.done ? 'white' : 'var(--text-muted)', fontSize: '0.65rem' }}>{step.done ? '✓' : idx + 1}</div>
                            <span style={{ fontSize: '0.85rem', color: step.done ? 'var(--text)' : 'var(--text-muted)' }}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <button className="receipt-btn" onClick={() => downloadReceipt(t)} style={{ marginTop: '8px', width: '100%', justifyContent: 'center' }}>
                      <FiDownload /> Télécharger le reçu
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
