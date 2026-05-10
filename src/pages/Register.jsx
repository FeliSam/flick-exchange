import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import { validateBeninPhone, validateRussiaPhone } from '../utils/validators';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
    country: 'BJ', city: '', passportNumber: '', phone: '', phoneNetwork: ''
  });

  const updateField = (field, value) => { setFormData(prev => ({ ...prev, [field]: value })); if (field === 'phone') setPhoneError(''); };

  const validatePhone = () => {
    if (formData.country === 'BJ') {
      const result = validateBeninPhone(formData.phone);
      if (!result.valid) { setPhoneError(result.error); return false; }
      updateField('phoneNetwork', result.network);
      updateField('phone', result.formatted);
    } else {
      const result = validateRussiaPhone(formData.phone);
      if (!result.valid) { setPhoneError(result.error); return false; }
      updateField('phone', result.formatted);
    }
    return true;
  };

  const handleSubmit = () => {
    if (formData.password !== formData.confirmPassword) { setError('Les mots de passe ne correspondent pas'); return; }
    if (formData.password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return; }
    const result = register(formData);
    if (result.success) navigate('/');
    else setError(result.error);
  };

  return (
    <div style={{ paddingTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '28px' }}>
        {[1,2].map(s => <div key={s} style={{ width: '40px', height: '5px', borderRadius: '3px', background: s <= step ? 'var(--primary)' : 'var(--border)', transition: 'all 0.3s' }} />)}
      </div>
      {step === 1 && (
        <div className="animate-slide-up">
          <h3 style={{ marginBottom: '24px', color: 'var(--text)', fontWeight: 700, fontSize: '1.3rem' }}>Créer votre compte</h3>
          <div className="input-group"><label>Prénom</label><input className="input" value={formData.firstName} onChange={e => updateField('firstName', e.target.value)} placeholder="Votre prénom" required /></div>
          <div className="input-group"><label>Nom</label><input className="input" value={formData.lastName} onChange={e => updateField('lastName', e.target.value)} placeholder="Votre nom" required /></div>
          <div className="input-group"><label>Email</label><input type="email" className="input" value={formData.email} onChange={e => updateField('email', e.target.value)} placeholder="votre@email.com" required /></div>
          <div className="input-group"><label>Mot de passe</label><input type="password" className="input" value={formData.password} onChange={e => updateField('password', e.target.value)} placeholder="Minimum 6 caractères" required /></div>
          <div className="input-group"><label>Confirmer le mot de passe</label><input type="password" className="input" value={formData.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} placeholder="Répétez votre mot de passe" required /></div>
          {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}
          <button className="btn btn-primary" onClick={() => { if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) { setError('Veuillez remplir tous les champs'); return; } setError(''); setStep(2); }}>Continuer <FiArrowRight /></button>
        </div>
      )}
      {step === 2 && (
        <div className="animate-slide-up">
          <h3 style={{ marginBottom: '24px', color: 'var(--text)', fontWeight: 700, fontSize: '1.3rem' }}>Votre localisation</h3>
          <div className="input-group">
            <label>Pays de résidence</label>
            <select className="input" value={formData.country} onChange={e => updateField('country', e.target.value)}>
              <option value="BJ">🇧🇯 Bénin</option>
              <option value="RU">🇷🇺 Russie</option>
            </select>
          </div>
          <div className="input-group"><label>Ville</label><input className="input" value={formData.city} onChange={e => updateField('city', e.target.value)} placeholder={formData.country === 'BJ' ? 'Ex: Cotonou' : 'Ex: Moscou'} required /></div>
          <div className="input-group"><label>Numéro de passeport</label><input className="input" value={formData.passportNumber} onChange={e => updateField('passportNumber', e.target.value)} placeholder="Numéro de passeport" required /></div>
          <div className="input-group">
            <label>{formData.country === 'BJ' ? 'Numéro de téléphone béninois' : 'Numéro de téléphone russe'}</label>
            <input className={`input ${phoneError ? 'input-error' : ''}`} value={formData.phone} onChange={e => updateField('phone', e.target.value)} placeholder={formData.country === 'BJ' ? '+229 01 23 45 67' : '+7 999 000 00 00'} required />
            {phoneError && <div className="error-text">⚠️ {phoneError}</div>}
            {!phoneError && formData.country === 'BJ' && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Formats acceptés : +229 suivi de 8 chiffres (MTN, Moov, Celtiis)</div>}
          </div>
          {formData.country === 'BJ' && formData.phoneNetwork && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0FDF4', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}>
              <FiCheck size={14} /> Réseau détecté : {formData.phoneNetwork}
            </div>
          )}
          {error && <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem' }}>{error}</div>}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}><FiArrowLeft /> Retour</button>
            <button className="btn btn-primary" onClick={() => { if (!formData.city || !formData.passportNumber || !formData.phone) { setError('Veuillez remplir tous les champs'); return; } if (!validatePhone()) return; setError(''); handleSubmit(); }}>Créer mon compte <FiCheck /></button>
          </div>
        </div>
      )}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Déjà un compte ? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link></p>
      </div>
    </div>
  );
}
