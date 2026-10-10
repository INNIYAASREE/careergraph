import { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { PageHeader, ConfirmDialog, downloadFile } from '../components/ui.jsx';

export default function Settings() {
  const { user, update, changePassword, deleteAccount } = useAuth();
  const { raw, replaceAll } = useData();
  const toast = useToast();
  const [profile, setProfile] = useState({ name: user.name, email: user.email, ...user.profile });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [dialog, setDialog] = useState(null);
  const importRef = useRef(null);
  const setP = (k) => (e) => setProfile({ ...profile, [k]: e.target.value });

  const saveProfile = (e) => {
    e.preventDefault(); setProfileError('');
    try {
      const { name, email, ...rest } = profile;
      if (!name.trim()) throw new Error('Name can’t be empty.');
      update({ name: name.trim(), email, profile: rest });
      toast('Profile saved');
    } catch (err) { setProfileError(err.message); }
  };

  const savePassword = async (e) => {
    e.preventDefault(); setPwError('');
    if (pw.next !== pw.confirm) { setPwError('New passwords do not match.'); return; }
    try { await changePassword(pw.current, pw.next); setPw({ current: '', next: '', confirm: '' }); toast('Password changed'); } catch (err) { setPwError(err.message); }
  };

  const exportData = () => downloadFile(`careergraph-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify({ app: 'careergraph', version: 1, exportedAt: new Date().toISOString(), ...raw }, null, 2), 'application/json');

  const importData = async (file) => {
    if (!file) return;
    try {
      const data = JSON.parse(await file.text());
      if (data.app !== 'careergraph') throw new Error('This file is not a CareerGraph export.');
      replaceAll(data);
      toast('Data imported');
    } catch (err) { toast(err.message || 'Could not import that file', 'error'); }
  };

  return (
    <div className="page narrow">
      <PageHeader title="Settings" description="Manage your profile, password and data." />

      <form className="panel settings-sec" onSubmit={saveProfile}>
        <div className="settings-intro"><h2>Profile</h2><p className="muted small">Shown in the app only.</p></div>
        <div className="settings-body">
          {profileError && <div className="alert error">{profileError}</div>}
          <div className="form-grid two">
            <label className="field"><span>Full name</span><input value={profile.name} onChange={setP('name')} /></label>
            <label className="field"><span>Email</span><input type="email" value={profile.email} onChange={setP('email')} /></label>
            <label className="field"><span>College</span><input value={profile.college} onChange={setP('college')} placeholder="e.g. PSG College of Technology" /></label>
            <label className="field"><span>Degree</span><input value={profile.degree} onChange={setP('degree')} placeholder="e.g. B.Tech CSE" /></label>
            <label className="field"><span>Graduation year</span><input value={profile.gradYear} onChange={setP('gradYear')} inputMode="numeric" placeholder="2026" /></label>
            <label className="field"><span>Target role</span><input value={profile.targetRole} onChange={setP('targetRole')} placeholder="e.g. Data Analyst" /></label>
          </div>
          <div className="row end"><button className="btn primary">Save profile</button></div>
        </div>
      </form>

      <form className="panel settings-sec" onSubmit={savePassword}>
        <div className="settings-intro"><h2>Password</h2><p className="muted small">At least 8 characters with a letter and a number.</p></div>
        <div className="settings-body">
          {pwError && <div className="alert error">{pwError}</div>}
          <label className="field"><span>Current password</span><input type="password" autoComplete="current-password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} /></label>
          <div className="form-grid two">
            <label className="field"><span>New password</span><input type="password" autoComplete="new-password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></label>
            <label className="field"><span>Confirm new password</span><input type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} /></label>
          </div>
          <div className="row end"><button className="btn primary" disabled={!pw.current || !pw.next}>Change password</button></div>
        </div>
      </form>

      <section className="panel settings-sec">
        <div className="settings-intro"><h2>Your data</h2><p className="muted small">Everything is stored in this browser. Export a backup to move it to another device.</p></div>
        <div className="settings-body">
          <div className="row">
            <button className="btn secondary" onClick={exportData}>Export data (JSON)</button>
            <button className="btn secondary" onClick={() => importRef.current?.click()}>Import data</button>
            <input ref={importRef} type="file" accept="application/json,.json" hidden onChange={(e) => { importData(e.target.files?.[0]); e.target.value = ''; }} />
          </div>
          <div className="row"><button className="btn ghost danger-text" onClick={() => setDialog('reset')}>Clear resume and all job matches</button></div>
        </div>
      </section>

      <section className="panel settings-sec danger-zone">
        <div className="settings-intro"><h2>Delete account</h2><p className="muted small">Removes your account and all its data from this browser.</p></div>
        <div className="settings-body"><button className="btn danger" onClick={() => setDialog('delete')}>Delete account</button></div>
      </section>

      <ConfirmDialog open={dialog === 'reset'} title="Clear all your data?" body="Your resume and every job match, plan and practice answer will be removed. Your account stays." confirmLabel="Clear data" danger onConfirm={() => { replaceAll({}); setDialog(null); toast('Data cleared'); }} onCancel={() => setDialog(null)} />
      <ConfirmDialog open={dialog === 'delete'} title="Delete your account?" body="Your account and all its data will be permanently removed from this browser." confirmLabel="Delete account" danger onConfirm={deleteAccount} onCancel={() => setDialog(null)} />
    </div>
  );
}
