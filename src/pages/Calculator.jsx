import { useState } from 'react';
import { FiRefreshCw, FiTrendingDown, FiTrendingUp } from 'react-icons/fi';
import { useExchangeRate } from '../hooks/useExchangeRate';

export default function Calculator() {
  const { rate, convert } = useExchangeRate();
  const [amount, setAmount] = useState('');
  const [direction, setDirection] = useState('BJ_TO_RU');
  const FEES = 2.5;

  const currencyFrom = direction === 'BJ_TO_RU' ? 'XOF' : 'RUB';
  const currencyTo = direction === 'BJ_TO_RU' ? 'RUB' : 'XOF';
  const numericAmount = parseFloat(amount) || 0;
  const converted = convert(numericAmount, currencyFrom, currencyTo);
  const fees = numericAmount * (FEES / 100);
  const total = numericAmount + fees;
  const final = converted - (converted * (FEES / 100));

  return (
    <div style={{ paddingTop: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', marginBottom: '6px' }}>Calculatrice</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Estimez votre transfert sans connexion</p>
      </div>

      <div className="card">
        <div className="card-title">Direction</div>
        <div className="currency-selector">
          <button className={`currency-btn ${direction === 'BJ_TO_RU' ? 'active' : ''}`} onClick={() => setDirection('BJ_TO_RU')}>
            <FiTrendingUp size={18} style={{ marginBottom: '4px' }} /><br/>🇧🇯 → 🇷🇺
          </button>
          <button className={`currency-btn ${direction === 'RU_TO_BJ' ? 'active' : ''}`} onClick={() => setDirection('RU_TO_BJ')}>
            <FiTrendingDown size={18} style={{ marginBottom: '4px' }} /><br/>🇷🇺 → 🇧🇯
          </button>
        </div>

        <div style={{ textAlign: 'center', margin: '24px 0' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Montant à envoyer</div>
          <div className="amount-display">{numericAmount.toLocaleString() || '0'} <span style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>{currencyFrom}</span></div>
          <input type="number" className="input" style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '12px' }} placeholder="Entrez le montant" value={amount} onChange={e => setAmount(e.target.value)} />
        </div>

        <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px' }}>
          <div className="summary-row"><span className="summary-label">Taux</span><span className="summary-value">1 {currencyFrom} = {(currencyFrom === 'XOF' ? (1/rate).toFixed(4) : rate.toFixed(2))} {currencyTo}</span></div>
          <div className="summary-row"><span className="summary-label">Montant reçu</span><span className="summary-value" style={{ color: 'var(--primary)' }}>{Math.round(final).toLocaleString()} {currencyTo}</span></div>
          <div className="summary-row"><span className="summary-label">Frais ({FEES}%)</span><span className="summary-value">{Math.round(fees).toLocaleString()} {currencyFrom}</span></div>
          <div className="summary-row"><span className="summary-label">Total</span><span className="summary-value summary-total">{total.toLocaleString()} {currencyFrom}</span></div>
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-title"><FiRefreshCw size={14} style={{ marginRight: '6px' }} />Taux actualisé</div>
        <p className="info-box-text">Le taux est récupéré en temps réel depuis les marchés des changes. Les frais de 2.5% sont inclus dans le calcul.</p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {/* <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Pour effectuer un vrai transfert, <a href="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>connectez-vous</a></p> */}
      </div>
    </div>
  );
}
