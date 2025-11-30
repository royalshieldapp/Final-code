import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AuthService from '../services/AuthService';
import Modal from '../components/Modal';
import SilentAlertService from '../services/SilentAlertService';
import { User } from '../types';

const Auth: React.FC = () => {
  const { setUser, setScreen, user } = useAppContext();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginMode, setLoginMode] = useState(false);
  const [error, setError] = useState('');
  const [promoOpen, setPromoOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    if (user) {
      setScreen('sos');
    }
  }, [user, setScreen]);

  const resetForms = () => {
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setPinInput('');
  };

  const handleRegister = () => {
    setError('');
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords must match.');
      return;
    }
    const newUser = AuthService.register({ fullName, email, phone, password, isPremium: false });
    setUser(newUser);
    setScreen('sos');
    setPromoOpen(true);
    setOfferOpen(true);
    resetForms();
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    const existing = AuthService.login(email, password, user);
    if (existing) {
      if (pinInput && existing.fakePin && pinInput === existing.fakePin) {
        await SilentAlertService.sendSilentAlert('Fake PIN used in login');
        setUser(existing);
        setScreen('decoy');
        resetForms();
        return;
      }
      setUser(existing);
      setScreen('sos');
      resetForms();
    } else {
      setError('Invalid credentials.');
    }
  };

  const socialLogin = (provider: 'google' | 'apple') => {
    const newUser = AuthService.social(provider);
    setUser(newUser);
    setScreen('sos');
    setPromoOpen(true);
    setOfferOpen(true);
  };

  const claimOffer = () => {
    setUser((prev) => (prev ? { ...prev, isPremium: true } : prev) as User | null);
    setOfferOpen(false);
  };

  const toggleMode = () => {
    setLoginMode((prev) => !prev);
    setError('');
  };

  return (
    <div className="grid two-col" style={{ padding: '24px' }}>
      <div className="card">
        <h2>{loginMode ? 'Login' : 'Register'} for Safety</h2>
        {error && <div className="banner" style={{ color: 'crimson' }}>{error}</div>}

        {!loginMode && (
          <>
            <label className="label">Full name</label>
            <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </>
        )}
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        {!loginMode && (
          <>
            <label className="label">Phone</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </>
        )}
        <label className="label">Password</label>
        <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        {!loginMode && (
          <>
            <label className="label">Confirm password</label>
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </>
        )}
        {loginMode && (
          <>
            <label className="label">PIN (for fake PIN silent alert)</label>
            <input className="input" value={pinInput} onChange={(e) => setPinInput(e.target.value)} />
          </>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="primary-btn" onClick={loginMode ? handleLogin : handleRegister}>
            {loginMode ? 'Login' : 'Register'}
          </button>
          <button className="secondary-btn" onClick={toggleMode}>
            {loginMode ? 'Need an account? Register' : 'Already have an account? Login'}
          </button>
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="secondary-btn" onClick={() => socialLogin('google')}>
            Continue with Google
          </button>
          <button className="secondary-btn" onClick={() => socialLogin('apple')}>
            Continue with Apple
          </button>
        </div>

        <button style={{ marginTop: 12 }} className="secondary-btn" onClick={() => { setPromoOpen(true); setOfferOpen(true); }}>
          View offers
        </button>
      </div>
      <div className="card">
        <h3>Why join?</h3>
        <p>Modern aqua-themed safety hub with SOS camera, cyber monitoring, and safe path protection.</p>
        <p>Promotions pop-ups will appear automatically after successful registration or login.</p>
      </div>

      <Modal open={promoOpen} onClose={() => setPromoOpen(false)} title="2-for-1 protection. Invite a friend today!">
        <p>Share the app with someone you trust to create a safety circle.</p>
      </Modal>

      <Modal
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        title="EXCLUSIVE OFFER!"
        actions={<button className="primary-btn" onClick={claimOffer}>Claim offer</button>}
      >
        <p>First 50 sign-ups get free Premium!</p>
      </Modal>
    </div>
  );
};

export default Auth;
