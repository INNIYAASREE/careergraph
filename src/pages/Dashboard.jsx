import { Link, useNavigate } from 'react-router-dom';
import { FileText, Briefcase, Check, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { STATUSES } from '../lib/db.js';
import { SKILLS } from '../lib/skills.js';
import { PageHeader, AlignmentBar, StatusBadge, EmptyState, timeAgo } from '../components/ui.jsx';

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const { resume, resumeMeta, jobs } = useData();
  const navigate = useNavigate();
  const first = user.name.split(' ')[0];

  const scored = jobs.filter((j) => j.report);
  const avg = scored.length ? Math.round(scored.reduce((t, j) => t + j.report.score, 0) / scored.length) : null;
  const active = jobs.filter((j) => ['Applied', 'Interviewing', 'Offer'].includes(j.status)).length;

  // Topics completed across all jobs' learning plans
  const topicStats = jobs.reduce((acc, j) => {
    if (!j.report) return acc;
    j.report.missing.forEach((m) => (SKILLS[m.skill]?.topics || []).forEach((t) => { acc.total++; if (j.done?.[`${m.skill}::${t}`]) acc.done++; }));
    return acc;
  }, { done: 0, total: 0 });

  // Most frequent required gaps across saved jobs
  const gapCounts = {};
  scored.forEach((j) => j.report.missing.filter((m) => m.importance === 'Required').forEach((m) => { gapCounts[m.skill] = (gapCounts[m.skill] || 0) + 1; }));
  const topGaps = Object.entries(gapCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const maxGap = topGaps[0]?.[1] || 1;

  const steps = [
    { done: !!resume, label: 'Add your resume', hint: 'Upload a PDF or paste the text.', to: '/resume' },
    { done: jobs.length > 0, label: 'Match your first job', hint: 'Paste a job description you are interested in.', to: '/jobs/new' },
    { done: topicStats.done > 0, label: 'Start your learning plan', hint: 'Open a job match and tick off a topic.', to: jobs[0] ? `/jobs/${jobs[0].id}/plan` : '/jobs' },
  ];
  const setupDone = steps.every((s) => s.done);

  return (
    <div className="page">
      <PageHeader title={`${greeting()}, ${first}`} description={jobs.length ? `You're tracking ${jobs.length} job${jobs.length > 1 ? 's' : ''}. Here's where you stand.` : 'Let’s see how your skills line up with the roles you want.'} />

      {!setupDone && (
        <section className="panel setup">
          <h2>Get set up</h2>
          <ol className="setup-steps">
            {steps.map((s, i) => (
              <li key={s.label} className={s.done ? 'done' : ''}>
                <span className="step-mark">{s.done ? <Check size={14} /> : i + 1}</span>
                <div><strong>{s.label}</strong><span>{s.hint}</span></div>
                {!s.done && <Link className="btn secondary sm" to={s.to}>Start</Link>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <section className="stats">
        <div className="stat"><span className="stat-label">Saved jobs</span><span className="stat-value">{jobs.length}</span></div>
        <div className="stat"><span className="stat-label">Average alignment</span><span className="stat-value">{avg === null ? '—' : `${avg}%`}</span></div>
        <div className="stat"><span className="stat-label">Active applications</span><span className="stat-value">{active}</span></div>
        <div className="stat"><span className="stat-label">Topics completed</span><span className="stat-value">{topicStats.done}<small>/{topicStats.total}</small></span></div>
      </section>

      <div className="dash-grid">
        <section className="panel">
          <div className="panel-head">
            <h2>Recent job matches</h2>
            <Link to="/jobs" className="text-link">View all</Link>
          </div>
          {jobs.length === 0 ? (
            <EmptyState icon={Briefcase} title="No job matches yet" action={<Link to="/jobs/new" className="btn primary">Match a job</Link>}>
              Paste a job description to see which of its skills your resume already covers.
            </EmptyState>
          ) : (
            <ul className="recent">
              {jobs.slice(0, 5).map((j) => (
                <li key={j.id}>
                  <button className="recent-row" onClick={() => navigate(`/jobs/${j.id}`)}>
                    <div className="recent-title"><strong>{j.title}</strong><span>{j.company} · {timeAgo(j.updatedAt)}</span></div>
                    <StatusBadge status={j.status} />
                    {j.report ? <AlignmentBar value={j.report.score} /> : <span className="muted small">Add resume</span>}
                    <ArrowUpRight size={16} className="muted" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Skills to build next</h2></div>
          {topGaps.length === 0 ? (
            <p className="muted">{jobs.length ? 'No required gaps across your saved jobs.' : 'Your most common gaps across saved jobs will appear here.'}</p>
          ) : (
            <>
              <p className="muted small">Required skills missing from your resume, by how many saved jobs ask for them.</p>
              <ul className="gap-bars">
                {topGaps.map(([skill, n]) => (
                  <li key={skill}>
                    <span>{skill}</span>
                    <div className="gap-track"><div style={{ width: `${(n / maxGap) * 100}%` }} /></div>
                    <span className="num">{n}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="panel">
          <div className="panel-head"><h2>Pipeline</h2></div>
          <ul className="pipeline">
            {STATUSES.map((s) => {
              const n = jobs.filter((j) => j.status === s).length;
              return <li key={s} className={n ? '' : 'zero'}><StatusBadge status={s} /><span>{n}</span></li>;
            })}
          </ul>
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Resume</h2>
            <Link to="/resume" className="text-link">{resume ? 'Edit' : 'Add'}</Link>
          </div>
          {resume ? (
            <div className="resume-mini">
              <FileText size={20} />
              <div>
                <strong>{resumeMeta.fileName || 'Pasted resume'}</strong>
                <span>{resume.skills.size} skills · {resume.projects.length} projects · updated {timeAgo(resumeMeta.updatedAt)}</span>
              </div>
            </div>
          ) : (
            <p className="muted">Add your resume so every job match can be scored.</p>
          )}
        </section>
      </div>
    </div>
  );
}
