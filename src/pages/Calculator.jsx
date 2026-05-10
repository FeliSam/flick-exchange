import { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiGlobe, FiTrendingUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useExchangeRate } from '../hooks/useExchangeRate';

export default function Calculator() {
  const navigate = useNavigate();
  const { rate, convert } = useExchangeRate();
  
  const [direction, setDirection] = useState('BJ_TO_RU');
  const [amount, setAmount] = useState('');
  
  const currencyFrom = direction === 'BJ_TO_RU' ? 'XOF' : 'RUB';
  const currencyTo = direction === 'BJ_TO_RU' ? 'RUB' : 'XOF';
  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount = convert(numericAmount, currencyFrom, currencyTo);
  const fees = numericAmount * 0.025; // 2.5% fees
  const totalToPay = numericAmount + fees;
  const finalAmount = convertedAmount - (convertedAmount * 0.025);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
          <button 
            className="btn btn-ghost"
            onClick={() => navigate('/')}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '12px',
              fontSize: '0.95rem'
            }}
          >
            <FiArrowLeft size={20} /> Retour
          </button>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(16,185,129,0.3)'
          }}>
            <FiTrendingUp size={40} color="white" />
          </div>
          <h1 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '2rem', marginBottom: '8px' }}>
            Calculateur de change
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Calculez vos taux de change en temps réel
          </p>
        </div>

        {/* Direction Selector */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title">Direction</div>
          <div className="currency-selector">
            <button 
              className={`currency-btn ${direction === 'BJ_TO_RU' ? 'active' : ''}`} 
              onClick={() => setDirection('BJ_TO_RU')}
            >
              <FiGlobe size={20} style={{ marginBottom: '6px' }} /><br/>
              🇧🇯 Bénin → Russie 🇷🇺
            </button>
            <button 
              className={`currency-btn ${direction === 'RU_TO_BJ' ? 'active' : ''}`} 
              onClick={() => setDirection('RU_TO_BJ')}
            >
              <FiGlobe size={20} style={{ marginBottom: '6px' }} /><br/>
              🇷🇺 Russie → Bénin 🇧🇯
            </button>
          </div>
        </div>

        {/* Amount Input */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-title">Montant à envoyer</div>
          <div className="input-group">
            <input 
              className="input" 
              type="number" 
              placeholder={`0 ${currencyFrom}`} 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              style={{ fontSize: '1.2rem', fontWeight: 600 }}
            />
          </div>
        </div>

        {/* Results */}
        {numericAmount > 0 && (
          <div className="card animate-slide-up">
            <div className="card-title" style={{ color: 'var(--primary)', marginBottom: '20px' }}>
              Résultats du calcul
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px',
                background: 'var(--bg-secondary)',
                borderRadius: '12px',
                border: '1px solid var(--border)'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Montant envoyé
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>
                    {numericAmount.toLocaleString()} {currencyFrom}
                  </div>
                </div>
                <FiArrowRight size={20} color="var(--primary)" />
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Montant reçu
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--primary)' }}>
                    {Math.round(finalAmount * 100) / 100} {currencyTo}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Frais de service (2.5%)</span>
                <span style={{ fontWeight: 600, color: '#D97706' }}>
                  {fees.toLocaleString()} {currencyFrom}
                </span>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '12px 16px',
                background: 'rgba(16, 185, 129, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(16, 185, 129, 0.2)'
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Total à payer</span>
                <span style={{ fontWeight: 600, color: '#059669' }}>
                  {totalToPay.toLocaleString()} {currencyFrom}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                Taux de change actuel
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)' }}>
                1 {currencyFrom} = {(rate * (direction === 'BJ_TO_RU' ? 1 : 1/rate)).toFixed(2)} {currencyTo}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/register')}
            style={{ padding: '16px 32px', fontSize: '1rem' }}
          >
            Créer un compte pour transférer <FiArrowRight />
          </button>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '12px' }}>
            Inscription gratuite • Transferts sécurisés
          </p>
        </div>
      </div>
    </div>
  );
}