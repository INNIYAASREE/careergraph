import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Download, Briefcase } from 'lucide-react';
import { useData } from '../context/DataContext.jsx';
import { STATUSES } from '../lib/db.js';
import { PageHeader, AlignmentBar, EmptyState, timeAgo, downloadFile } from '../components/ui.jsx';

export default function Jobs() {
  const { jobs, updateJob, resume } = useData();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState('updated');

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return jobs
      .filter((j) => (status === 'All' || j.status === status) && (!term || `${j.title} ${j.company} ${j.location}`.toLowerCase().includes(term)))
      .sort((a, b) => (sort === 'score' ? (b.report?.score ?? -1) - (a.report?.score ?? -1) : new Date(b.updatedAt) - new Date(a.updatedAt)));
  }, [jobs, q, status, sort]);

  const exportCsv = () => {
    const head = ['Role', 'Company', 'Location', 'Alignment %', 'Status', 'Missing required skills', 'Notes', 'Saved on'];
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = jobs.map((j) => [j.title, j.company, j.location, j.report?.score ?? '', j.status, j.report?.missing.filter((m) => m.importance === 'Required').map((m) => m.skill).join('; ') ?? '', j.notes, j.createdAt.slice(0, 10)]);
    downloadFile('careergraph-job-matches.csv', [head, ...lines].map((r) => r.map(esc).join(',')).join('\n'), 'text/csv');
  };

  return (
    <div className="page">
      <PageHeader
        title="Job matches"
        description="Every job you've matched, scored against your current resume."
        actions={<>
          {jobs.length > 0 && <button className="btn secondary" onClick={exportCsv}><Download size={16} /> Export CSV</button>}
          <Link to="/jobs/new" className="btn primary"><Plus size={16} /> New job match</Link>
        </>}
      />

      {!resume && jobs.length > 0 && <div className="alert info">Add your resume to see alignment scores. <Link to="/resume">Add resume</Link></div>}

      {jobs.length === 0 ? (
        <section className="panel">
          <EmptyState icon={Briefcase} title="No job matches yet" action={<Link to="/jobs/new" className="btn primary"><Plus size={16} /> New job match</Link>}>
            Paste a job description to see your alignment, the evidence behind it, and what to learn next.
          </EmptyState>
        </section>
      ) : (
        <section className="panel flush">
          <div className="toolbar">
            <div className="search">
              <Search size={16} />
              <input placeholder="Search role, company or location" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search job matches" />
            </div>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
              <option>All</option>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
              <option value="updated">Recently updated</option>
              <option value="score">Highest alignment</option>
            </select>
          </div>
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Role</th><th>Alignment</th><th>Required gaps</th><th>Status</th><th>Updated</th></tr>
              </thead>
              <tbody>
                {rows.map((j) => {
                  const gaps = j.report?.missing.filter((m) => m.importance === 'Required') ?? [];
                  return (
                    <tr key={j.id} className="clickable" onClick={() => navigate(`/jobs/${j.id}`)}>
                      <td>
                        <Link to={`/jobs/${j.id}`} className="row-title" onClick={(e) => e.stopPropagation()}>{j.title}</Link>
                        <div className="muted small">{[j.company, j.location].filter(Boolean).join(' · ')}</div>
                      </td>
                      <td>{j.report ? <AlignmentBar value={j.report.score} /> : <span className="muted small">—</span>}</td>
                      <td className="small">{j.report ? (gaps.length ? gaps.slice(0, 3).map((g) => g.skill).join(', ') + (gaps.length > 3 ? ` +${gaps.length - 3}` : '') : <span className="ok-text">None</span>) : '—'}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <select className={`status-select s-${j.status.toLowerCase()}`} value={j.status} onChange={(e) => updateJob(j.id, { status: e.target.value })} aria-label={`Status for ${j.title}`}>
                          {STATUSES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="muted small nowrap">{timeAgo(j.updatedAt)}</td>
                    </tr>
                  );
                })}
                {rows.length === 0 && <tr><td colSpan={5} className="muted center">No jobs match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
