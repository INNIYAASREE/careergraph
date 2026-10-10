import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { ensureDemoAccount, DEMO } from '../lib/demo.js';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');

  const goNext = () => navigate(location.state?.from || '/', { replace: true });

  const submit = async (e) => {
    e.preventDefault();
    setError(''); setBusy('form');
    try { await login(email, password, remember); goNext(); } catch (err) { setError(err.message); } finally { setBusy(''); }
  };

  const tryDemo = async () => {
    setError(''); setBusy('demo');
    try { await ensureDemoAccount(); await login(DEMO.email, DEMO.password, false); goNext(); } catch (err) { setError(err.message); } finally { setBusy(''); }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back. Pick up where you left off.">
      <form onSubmit={submit} className="form" noValidate>
        {error && <div className="alert error" role="alert">{error}</div>}
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="input-wrap">
            <input type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="icon-btn inset" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </label>
        <label className="check">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
          <span>Keep me signed in on this device</span>
        </label>
        <button className="btn primary block lg" disabled={!!busy || !email || !password}>
          {busy === 'form' && <Loader2 size={18} className="spin" />} Sign in
        </button>
      </form>
      <div className="divider"><span>or</span></div>
      <button className="btn secondary block lg" onClick={tryDemo} disabled={!!busy}>
        {busy === 'demo' ? <Loader2 size={18} className="spin" /> : <Sparkles size={18} />} Explore with a demo account
      </button>
      <p className="auth-switch">New to CareerGraph? <Link to="/signup">Create an account</Link></p>
      <p className="auth-note">Accounts are stored securely in this browser only. Forgot your password? Create a new account on this device.</p>
    </AuthLayout>
  );
}
