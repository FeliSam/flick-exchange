import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTransfer } from '../context/TransferContext';
import { useExchangeRate } from '../hooks/useExchangeRate';
import { validateBeninPhone, validateRussiaPhone, checkLimit, generateReceipt } from '../utils/validators';
import { FiCheck, FiArrowRight, FiArrowLeft, FiCopy, FiUser, FiSmartphone, FiGlobe, FiHeart, FiUpload, FiLock, FiAlertTriangle } from 'react-icons/fi';

const FEES_PERCENT = 2.5;
const BJ_BANKS = ['Sberbank', 'T-Bank (Tinkoff)', 'Ozon Bank', 'VTB', 'Alfa-Bank', 'Raiffeisen', 'Autre'];

export default function Transfer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { createTransfer, addFavorite } = useTransfer();
  const { rate, convert } = useExchangeRate();
  const fileInputRef = useRef(null);

  const defaultDirection = location.state?.direction || 'BJ_TO_RU';
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(defaultDirection);
  const [amount, setAmount] = useState('');
  const [senderOption, setSenderOption] = useState('my_account');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [recipient, setRecipient] = useState({ fullName: '', firstName: '', lastName: '', phone: '', network: '', bankName: '' });
  const [phoneError, setPhoneError] = useState('');
  const [limitError, setLimitError] = useState('');
  const [pin, setPin] = useState(['', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  const currencyFrom = direction === 'BJ_TO_RU' ? 'XOF' : 'RUB';
  const currencyTo = direction === 'BJ_TO_RU' ? 'RUB' : 'XOF';
  const numericAmount = parseFloat(amount) || 0;
  const convertedAmount = convert(numericAmount, currencyFrom, currencyTo);
  const fees = numericAmount * (FEES_PERCENT / 100);
  const totalToPay = numericAmount + fees;
  const finalAmount = convertedAmount - (convertedAmount * (FEES_PERCENT / 100));
  const limitCheck = checkLimit(numericAmount, currencyFrom, user?.verified);

  const handleAmount = (val) => {
    setAmount(val);
    const num = parseFloat(val) || 0;
    const check = checkLimit(num, currencyFrom, user?.verified);
    if (!check.allowed) {
      setLimitError(`Limite dépassée. Maximum : ${check.max.toLocaleString()} ${currencyFrom} ${user?.verified ? '' : '(vérifiez votre identité pour augmenter)'}`);
    } else {
      setLimitError('');
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (numericAmount <= 0) return;
      if (!limitCheck.allowed) return;
    }
    if (step === 3) {
      if (senderOption === 'other_account' && !senderName.trim()) return;
      if (direction === 'BJ_TO_RU') {
        if (!recipient.fullName.trim()) return;
        const ruCheck = validateRussiaPhone(recipient.phone);
        if (!ruCheck.valid) { setPhoneError(ruCheck.error); return; }
        setPhoneError('');
      } else {
        if (!recipient.firstName.trim() || !recipient.lastName.trim()) return;
        const bjCheck = validateBeninPhone(recipient.phone);
        if (!bjCheck.valid) { setPhoneError(bjCheck.error); return; }
        setRecipient({...recipient, network: bjCheck.network, phone: bjCheck.formatted});
        setPhoneError('');
      }
    }
    if (step === 4) {
      if (user?.pin) {
        setStep(5); // PIN step
        return;
      }
    }
    setStep(s => s + (step === 4 && !user?.pin ? 2 : 1));
  };

  const handlePinChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setPinError('');
    if (val && idx < 3) document.getElementById(`pin-${idx + 1}`)?.focus();
  };

  const validatePin = () => {
    const code = pin.join('');
    if (code !== user.pin) { setPinError('PIN incorrect'); return; }
    setStep(6);
  };

  const handleConfirm = () => {
    const transfer = createTransfer({
      direction, amountSent: numericAmount, amountReceived: Math.round(finalAmount * 100) / 100,
      currencyFrom, currencyTo, rate, fees,
      senderOption,
      senderName: senderOption === 'my_account' ? `${user.firstName} ${user.lastName}` : senderName,
      senderPhone: senderOption === 'my_account' ? user.phone : senderPhone,
      recipient,
      senderInfo: { name: `${user.firstName} ${user.lastName}`, phone: user.phone, country: user.country, city: user.city }
    });
    if (receiptFile) {
      const reader = new FileReader();
      reader.onloadend = () => { /* uploadReceipt(transfer.id, reader.result); */ };
      reader.readAsDataURL(receiptFile);
    }
    setStep(7);
  };

  const saveFavorite = () => {
    addFavorite({ ...recipient, direction });
    alert('Destinataire ajouté aux favoris !');
  };

  const selectFavorite = (fav) => {
    setSelectedFavorite(fav.id);
    setRecipient({ ...fav });
  };

  const copyToClipboard = (text) => { navigator.clipboard.writeText(text); alert('Copié !'); };

  const getPaymentInstructions = () => {
    if (direction === 'BJ_TO_RU') {
      return { title: 'Effectuez le paiement depuis le Bénin', subtitle: 'Transférez le montant exact via Mobile Money', details: [
        { label: 'Numéro MTN/Moov/Celtiis', value: '+229 97 00 00 00' },
        { label: 'Nom du bénéficiaire', value: 'FLICK EXCHANGE BJ' },
        { label: 'Montant exact', value: `${totalToPay.toLocaleString()} ${currencyFrom}` },
        { label: 'Référence', value: `${user.firstName} ${user.lastName}` }
      ]};
    } else {
      return { title: 'Effectuez le paiement depuis la Russie', subtitle: 'Transférez le montant exact via SberPay ou virement', details: [
        { label: 'Numéro de téléphone', value: '+7 999 000 00 00' },
        { label: 'Nom du bénéficiaire', value: 'FLICK EXCHANGE RU' },
        { label: 'Banque', value: 'Sberbank' },
        { label: 'Montant exact', value: `${totalToPay.toLocaleString()} ${currencyFrom}` },
        { label: 'Référence', value: `${user.firstName} ${user.lastName}` }
      ]};
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setReceiptFile(file);
  };

  const steps = user?.pin ? ['Montant', 'Expéditeur', 'Destinataire', 'Résumé', 'PIN', 'Paiement'] : ['Montant', 'Expéditeur', 'Destinataire', 'Résumé', 'Paiement'];

  return (
    <div>
      <div className="step-indicator">
        {steps.map((label, idx) => (
          <div key={idx} className={`step ${step > idx + 1 ? 'completed' : ''} ${step === idx + 1 ? 'active' : ''}`}>
            <div className="step-number">{step > idx + 1 ? <FiCheck size={16} /> : idx + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      {/* STEP 1: Amount */}
      {step === 1 && (
        <div className="animate-slide-up">
          <div className="card">
            <div className="card-title">Direction</div>
            <div className="currency-selector">
              <button className={`currency-btn ${direction === 'BJ_TO_RU' ? 'active' : ''}`} onClick={() => setDirection('BJ_TO_RU')}><FiGlobe size={20} style={{ marginBottom: '6px' }} /><br/>🇧🇯 Bénin → Russie 🇷🇺</button>
              <button className={`currency-btn ${direction === 'RU_TO_BJ' ? 'active' : ''}`} onClick={() => setDirection('RU_TO_BJ')}><FiGlobe size={20} style={{ marginBottom: '6px' }} /><br/>🇷🇺 Russie → Bénin 🇧🇯</button>
            </div>
            <div style={{ textAlign: 'center', margin: '28px 0' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Montant à envoyer</div>
              <div className="amount-display">{numericAmount.toLocaleString() || '0'} <span style={{ fontSize: '1.2rem', color: 'var(--text-light)' }}>{currencyFrom}</span></div>
              <input type="number" className="input" style={{ textAlign: 'center', fontSize: '1.2rem', marginTop: '12px' }} placeholder="Entrez le montant" value={amount} onChange={e => handleAmount(e.target.value)} min="100" />
            </div>
            {limitError && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FiAlertTriangle /> {limitError}
              </div>
            )}
            {!user?.verified && (
              <div style={{ background: '#FFFBEB', color: '#92400E', padding: '12px', borderRadius: '10px', marginBottom: '16px', fontSize: '0.8rem' }}>
                ⚠️ Limite : {currencyFrom === 'XOF' ? '50 000' : '5 000'} {currencyFrom}. <a href="/profile" style={{ color: 'var(--primary)', fontWeight: 600 }}>Vérifiez votre identité</a> pour augmenter.
              </div>
            )}
            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', marginTop: '16px' }}>
              <div className="summary-row"><span className="summary-label">Taux</span><span className="summary-value">1 {currencyFrom} = {(currencyFrom === 'XOF' ? (1/rate).toFixed(4) : rate.toFixed(2))} {currencyTo}</span></div>
              <div className="summary-row"><span className="summary-label">Montant reçu</span><span className="summary-value" style={{ color: 'var(--primary)' }}>{Math.round(finalAmount).toLocaleString()} {currencyTo}</span></div>
              <div className="summary-row"><span className="summary-label">Frais ({FEES_PERCENT}%)</span><span className="summary-value">{Math.round(fees).toLocaleString()} {currencyFrom}</span></div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleNext} disabled={numericAmount <= 0 || !limitCheck.allowed}>Continuer <FiArrowRight /></button>
        </div>
      )}

      {/* STEP 2: Sender */}
      {step === 2 && (
        <div className="animate-slide-up">
          <div className="card">
            <div className="card-title">Qui effectue le transfert ?</div>
            <div className={`sender-option ${senderOption === 'my_account' ? 'active' : ''}`} onClick={() => setSenderOption('my_account')}>
              <div className="sender-option-icon"><FiUser /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Depuis mon compte</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user.firstName} {user.lastName} • {user.phone}</div>
              </div>
              {senderOption === 'my_account' && <FiCheck color="var(--primary)" />}
            </div>
            <div className={`sender-option ${senderOption === 'other_account' ? 'active' : ''}`} onClick={() => setSenderOption('other_account')}>
              <div className="sender-option-icon" style={{ background: 'linear-gradient(135deg, var(--secondary), #D97706)' }}><FiSmartphone /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Depuis un autre compte</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>Un tiers effectue le paiement pour vous</div>
              </div>
              {senderOption === 'other_account' && <FiCheck color="var(--primary)" />}
            </div>
          </div>
          {senderOption === 'other_account' && (
            <div className="card animate-slide-up">
              <div className="card-title">Informations de l'expéditeur</div>
              <div className="input-group"><label>Nom complet de l'expéditeur</label><input className="input" placeholder="Prénom Nom" value={senderName} onChange={e => setSenderName(e.target.value)} required /></div>
              <div className="input-group"><label>Téléphone de l'expéditeur</label><input className="input" placeholder={direction === 'BJ_TO_RU' ? '+229 01 23 45 67' : '+7 999 000 00 00'} value={senderPhone} onChange={e => setSenderPhone(e.target.value)} /></div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(1)}><FiArrowLeft /> Retour</button>
            <button className="btn btn-primary" onClick={handleNext} disabled={senderOption === 'other_account' && !senderName.trim()}>Continuer <FiArrowRight /></button>
          </div>
        </div>
      )}

      {/* STEP 3: Recipient */}
      {step === 3 && (
        <div className="animate-slide-up">
          {/* Favorites */}
          {user?.favorites && user.favorites.length > 0 && (
            <div className="card">
              <div className="card-title">Destinataires favoris</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {user.favorites.map(fav => (
                  <div key={fav.id} onClick={() => selectFavorite(fav)} className="fav-card" style={{ border: selectedFavorite === fav.id ? '2px solid var(--primary)' : '1px solid var(--border)' }}>
                    <div className="fav-avatar">{(fav.fullName || fav.firstName)?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{fav.fullName || `${fav.firstName} ${fav.lastName}`}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fav.phone} {fav.network && `• ${fav.network}`}</div>
                    </div>
                    {selectedFavorite === fav.id && <FiCheck color="var(--primary)" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-title">Informations du destinataire en {direction === 'BJ_TO_RU' ? 'Russie 🇷🇺' : 'Bénin 🇧🇯'}</div>
            {direction === 'BJ_TO_RU' ? (
              <>
                <div className="input-group"><label>Nom complet du destinataire</label><input className="input" placeholder="Prénom Nom" value={recipient.fullName} onChange={e => setRecipient({...recipient, fullName: e.target.value})} required /></div>
                <div className="input-group"><label>Numéro de téléphone russe</label><input className={`input ${phoneError ? 'input-error' : ''}`} placeholder="+7 999 000 00 00" value={recipient.phone} onChange={e => { setPhoneError(''); setRecipient({...recipient, phone: e.target.value}); }} required />{phoneError && <div className="error-text">⚠️ {phoneError}</div>}</div>
                <div className="input-group"><label>Banque russe</label><select className="input" value={recipient.bankName} onChange={e => setRecipient({...recipient, bankName: e.target.value})}><option value="">Sélectionner...</option>{BJ_BANKS.map(b => <option key={b} value={b}>{b}</option>)}</select></div>
              </>
            ) : (
              <>
                <div className="input-group"><label>Prénom du destinataire</label><input className="input" placeholder="Prénom" value={recipient.firstName} onChange={e => setRecipient({...recipient, firstName: e.target.value})} required /></div>
                <div className="input-group"><label>Nom du destinataire</label><input className="input" placeholder="Nom" value={recipient.lastName} onChange={e => setRecipient({...recipient, lastName: e.target.value})} required /></div>
                <div className="input-group"><label>Numéro de téléphone béninois</label><input className={`input ${phoneError ? 'input-error' : ''}`} placeholder="+229 01 23 45 67" value={recipient.phone} onChange={e => { setPhoneError(''); setRecipient({...recipient, phone: e.target.value}); }} required />{phoneError && <div className="error-text">⚠️ {phoneError}</div>}{!phoneError && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>Le réseau sera détecté automatiquement</div>}</div>
                {recipient.network && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F0FDF4', color: '#166534', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '16px' }}><FiCheck size={14} /> Réseau : {recipient.network}</div>}
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(2)}><FiArrowLeft /> Retour</button>
            <button className="btn btn-primary" onClick={handleNext}>Continuer <FiArrowRight /></button>
          </div>
        </div>
      )}

      {/* STEP 4: Summary */}
      {step === 4 && (
        <div className="animate-slide-up">
          <div className="card">
            <div className="card-title">Résumé du transfert</div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Vous envoyez</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)' }}>{numericAmount.toLocaleString()} {currencyFrom}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '12px 0' }}><div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FiArrowRight size={16} color="var(--text-muted)" /></div></div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Destinataire reçoit</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{Math.round(finalAmount).toLocaleString()} {currencyTo}</div>
            </div>
            <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px' }}>
              <div className="summary-row"><span className="summary-label">De</span><span className="summary-value">{senderOption === 'my_account' ? `${user.firstName} ${user.lastName}` : senderName}</span></div>
              <div className="summary-row"><span className="summary-label">Vers</span><span className="summary-value">{direction === 'BJ_TO_RU' ? recipient.fullName : `${recipient.firstName} ${recipient.lastName}`}</span></div>
              <div className="summary-row"><span className="summary-label">Taux</span><span className="summary-value">1 {currencyFrom} = {(currencyFrom === 'XOF' ? (1/rate).toFixed(4) : rate.toFixed(2))} {currencyTo}</span></div>
              <div className="summary-row"><span className="summary-label">Frais</span><span className="summary-value">{Math.round(fees).toLocaleString()} {currencyFrom}</span></div>
              <div className="summary-row"><span className="summary-label">Total à payer</span><span className="summary-value summary-total">{totalToPay.toLocaleString()} {currencyFrom}</span></div>
            </div>
          </div>
          <div className="info-box">
            <div className="info-box-title">ℹ️ Prochaine étape</div>
            <p className="info-box-text">Après confirmation, vous recevrez les instructions de paiement. Le transfert sera traité manuellement sous 2h ouvrables.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(3)}><FiArrowLeft /> Retour</button>
            <button className="btn btn-primary" onClick={handleNext}>Confirmer la demande</button>
          </div>
        </div>
      )}

      {/* STEP 5: PIN */}
      {step === 5 && user?.pin && (
        <div className="animate-slide-up">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <FiLock size={28} color="var(--primary)" />
            </div>
            <h3 style={{ color: 'var(--text)', fontWeight: 800 }}>Saisissez votre PIN</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Pour sécuriser ce transfert de {totalToPay.toLocaleString()} {currencyFrom}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            {pin.map((d, i) => <input key={i} id={`pin-${i}`} type="password" maxLength={1} className="pin-input" value={d} onChange={e => handlePinChange(i, e.target.value)} />)}
          </div>
          {pinError && <div className="error-text" style={{ textAlign: 'center', marginBottom: '16px' }}>⚠️ {pinError}</div>}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-secondary" onClick={() => setStep(4)}><FiArrowLeft /> Retour</button>
            <button className="btn btn-primary" onClick={validatePin}>Valider <FiArrowRight /></button>
          </div>
        </div>
      )}

      {/* STEP 6/7: Payment Instructions */}
      {(step === 6 || step === 7) && (
        <div className="animate-slide-up">
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(16,185,129,0.2)' }}>
              <FiCheck size={36} color="#065F46" />
            </div>
            <h3 style={{ color: 'var(--text)', fontWeight: 800, fontSize: '1.3rem' }}>Demande créée !</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '6px' }}>Effectuez le paiement pour lancer le transfert.</p>
          </div>

          <div className="card" style={{ border: '2px solid var(--primary)', padding: '20px' }}>
            <div className="card-title" style={{ color: 'var(--primary)', fontWeight: 700 }}>{getPaymentInstructions().title}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>{getPaymentInstructions().subtitle}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {getPaymentInstructions().details.map((detail, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>{detail.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{detail.value}</span>
                    <FiCopy size={16} color="var(--primary)" style={{ cursor: 'pointer' }} onClick={() => copyToClipboard(detail.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upload receipt */}
          <div className="card">
            <div className="card-title">Télécharger votre reçu de paiement</div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Accélérez le traitement en envoyant votre preuve de paiement.</p>
            <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,.pdf" onChange={handleFileUpload} />
            <button className="btn btn-outline" onClick={() => fileInputRef.current?.click()}><FiUpload /> {receiptFile ? receiptFile.name : 'Choisir un fichier'}</button>
          </div>

          {/* Save favorite */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Enregistrer ce destinataire</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pour vos prochains transferts</div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ width: 'auto', padding: '10px 16px' }} onClick={saveFavorite}><FiHeart /> Ajouter</button>
          </div>

          <div className="card" style={{ background: '#FFFBEB', border: '1px solid #FCD34D' }}>
            <div style={{ fontWeight: 700, marginBottom: '10px', color: '#92400E', fontSize: '0.9rem' }}>⚠️ Important</div>
            <ul style={{ fontSize: '0.85rem', color: '#B45309', paddingLeft: '18px', lineHeight: 1.8 }}>
              <li>Effectuez le paiement <strong>exact</strong> du montant indiqué</li>
              <li>Utilisez comme référence : <strong>{user.firstName} {user.lastName}</strong></li>
              <li>Conservez votre reçu de paiement</li>
              <li>Le transfert sera confirmé sous 2h ouvrables</li>
            </ul>
          </div>

          <button className="btn btn-primary" onClick={() => navigate('/history')}>Voir mes transferts <FiArrowRight /></button>
        </div>
      )}
    </div>
  );
}
