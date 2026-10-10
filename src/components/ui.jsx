import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SKILLS, CATEGORY_ORDER } from '../lib/skills.js';

export function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'light' : ''}`} aria-label="CareerGraph home">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect width="28" height="28" rx="8" className="logo-bg" />
        <path d="M8 19 14 9l6 9" className="logo-line" />
        <circle cx="8" cy="19" r="2.6" className="logo-node" />
        <circle cx="14" cy="9" r="2.6" className="logo-node" />
        <circle cx="20" cy="18" r="2.6" className="logo-node accent" />
      </svg>
      <span>CareerGraph</span>
    </Link>
  );
}

export function PageHeader({ title, description, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

export function AlignmentBar({ value }) {
  const tone = value >= 75 ? 'good' : value >= 50 ? 'mid' : 'low';
  return (
    <div className="align-bar" title={`${value}% alignment`}>
      <div className="track"><div className={`fill ${tone}`} style={{ width: `${value}%` }} /></div>
      <span>{value}%</span>
    </div>
  );
}

export function scoreBand(score) {
  if (score >= 75) return { label: 'Strong alignment', tone: 'good' };
  if (score >= 50) return { label: 'Partial alignment', tone: 'mid' };
  return { label: 'Low alignment', tone: 'low' };
}

export function StatusBadge({ status }) {
  return <span className={`status-badge s-${status.toLowerCase()}`}>{status}</span>;
}

export function SkillChips({ skills, tone = '' }) {
  if (!skills.length) return <p className="muted small">None found.</p>;
  const groups = {};
  skills.forEach((s) => { const c = SKILLS[s]?.category || 'Other'; (groups[c] ||= []).push(s); });
  return (
    <div className="chip-groups">
      {[...CATEGORY_ORDER, 'Other'].filter((c) => groups[c]).map((c) => (
        <div key={c} className="chip-group">
          <span className="chip-cat">{c}</span>
          <div className="chips">{groups[c].map((s) => <span key={s} className={`chip ${tone}`}>{s}</span>)}</div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="empty-state">
      {Icon && <div className="empty-icon"><Icon size={22} /></div>}
      <h3>{title}</h3>
      <p>{children}</p>
      {action}
    </div>
  );
}

/** Accessible confirmation dialog built on <dialog>. */
export function ConfirmDialog({ open, title, body, confirmLabel, danger, onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className="dialog" onCancel={(e) => { e.preventDefault(); onCancel(); }}>
      <h3>{title}</h3>
      <p>{body}</p>
      <div className="dialog-actions">
        <button className="btn secondary" onClick={onCancel}>Cancel</button>
        <button className={`btn ${danger ? 'danger' : 'primary'}`} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </dialog>
  );
}

export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  if (s < 86400 * 7) return `${Math.floor(s / 86400)} d ago`;
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function downloadFile(name, content, type) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const a = document.createElement('a');
  a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}
