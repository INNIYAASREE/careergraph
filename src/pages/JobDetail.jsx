import { useMemo, useState } from 'react';
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, TrendingUp, TrendingDown, Copy, MapPin, Building, FileText } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { STATUSES } from '../lib/db.js';
import { buildLearningPlan, buildInterviewQuestions } from '../lib/match.js';
import SkillGraph, { GraphLegend } from '../components/SkillGraph.jsx';
import { SkillChips, ConfirmDialog, EmptyState, scoreBand, timeAgo } from '../components/ui.jsx';

const TABS = [
  { id: '', label: 'Fit report' },
  { id: 'plan', label: 'Learning plan' },
  { id: 'interview', label: 'Interview prep' },
  { id: 'notes', label: 'Notes & description' },
];

export default function JobDetail() {
  const { id, tab = '' } = useParams();
  const { jobs, resume, updateJob, removeJob } = useData();
  const toast = useToast();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="page">
        <EmptyState title="Job match not found" action={<Link className="btn primary" to="/jobs">Back to job matches</Link>}>It may have been deleted.</EmptyState>
      </div>
    );
  }

  const del = () => { removeJob(job.id); toast('Job match deleted'); navigate('/jobs'); };

  return (
    <div className="page">
      <Link to="/jobs" className="back-link"><ArrowLeft size={16} /> Job matches</Link>
      <div className="job-head">
        <div>
          <h1>{job.title}</h1>
          <p className="job-meta">
            {job.company && <span><Building size={14} /> {job.company}</span>}
            {job.location && <span><MapPin size={14} /> {job.location}</span>}
            <span>Saved {timeAgo(job.createdAt)}</span>
          </p>
        </div>
        <div className="page-actions">
          <select className={`status-select s-${job.status.toLowerCase()}`} value={job.status} onChange={(e) => { updateJob(job.id, { status: e.target.value }); toast(`Status changed to ${e.target.value}`); }} aria-label="Application status">
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className="btn secondary icon-only" aria-label="Delete job match" title="Delete" onClick={() => setConfirm(true)}><Trash2 size={16} /></button>
        </div>
      </div>

      <nav className="tabs" aria-label="Job sections">
        {TABS.map((t) => (
          <NavLink key={t.id} end to={`/jobs/${job.id}${t.id ? `/${t.id}` : ''}`} className={({ isActive }) => `tab ${isActive ? 'active' : ''}`}>{t.label}</NavLink>
        ))}
      </nav>

      {!job.report && tab !== 'notes' ? (
        <section className="panel">
          <EmptyState icon={FileText} title="Add your resume to score this job" action={<Link className="btn primary" to="/resume">Add resume</Link>}>
            This job is saved. Once your resume is added, you'll see the fit report, learning plan and interview questions.
          </EmptyState>
        </section>
      ) : (
        <>
          {tab === '' && <Report job={job} />}
          {tab === 'plan' && <Plan job={job} updateJob={updateJob} />}
          {tab === 'interview' && <Interview job={job} resume={resume} updateJob={updateJob} toast={toast} />}
          {tab === 'notes' && <Notes job={job} updateJob={updateJob} toast={toast} />}
        </>
      )}

      <ConfirmDialog open={confirm} title="Delete this job match?" body={`"${job.title}" and its notes, plan progress and practice answers will be removed. This can't be undone.`} confirmLabel="Delete" danger onConfirm={del} onCancel={() => setConfirm(false)} />
    </div>
  );
}

/* ---------------- Fit report ---------------- */
function Report({ job }) {
  const { report } = job;
  const [filter, setFilter] = useState('all');
  const b = scoreBand(report.score);
  const all = [...report.matched, ...report.missing];
  const rows = all.filter((r) => filter === 'all' || (filter === 'matched' ? r.matched : !r.matched));
  const req = all.filter((r) => r.importance === 'Required');
  const delta = job.scoreAtSave != null ? report.score - job.scoreAtSave : 0;
  const nodes = all.map((r) => ({ skill: r.skill, matched: r.matched, importance: r.importance }));

  return (
    <div className="stack">
      <section className="panel report-hero">
        <div className="report-graph">
          <SkillGraph nodes={nodes} centerLabel={job.title} />
          <GraphLegend />
        </div>
        <div className="report-summary">
          <span className={`band ${b.tone}`}>{b.label}</span>
          <div className="big-score">{report.score}<span>%</span></div>
          <p>
            Your resume shows evidence for <strong>{report.matched.length} of {report.totalCriteria}</strong> skills this job lists,
            including <strong>{req.filter((r) => r.matched).length} of {req.length}</strong> required. Required skills count double.
          </p>
          {delta !== 0 && (
            <p className={`delta ${delta > 0 ? 'up' : 'down'}`}>
              {delta > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {delta > 0 ? 'Up' : 'Down'} {Math.abs(delta)} points since you saved this job
            </p>
          )}
          <div className="disclaimer">
            This score measures alignment with the skills this job description lists. It is not a prediction of whether a company will hire you — interviews, depth of experience and other candidates all matter.
          </div>
          <div className="row">
            <Link to={`/jobs/${job.id}/plan`} className="btn primary">Open learning plan</Link>
            <Link to={`/jobs/${job.id}/interview`} className="btn secondary">Practise interview</Link>
          </div>
        </div>
      </section>

      <section className="panel flush">
        <div className="toolbar">
          <h2>Evidence by skill</h2>
          <div className="seg" role="group" aria-label="Filter skills">
            {[['all', `All ${all.length}`], ['matched', `Matched ${report.matched.length}`], ['missing', `Gaps ${report.missing.length}`]].map(([k, l]) => (
              <button key={k} className={filter === k ? 'active' : ''} onClick={() => setFilter(k)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table className="table evidence">
            <thead><tr><th>Skill</th><th>Job description says</th><th>Your resume shows</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.skill}>
                  <td>
                    <div className="skill-cell">
                      <span className={`mark ${r.matched ? 'on' : 'gap'}`} aria-label={r.matched ? 'Matched' : 'Gap'} />
                      <div><strong>{r.skill}</strong><div className="muted small">{r.importance} · {r.category}</div></div>
                    </div>
                  </td>
                  <td><Quotes items={r.jdEvidence} /></td>
                  <td>{r.matched ? <Quotes items={r.resumeEvidence} /> : <span className="gap-note">Not found. If you have this skill, add a project, internship or certification line that shows it.</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel">
        <h2>Your other skills</h2>
        <p className="muted small">On your resume but not asked for by this job — useful for other roles.</p>
        <SkillChips skills={report.extra} tone="extra" />
      </section>
    </div>
  );
}

function Quotes({ items }) {
  return <ul className="quotes">{items.map((q, i) => <li key={i}>{q}</li>)}</ul>;
}

/* ---------------- Learning plan ---------------- */
function Plan({ job, updateJob }) {
  const plan = useMemo(() => buildLearningPlan(job.report), [job.report]);
  const done = job.done || {};
  const keys = plan.items.flatMap((it) => it.topics.map((t) => `${it.skill}::${t}`));
  const completed = keys.filter((k) => done[k]).length;
  const toggle = (k) => updateJob(job.id, (j) => ({ done: { ...j.done, [k]: !j.done?.[k] } }));

  if (!plan.items.length) {
    return <section className="panel"><EmptyState title="No gaps to close">Your resume covers every skill this job lists. Head to interview prep to practise explaining them in depth.</EmptyState></section>;
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="panel-head">
          <h2>Preparation plan</h2>
          <span className="muted">{completed} of {keys.length} topics done</span>
        </div>
        <div className="progress"><div style={{ width: `${(completed / Math.max(keys.length, 1)) * 100}%` }} /></div>
        <p className="muted small">Ordered by priority: missing required skills first, then preferred skills, then required skills your resume mentions only once.</p>
      </section>
      {plan.plan.map((w) => (
        <section key={w.week} className="panel week">
          <h2>Week {w.week}</h2>
          <div className="topic-grid">
            {w.items.map((it) => (
              <article key={it.skill} className="topic">
                <header>
                  <strong>{it.skill}</strong>
                  <span className={`prio ${it.priority.toLowerCase()}`}>{it.priority} priority</span>
                </header>
                <p className="muted small">{it.reason}.</p>
                <ul className="checklist">
                  {it.topics.map((t) => {
                    const k = `${it.skill}::${t}`;
                    return <li key={k}><label className="check"><input type="checkbox" checked={!!done[k]} onChange={() => toggle(k)} /><span className={done[k] ? 'struck' : ''}>{t}</span></label></li>;
                  })}
                </ul>
                <p className="small proof">Show it on your resume: add a project or bullet that uses {it.skill}.</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------------- Interview prep ---------------- */
function Interview({ job, resume, updateJob, toast }) {
  const questions = useMemo(() => buildInterviewQuestions(job.report, resume), [job.report, resume]);
  const [type, setType] = useState('All');
  const [open, setOpen] = useState(null);
  const types = ['All', ...new Set(questions.map((q) => q.type))];
  const shown = questions.filter((q) => type === 'All' || q.type === type);
  const answers = job.answers || {};
  const answered = questions.filter((q) => answers[q.question]?.trim()).length;

  const copy = async () => {
    try { await navigator.clipboard.writeText(shown.map((q, i) => `${i + 1}. [${q.skill}] ${q.question}`).join('\n')); toast('Questions copied'); } catch { toast('Copy failed — select the text manually', 'error'); }
  };

  return (
    <div className="stack">
      <section className="panel flush">
        <div className="toolbar">
          <div>
            <h2>Technical questions for this role</h2>
            <p className="muted small">{answered} of {questions.length} practised. Required skills come first.</p>
          </div>
          <div className="row tight">
            <div className="seg" role="group" aria-label="Question type">
              {types.map((t) => <button key={t} className={type === t ? 'active' : ''} onClick={() => setType(t)}>{t}</button>)}
            </div>
            <button className="btn secondary sm" onClick={copy}><Copy size={14} /> Copy</button>
          </div>
        </div>
        <ol className="questions">
          {shown.map((q, i) => (
            <li key={q.question} className={open === q.question ? 'open' : ''}>
              <button className="q-row" onClick={() => setOpen(open === q.question ? null : q.question)} aria-expanded={open === q.question}>
                <span className="q-num">{i + 1}</span>
                <span className="q-text">{q.question}</span>
                <span className="q-tags">
                  <span className="tag">{q.skill}</span>
                  <span className={`qtype ${q.type === 'Gap area' ? 'gap' : q.type === 'Project deep-dive' ? 'proj' : 'ok'}`}>{q.type}</span>
                  {answers[q.question]?.trim() && <span className="tag done">Practised</span>}
                </span>
              </button>
              {open === q.question && (
                <div className="q-answer">
                  <textarea rows={5} autoFocus value={answers[q.question] || ''} placeholder="Draft your answer: define it, give an example from your own work, then mention trade-offs." onChange={(e) => updateJob(job.id, (j) => ({ answers: { ...j.answers, [q.question]: e.target.value } }))} />
                  <span className="muted small">Saved automatically.</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ---------------- Notes ---------------- */
function Notes({ job, updateJob, toast }) {
  const [form, setForm] = useState({ title: job.title, company: job.company, location: job.location || '', notes: job.notes || '', jdText: job.jdText });
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const dirty = Object.keys(form).some((k) => form[k] !== (job[k] || ''));
  const save = (e) => { e.preventDefault(); updateJob(job.id, form); toast('Changes saved'); };

  return (
    <form className="panel" onSubmit={save}>
      <div className="form-grid">
        <label className="field"><span>Role title</span><input value={form.title} onChange={set('title')} /></label>
        <label className="field"><span>Company</span><input value={form.company} onChange={set('company')} /></label>
        <label className="field"><span>Location</span><input value={form.location} onChange={set('location')} /></label>
      </div>
      <label className="field"><span>Notes</span><textarea rows={4} value={form.notes} onChange={set('notes')} placeholder="Deadlines, recruiter contact, referral, interview dates…" /></label>
      <label className="field"><span>Job description</span><textarea rows={14} value={form.jdText} onChange={set('jdText')} /></label>
      <div className="row end">
        <button className="btn primary" disabled={!dirty}>Save changes</button>
      </div>
    </form>
  );
}
