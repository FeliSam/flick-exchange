import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { FiCheck, FiChevronDown, FiChevronUp, FiDownload, FiGlobe, FiMapPin, FiPhone, FiUser, FiX } from 'react-icons/fi';
import { useTransfer } from '../../context/TransferContext';

// Fonction utilitaire pour échapper le HTML (prévention XSS)
function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fonction utilitaire pour formater un montant en toute sécurité
function safeAmount(value, currency = '') {
  const num = Number(value) || 0;
  return `${num.toLocaleString()} ${currency}`;
}

// Fonction utilitaire pour formater une date en toute sécurité
function safeDate(dateValue) {
  if (!dateValue) return '-';
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return '-';
    return format(d, 'dd/MM/yyyy à HH:mm', { locale: fr });
  } catch {
    return '-';
  }
}

export default function TransfersManagement() {
  const { transfers, updateTransferStatus } = useTransfer();
  const [filter, setFilter] = useState('all');
  const [expandedTransfers, setExpandedTransfers] = useState(new Set());
  const filtered = filter === 'all' ? transfers : transfers.filter(t => t.status === filter);

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

  const toggleExpanded = (id) => {
    const newExpanded = new Set(expandedTransfers);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedTransfers(newExpanded);
  };

  const downloadReceipt = (transfer) => {
    const printWindow = window.open('', '_blank');
    const statusConfig = {
      pending_payment: 'En attente',
      payment_received: 'Payé',
      processing: 'En traitement',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };
    
    // Données sécurisées avec fallback
    const recipientName = escapeHtml(
      transfer.recipient?.fullName || 
      (transfer.recipient?.firstName && transfer.recipient?.lastName 
        ? `${transfer.recipient.firstName} ${transfer.recipient.lastName}` 
        : '-')
    );
    const recipientPhone = escapeHtml(transfer.recipient?.phone || '-');
    const senderName = escapeHtml(transfer.senderName || '-');
    const direction = transfer.direction === 'BJ_TO_RU' ? 'Bénin → Russie' : 
                      transfer.direction === 'RU_TO_BJ' ? 'Russie → Bénin' : '-';
    const amountSent = safeAmount(transfer.amountSent, transfer.currencyFrom);
    const amountReceived = safeAmount(transfer.amountReceived, transfer.currencyTo);
    const fees = safeAmount(transfer.fees, transfer.currencyFrom);
    
    // Calcul du taux de change sécurisé
    let rateDisplay = '-';
    if (transfer.rate && transfer.rate > 0 && transfer.currencyFrom && transfer.currencyTo) {
      const rate = transfer.currencyFrom === 'XOF' 
        ? (1 / transfer.rate).toFixed(4) 
        : transfer.rate.toFixed(2);
      rateDisplay = `1 ${transfer.currencyFrom} = ${rate} ${transfer.currencyTo}`;
    }
    
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de Transfert - ${escapeHtml(transfer.id)}</title>
          <style>
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #4F46E5; margin-bottom: 10px; }
            .title { font-size: 18px; color: #666; }
            .details { margin: 20px 0; }
            .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .amount { font-size: 20px; font-weight: bold; color: #4F46E5; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
            .status { text-align: center; padding: 10px; background: #ECFDF5; color: #065F46; border-radius: 8px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">FLICK-EXCHANGE</div>
            <div class="title">Reçu de Transfert</div>
          </div>
          
          <div class="status">
            ✅ Transfert ${escapeHtml(statusConfig[transfer.status] || transfer.status || 'inconnu')}
          </div>
          
          <div class="details">
            <div class="row">
              <span class="label">ID du transfert:</span>
              <span class="value">${escapeHtml(transfer.id || '-')}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${safeDate(transfer.createdAt)}</span>
            </div>
            <div class="row">
              <span class="label">Expéditeur:</span>
              <span class="value">${senderName}</span>
            </div>
            <div class="row">
              <span class="label">Destinataire:</span>
              <span class="value">${recipientName}</span>
            </div>
            <div class="row">
              <span class="label">Téléphone destinataire:</span>
              <span class="value">${recipientPhone}</span>
            </div>
            <div class="row">
              <span class="label">Direction:</span>
              <span class="value">${direction}</span>
            </div>
            <div class="row">
              <span class="label">Montant envoyé:</span>
              <span class="amount">${amountSent}</span>
            </div>
            <div class="row">
              <span class="label">Montant reçu:</span>
              <span class="amount">${amountReceived}</span>
            </div>
            <div class="row">
              <span class="label">Frais:</span>
              <span class="value">${fees}</span>
            </div>
            <div class="row">
              <span class="label">Taux de change:</span>
              <span class="value">${rateDisplay}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Merci d'avoir choisi Flick-exchange pour vos transferts d'argent.</p>
            <p>Conservez ce reçu pour vos archives.</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    
    // Attendre le chargement avant d'imprimer
    printWindow.onload = () => {
      printWindow.print();
    };
    // Fallback si onload ne se déclenche pas
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Fonction utilitaire pour le rendu JSX sécurisé
  const getRecipientName = (t) => {
    if (!t.recipient) return '-';
    return t.recipient.fullName || 
      (t.recipient.firstName && t.recipient.lastName 
        ? `${t.recipient.firstName} ${t.recipient.lastName}` 
        : '-');
  };

  return (
    <div>
      <div style={{ marginBottom: '16px' }}>
        <div className="card-title">Filtrer par statut</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'pending_payment', label: 'En attente' },
            { key: 'payment_received', label: 'Payé' },
            { key: 'completed', label: 'Terminé' },
            { key: 'cancelled', label: 'Annulé' }
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '6px 14px', borderRadius: '16px', border: 'none',
              background: filter === f.key ? 'var(--primary)' : 'var(--bg)',
              color: filter === f.key ? 'white' : 'var(--text)',
              fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer'
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(t => {
          const isExpanded = expandedTransfers.has(t.id);
          return (
            <div key={t.id} className="card" style={{ padding: '16px' }}>
              {/* Header - Always visible */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{t.userName || '-'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <FiPhone size={12} /> {t.userPhone || '-'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {(t.amountSent ?? 0).toLocaleString()} {t.currencyFrom || ''} → {(t.amountReceived ?? 0).toLocaleString()} {t.currencyTo || ''}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className={`badge badge-${t.status?.replace('_', '-')}`}>
                    {t.status === 'pending_payment' && '⏳ En attente'}
                    {t.status === 'payment_received' && '💰 Payé'}
                    {t.status === 'processing' && '⚙️ Traitement'}
                    {t.status === 'completed' && '✅ Terminé'}
                    {t.status === 'cancelled' && '❌ Annulé'}
                  </span>
                  <button 
                    onClick={() => toggleExpanded(t.id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'var(--text-muted)', 
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px'
                    }}
                  >
                    {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Expandable Details */}
              {isExpanded && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                  {/* Amount */}
                  <div style={{ background: 'var(--bg)', padding: '14px', borderRadius: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Montant envoyé</span>
                      <span style={{ fontWeight: 700 }}>{(t.amountSent ?? 0).toLocaleString()} {t.currencyFrom || ''}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Montant reçu</span>
                      <span style={{ fontWeight: 700 }}>{(t.amountReceived ?? 0).toLocaleString()} {t.currencyTo || ''}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Frais</span>
                      <span>{(t.fees ?? 0).toLocaleString()} {t.currencyFrom || ''}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date</span>
                      <span>{safeDate(t.createdAt)}</span>
                    </div>
                  </div>

                  {/* Sender Info */}
                  <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(79,70,229,0.04)', borderRadius: '10px', border: '1px solid rgba(79,70,229,0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiUser size={14} /> Expéditeur
                    </div>
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
                      <div><strong>Nom:</strong> {t.senderName || '-'}</div>
                      <div><strong>Téléphone:</strong> {t.senderPhone || 'N/A'}</div>
                      <div><strong>Type:</strong> {t.senderOption === 'my_account' ? 'Depuis mon compte' : 'Depuis un autre compte'}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FiMapPin size={12} /> {t.senderInfo?.city || '-'}, {t.senderInfo?.country === 'BJ' ? 'Bénin' : t.senderInfo?.country === 'RU' ? 'Russie' : '-'}
                      </div>
                    </div>
                  </div>

                  {/* Recipient Info */}
                  <div style={{ marginBottom: '14px', padding: '12px', background: 'rgba(16,185,129,0.04)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.1)' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FiGlobe size={14} /> Destinataire
                    </div>
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.7 }}>
                      <div><strong>Nom:</strong> {getRecipientName(t)}</div>
                      <div><strong>Téléphone:</strong> {t.recipient?.phone || '-'}</div>
                      {t.recipient?.network && <div><strong>Réseau:</strong> {t.recipient.network}</div>}
                      {t.recipient?.bankName && <div><strong>Banque:</strong> {t.recipient.bankName}</div>}
                      <div><strong>Direction:</strong> {t.direction === 'BJ_TO_RU' ? '🇧🇯 Bénin → 🇷🇺 Russie' : t.direction === 'RU_TO_BJ' ? '🇷🇺 Russie → 🇧🇯 Bénin' : '-'}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {t.status === 'pending_payment' && (
                      <>
                        <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleConfirmPayment(t.id)}>
                          <FiCheck /> Confirmer paiement
                        </button>
                        <button className="btn btn-danger btn-sm" style={{ padding: '10px 16px' }} onClick={() => handleCancel(t.id)}>
                          <FiX />
                        </button>
                      </>
                    )}
                    {t.status === 'payment_received' && (
                      <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleConfirmTransfer(t.id)}>
                        <FiCheck /> Confirmer envoi final
                      </button>
                    )}
                    {t.status === 'completed' && (
                      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ textAlign: 'center', padding: '10px', background: '#ECFDF5', color: '#065F46', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}>
                          ✅ Transfert complété
                        </div>
                        <button 
                          onClick={() => downloadReceipt(t)}
                          style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <FiDownload size={14} /> Télécharger reçu
                        </button>
                      </div>
                    )}
                    {t.status === 'cancelled' && (
                      <div style={{ width: '100%', textAlign: 'center', padding: '10px', background: '#FEF2F2', color: '#991B1B', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 700 }}>
                        ❌ Transfert annulé
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}