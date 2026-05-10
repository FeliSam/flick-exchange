import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiRepeat } from 'react-icons/fi';
import { useTransfer } from '../context/TransferContext';

export default function History() {
  const { getUserTransfers } = useTransfer();
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const transfers = getUserTransfers();
  const filtered = filter === 'all' ? transfers : transfers.filter(t => t.status === filter);

  const statusConfig = {
    pending_payment: { label: 'En attente', color: '#F59E0B', bg: '#FFFBEB' },
    payment_received: { label: 'Payé', color: '#3B82F6', bg: '#EFF6FF' },
    processing: { label: 'Traitement', color: '#8B5CF6', bg: '#F5F3FF' },
    completed: { label: 'Terminé', color: '#10B981', bg: '#ECFDF5' },
    cancelled: { label: 'Annulé', color: '#EF4444', bg: '#FEF2F2' }
  };

  const downloadReceipt = (transfer) => {
    const printWindow = window.open('', '_blank');
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reçu de Transfert - ${transfer.id}</title>
          <style>
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
            ✅ Transfert ${statusConfig[transfer.status].label}
          </div>
          
          <div class="details">
            <div class="row">
              <span class="label">ID du transfert:</span>
              <span class="value">${transfer.id}</span>
            </div>
            <div class="row">
              <span class="label">Date:</span>
              <span class="value">${format(new Date(transfer.createdAt), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
            </div>
            <div class="row">
              <span class="label">Expéditeur:</span>
              <span class="value">${transfer.senderName}</span>
            </div>
            <div class="row">
              <span class="label">Destinataire:</span>
              <span class="value">${transfer.recipient.fullName || `${transfer.recipient.firstName} ${transfer.recipient.lastName}`}</span>
            </div>
            <div class="row">
              <span class="label">Téléphone destinataire:</span>
              <span class="value">${transfer.recipient.phone}</span>
            </div>
            <div class="row">
              <span class="label">Direction:</span>
              <span class="value">${transfer.direction === 'BJ_TO_RU' ? 'Bénin → Russie' : 'Russie → Bénin'}</span>
            </div>
            <div class="row">
              <span class="label">Montant envoyé:</span>
              <span class="amount">${transfer.amountSent.toLocaleString()} ${transfer.currencyFrom}</span>
            </div>
            <div class="row">
              <span class="label">Montant reçu:</span>
              <span class="amount">${transfer.amountReceived.toLocaleString()} ${transfer.currencyTo}</span>
            </div>
            <div class="row">
              <span class="label">Frais:</span>
              <span class="value">${transfer.fees.toLocaleString()} ${transfer.currencyFrom}</span>
            </div>
            <div class="row">
              <span class="label">Taux de change:</span>
              <span class="value">1 ${transfer.currencyFrom} = ${(transfer.currencyFrom === 'XOF' ? (1/transfer.rate).toFixed(4) : transfer.rate.toFixed(2))} ${transfer.currencyTo}</span>
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
    printWindow.print();
  };

  return (
    <div>
      <div className="card" style={{ padding: '14px' }}>
        <div className="card-title" style={{ marginBottom: '10px' }}>Filtrer</div>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { key: 'all', label: 'Tous' },
            { key: 'pending_payment', label: 'En attente' },
            { key: 'processing', label: 'En cours' },
            { key: 'completed', label: 'Terminés' }
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '8px 16px', borderRadius: '20px', border: 'none',
              background: filter === f.key ? 'var(--primary)' : 'var(--bg)',
              color: filter === f.key ? 'white' : 'var(--text)',
              fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
              boxShadow: filter === f.key ? '0 4px 12px rgba(79,70,229,0.25)' : 'none'
            }}>{f.label}</button>
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
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {format(new Date(t.createdAt), 'dd MMM yyyy • HH:mm', { locale: fr })}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    display: 'inline-block', padding: '5px 12px', borderRadius: '20px',
                    fontSize: '0.75rem', fontWeight: 600,
                    background: statusConfig[t.status].bg, color: statusConfig[t.status].color
                  }}>{statusConfig[t.status].label}</span>
                  <div style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                    {expandedId === t.id ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>
              </div>

              {expandedId === t.id && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>ID</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-light)' }}>{t.id}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Destinataire</span>
                      <span style={{ fontWeight: 500 }}>{t.recipient.fullName || `${t.recipient.firstName} ${t.recipient.lastName}`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Téléphone</span>
                      <span>{t.recipient.phone}</span>
                    </div>
                    {t.recipient.network && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Réseau</span>
                        <span>{t.recipient.network}</span>
                      </div>
                    )}
                    {t.recipient.bankName && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Banque</span>
                        <span>{t.recipient.bankName}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Direction</span>
                      <span>{t.direction === 'BJ_TO_RU' ? 'Bénin → Russie' : 'Russie → Bénin'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Expéditeur</span>
                      <span>{t.senderName}</span>
                    </div>
                    
                    {t.status === 'completed' && (
                      <div style={{ marginTop: '16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => downloadReceipt(t)}
                          style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '10px',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <FiDownload size={16} /> Télécharger le reçu
                        </button>
                      </div>
                    )}
                    
                    <div style={{ marginTop: '8px', padding: '12px', background: 'var(--bg)', borderRadius: '10px' }}>
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '8px', color: 'var(--text-light)' }}>Progression</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[
                          { done: true, label: 'Demande créée' },
                          { done: t.steps.paymentReceived, label: 'Paiement reçu' },
                          { done: t.steps.transferSent, label: 'Transfert effectué' }
                        ].map((step, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '20px', height: '20px', borderRadius: '50%',
                              background: step.done ? 'var(--success)' : 'var(--border)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: step.done ? 'white' : 'var(--text-muted)', fontSize: '0.65rem'
                            }}>{step.done ? '✓' : idx + 1}</div>
                            <span style={{ fontSize: '0.85rem', color: step.done ? 'var(--text)' : 'var(--text-muted)' }}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
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
