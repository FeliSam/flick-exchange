import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight, FiZap } from 'react-icons/fi';


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  return (
    <div style={{ paddingTop: '60px' }}>
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '20px',
          background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(79,70,229,0.3)'
        }}>
          <FiZap size={36} color="white" />
        </div>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--text)', fontWeight: 800, letterSpacing: '-1px' }}>
          Flick-exchange
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.95rem' }}>
          Transferts rapides Bénin ↔ Russie
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '14px', borderRadius: '12px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <div className="input-group">
          <label>Email</label>
          <div style={{ position: 'relative' }}>
            <FiMail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="email" className="input" style={{ paddingLeft: '48px' }} placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <FiLock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="password" className="input" style={{ paddingLeft: '48px' }} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
          Se connecter <FiArrowRight />
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '28px' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
          Pas encore de compte ? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Créer un compte</Link>
        </p>
      </div>

      <div style={{ marginTop: '40px', padding: '16px', background: 'rgba(79,70,229,0.05)', borderRadius: '12px', border: '1px solid rgba(79,70,229,0.1)' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>
          💡 <strong>Astuce :</strong> Utilisez un email contenant "admin" pour accéder au tableau de bord.
        </p>
      </div>
    </div>
  );
}
