import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { UploadCloud, Loader2, GraduationCap, FolderGit2, Award, Building2 } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { parseResume } from '../lib/parse.js';
import { SAMPLE_RESUME } from '../lib/samples.js';
import { PageHeader, SkillChips, timeAgo } from '../components/ui.jsx';

export default function Resume() {
  const { resumeMeta, setResume } = useData();
  const toast = useToast();
  const location = useLocation();
  const [draft, setDraft] = useState(resumeMeta?.text || '');
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { setDraft(resumeMeta?.text || ''); }, [resumeMeta?.text]);

  const preview = draft.trim() ? parseResume(draft) : null;
  const dirty = draft !== (resumeMeta?.text || '');

  const handleFile = async (file) => {
    if (!file) return;
    setBusy(true); setError('');
    try {
      const { readFileText } = await import('../lib/pdf.js');
      const text = await readFileText(file);
      if (!text.trim()) throw new Error('No text found in this file. It may be a scanned image — paste the text instead.');
      setDraft(text);
      setResume(text, file.name);
      toast('Resume uploaded and saved');
    } catch (err) {
      setError(err.message || 'Could not read that file.');
    } finally { setBusy(false); }
  };

  const save = () => { setResume(draft, resumeMeta?.fileName || ''); toast('Resume saved'); };

  return (
    <div className="page">
      <PageHeader
        title="Resume"
        description={resumeMeta ? `${resumeMeta.fileName || 'Pasted resume'} · updated ${timeAgo(resumeMeta.updatedAt)}` : 'Upload your resume. Every job match is scored against it.'}
        actions={<button className="btn primary" disabled={!dirty || !draft.trim()} onClick={save}>Save resume</button>}
      />

      {location.state?.welcome && !resumeMeta && <div className="alert info">Your account is ready. Start by adding your resume.</div>}

      <div className="split">
        <section className="panel">
          <div
            className={`dropzone ${drag ? 'drag' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files?.[0]); }}
          >
            {busy ? <Loader2 size={28} className="spin" /> : <UploadCloud size={28} />}
            <p><strong>Drop your resume PDF here</strong> or</p>
            <div className="row">
              <button className="btn secondary" onClick={() => inputRef.current?.click()} disabled={busy}>Choose file</button>
              <button className="btn ghost" onClick={() => setDraft(SAMPLE_RESUME)}>Use sample resume</button>
            </div>
            <input ref={inputRef} type="file" accept=".pdf,.txt,application/pdf,text/plain" hidden onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
            <span className="muted small">PDF or .txt · read in your browser, never uploaded</span>
          </div>
          {error && <div className="alert error">{error}</div>}
          <label className="field">
            <span>Resume text <em className="muted">— edit anything the PDF reader got wrong</em></span>
            <textarea rows={18} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Or paste your resume text here" />
          </label>
        </section>

        <section className="panel">
          <h2>Extracted profile</h2>
          {!preview ? (
            <p className="muted">Education, projects, experience, certifications and skills will appear here.</p>
          ) : (
            <div className="profile">
              {(preview.name || preview.email) && <div className="profile-id"><strong>{preview.name}</strong><span>{preview.email}</span></div>}
              <Section icon={GraduationCap} title="Education" items={preview.education} />
              <Section icon={FolderGit2} title="Projects" items={preview.projects} />
              <Section icon={Building2} title="Experience" items={preview.experience} />
              <div className="profile-sec">
                <h3><Award size={16} /> Certifications</h3>
                {preview.certifications.length ? <ul className="plain">{preview.certifications.map((c, i) => <li key={i}>{c}</li>)}</ul> : <p className="muted small">None found. Add a "Certifications" heading.</p>}
              </div>
              <div className="profile-sec">
                <h3>Skills found ({preview.skills.size})</h3>
                <SkillChips skills={[...preview.skills.keys()]} />
                <p className="muted small">Skills are detected anywhere in your resume — in projects and experience too, not just the Skills section.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, items }) {
  return (
    <div className="profile-sec">
      <h3><Icon size={16} /> {title}</h3>
      {items.length ? (
        <ul className="entries">
          {items.map((it, i) => (
            <li key={i}>
              <strong>{it.title}</strong>
              {it.details.length > 0 && <ul>{it.details.map((d, j) => <li key={j}>{d}</li>)}</ul>}
            </li>
          ))}
        </ul>
      ) : <p className="muted small">None found. Add a "{title}" heading.</p>}
    </div>
  );
}
