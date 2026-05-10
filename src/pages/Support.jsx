import React, { useState } from 'react';
import { FiPhone, FiMail, FiSend, FiZap, FiInfo } from 'react-icons/fi';
import { APP_NAME, APP_VERSION } from '../utils/validators';

export default function Support() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messages = JSON.parse(localStorage.getItem('support_messages') || '[]');
    messages.push({ id: Date.now(), text: message, from: 'user', createdAt: new Date().toISOString() });
    localStorage.setItem('support_messages', JSON.stringify(messages));
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', color: 'white', border: 'none' }}>
        <h3 style={{ marginBottom: '8px', fontSize: '1.2rem', fontWeight: 700 }}>Comment pouvons-nous vous aider ?</h3>
        <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Notre équipe est disponible pour vous assister.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <a href="tel:+22900000000" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'var(--primary)' }}>
              <FiPhone size={24} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Appeler</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>+229 00 00 00 00</div>
          </div>
        </a>
        <a href="mailto:support@flick-exchange.com" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ textAlign: 'center', padding: '24px 12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(79,70,229,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: 'var(--primary)' }}>
              <FiMail size={24} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text)' }}>Email</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>support@flick-exchange.com</div>
          </div>
        </a>
      </div>

      <div className="card">
        <div className="card-title">Envoyer un message</div>
        {sent && (
          <div style={{ background: '#ECFDF5', color: '#065F46', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FiZap /> Message envoyé ! Nous vous répondrons sous peu.
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Votre message</label>
            <textarea className="input" rows="4" placeholder="Décrivez votre problème ou question..." value={message} onChange={e => setMessage(e.target.value)} required style={{ resize: 'none' }} />
          </div>
          <button type="submit" className="btn btn-primary"><FiSend /> Envoyer</button>
        </form>
      </div>

      <div className="card">
        <div className="card-title">Questions fréquentes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { q: 'Combien de temps prend un transfert ?', a: 'Les transferts sont traités sous 2h ouvrables après confirmation du paiement.' },
            { q: 'Quels sont les frais ?', a: 'Nous appliquons une commission de 2.5% sur chaque transfert.' },
            { q: 'Puis-je annuler un transfert ?', a: "Oui, tant que le paiement n'a pas été confirmé." },
            { q: 'Comment suivre mon transfert ?', a: "Rendez-vous dans l'historique pour voir la progression." },
            { q: 'Les numéros béninois sont-ils vérifiés ?', a: "Oui, nous vérifions automatiquement le réseau (MTN, Moov, Celtiis)." }
          ].map((faq, idx) => (
            <div key={idx} style={{ padding: '14px', background: 'var(--bg)', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px', color: 'var(--text)' }}>{faq.q}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: 1.5 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: 'var(--bg)', border: '1px dashed var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FiInfo size={20} color="var(--text-muted)" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)' }}>{APP_NAME} v{APP_VERSION}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Dernière mise à jour : Mai 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
