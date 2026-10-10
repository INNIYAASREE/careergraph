import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Check } from 'lucide-react';
import AuthLayout from './AuthLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const rules = [
    { ok: form.password.length >= 8, label: 'At least 8 characters' },
    { ok: /[A-Za-z]/.test(form.password) && /\d/.test(form.password), label: 'A letter and a number' },
    { ok: form.password.length > 0 && form.password === form.confirm, label: 'Passwords match' },
  ];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setBusy(true);
    try { await register(form); navigate('/resume', { replace: true, state: { welcome: true } }); } catch (err) { setError(err.message); } finally { setBusy(false); }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Free, private, and ready in under a minute.">
      <form onSubmit={submit} className="form" noValidate>
        {error && <div className="alert error" role="alert">{error}</div>}
        <label className="field">
          <span>Full name</span>
          <input autoComplete="name" value={form.name} onChange={set('name')} required autoFocus />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" autoComplete="email" value={form.email} onChange={set('email')} required />
        </label>
        <label className="field">
          <span>Password</span>
          <div className="input-wrap">
            <input type={show ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={set('password')} required />
            <button type="button" className="icon-btn inset" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
        </label>
        <label className="field">
          <span>Confirm password</span>
          <input type={show ? 'text' : 'password'} autoComplete="new-password" value={form.confirm} onChange={set('confirm')} required />
        </label>
        <ul className="pw-rules">
          {rules.map((r) => <li key={r.label} className={r.ok ? 'ok' : ''}><Check size={14} /> {r.label}</li>)}
        </ul>
        <button className="btn primary block lg" disabled={busy || !rules.every((r) => r.ok) || !form.name || !form.email}>
          {busy && <Loader2 size={18} className="spin" />} Create account
        </button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
      <p className="auth-note">Your account and data stay in this browser. Nothing is sent to a server.</p>
    </AuthLayout>
  );
}
