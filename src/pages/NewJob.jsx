import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, Loader2, ArrowLeft } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { parseJob } from '../lib/parse.js';
import { matchResumeToJob } from '../lib/match.js';
import { SAMPLE_JOB } from '../lib/samples.js';
import { PageHeader, SkillChips } from '../components/ui.jsx';

export default function NewJob() {
  const { resume, addJob } = useData();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', company: '', location: '', jdText: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const parsed = form.jdText.trim() ? parseJob(form.jdText) : null;
  const skillCount = parsed ? parsed.required.size + parsed.preferred.size : 0;

  const onFile = async (file) => {
    if (!file) return;
    setBusy(true); setError('');
    try {
      const { readFileText } = await import('../lib/pdf.js');
      const text = await readFileText(file);
      setForm((f) => ({ ...f, jdText: text, title: f.title || parseJob(text).titleGuess }));
    } catch (err) { setError(err.message || 'Could not read that file.'); } finally { setBusy(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!skillCount) { setError('No recognised skills in this job description. Paste the full description including requirements.'); return; }
    const title = form.title.trim() || parsed.titleGuess;
    const scoreAtSave = resume ? matchResumeToJob(resume, parsed).score : null;
    const id = addJob({ ...form, title, company: form.company.trim(), location: form.location.trim(), scoreAtSave });
    toast('Job match created');
    navigate(`/jobs/${id}`);
  };

  return (
    <div className="page">
      <Link to="/jobs" className="back-link"><ArrowLeft size={16} /> Job matches</Link>
      <PageHeader title="New job match" description="Paste a job description. We'll find the skills it asks for and compare them with your resume." />

      {!resume && <div className="alert info">You haven't added a resume yet. You can still save this job — it will be scored once you <Link to="/resume">add your resume</Link>.</div>}

      <form className="split" onSubmit={submit}>
        <section className="panel">
          <div className="form-grid">
            <label className="field"><span>Role title</span><input value={form.title} onChange={set('title')} placeholder="e.g. Data Analyst Intern" /></label>
            <label className="field"><span>Company</span><input value={form.company} onChange={set('company')} placeholder="e.g. Acme Analytics" /></label>
            <label className="field"><span>Location</span><input value={form.location} onChange={set('location')} placeholder="e.g. Chennai / Remote" /></label>
          </div>
          <label className="field">
            <span className="field-row">
              Job description
              <span className="row tight">
                <button type="button" className="btn ghost sm" onClick={() => fileRef.current?.click()} disabled={busy}>{busy ? <Loader2 size={14} className="spin" /> : <Upload size={14} />} Upload</button>
                <button type="button" className="btn ghost sm" onClick={() => setForm({ title: 'Junior Machine Learning Engineer', company: 'Example Analytics Labs', location: 'Bengaluru', jdText: SAMPLE_JOB })}>Use sample</button>
              </span>
            </span>
            <textarea rows={20} value={form.jdText} onChange={set('jdText')} placeholder="Paste the full job description, including requirements and 'nice to have' sections." />
          </label>
          <input ref={fileRef} type="file" hidden accept=".pdf,.txt,application/pdf,text/plain" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ''; }} />
          {error && <div className="alert error">{error}</div>}
        </section>

        <section className="panel sticky">
          <h2>Skills this job asks for</h2>
          {!parsed ? (
            <p className="muted">Required and preferred skills appear here as you paste.</p>
          ) : (
            <>
              <h3 className="sub">Required · {parsed.required.size}</h3>
              <SkillChips skills={[...parsed.required.keys()]} tone="req" />
              <h3 className="sub">Preferred · {parsed.preferred.size}</h3>
              <SkillChips skills={[...parsed.preferred.keys()]} tone="pref" />
              <p className="muted small">Lines under a "Nice to have" or "Preferred" heading, or phrased "is a plus", count as preferred.</p>
            </>
          )}
          <button className="btn primary block lg" disabled={!form.jdText.trim()}>{resume ? 'Run match' : 'Save job'}</button>
        </section>
      </form>
    </div>
  );
}
