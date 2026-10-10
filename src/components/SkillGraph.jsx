import { useMemo } from 'react';
import { SKILLS, CATEGORY_ORDER } from '../lib/skills.js';

/**
 * Radial skill graph: the role sits in the centre, every skill the job asks for sits on the ring.
 * Filled node = evidence found on the resume. Dashed outline = gap. Larger node = required.
 */
export default function SkillGraph({ nodes, centerLabel = 'Role', size = 560, animate = true, compact = false }) {
  const layout = useMemo(() => {
    const order = (n) => CATEGORY_ORDER.indexOf(SKILLS[n.skill]?.category ?? 'Other');
    const sorted = [...nodes].sort((a, b) => order(a) - order(b) || (a.importance === b.importance ? 0 : a.importance === 'Required' ? -1 : 1));
    const c = size / 2;
    const R = size * (compact ? 0.36 : 0.31);
    return sorted.map((n, i) => {
      const a = -Math.PI / 2 + (i / Math.max(sorted.length, 1)) * Math.PI * 2;
      const cos = Math.cos(a), sin = Math.sin(a);
      const lx = c + (R + 18) * cos, ly = c + (R + 18) * sin;
      return {
        ...n, x: c + R * cos, y: c + R * sin, lx, ly,
        anchor: cos > 0.2 ? 'start' : cos < -0.2 ? 'end' : 'middle',
        dy: sin > 0.6 ? 14 : sin < -0.6 ? -6 : 4,
        delay: i * 45,
      };
    });
  }, [nodes, size, compact]);

  const c = size / 2;
  const matched = nodes.filter((n) => n.matched).length;

  return (
    <svg className={`skill-graph ${animate ? 'animate' : ''}`} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Skill graph: ${matched} of ${nodes.length} job skills found on the resume`}>
      <circle cx={c} cy={c} r={size * (compact ? 0.36 : 0.31)} className="sg-ring" />
      <circle cx={c} cy={c} r={size * 0.2} className="sg-ring faint" />
      {layout.map((n) => (
        <line key={`l-${n.skill}`} x1={c} y1={c} x2={n.x} y2={n.y} className={`sg-edge ${n.matched ? 'on' : ''}`} style={{ animationDelay: `${n.delay}ms` }} />
      ))}
      <circle cx={c} cy={c} r={compact ? 46 : 54} className="sg-center" />
      <text x={c} y={c - 4} textAnchor="middle" className="sg-center-num">{matched}/{nodes.length}</text>
      <text x={c} y={c + 16} textAnchor="middle" className="sg-center-label">{truncate(centerLabel, 18)}</text>
      {layout.map((n) => (
        <g key={n.skill} className="sg-node" style={{ animationDelay: `${n.delay + 120}ms` }}>
          <title>{`${n.skill} — ${n.importance}, ${n.matched ? 'found on resume' : 'not found on resume'}`}</title>
          <circle cx={n.x} cy={n.y} r={n.importance === 'Required' ? 10 : 7} className={n.matched ? 'sg-dot on' : 'sg-dot gap'} />
          {!compact && <text x={n.lx} y={n.ly + n.dy} textAnchor={n.anchor} className={`sg-label ${n.matched ? '' : 'gap'}`}>{shortLabel(n.skill)}</text>}
        </g>
      ))}
    </svg>
  );
}

// Short forms keep labels inside the graph on narrow screens.
const SHORT = { 'Data Structures & Algorithms': 'DSA', 'Operating Systems': 'OS', 'Computer Networks': 'Networks', 'Data Visualization': 'Data Viz', 'Computer Vision': 'Vision', 'System Design': 'Sys Design', 'Machine Learning': 'ML', 'Deep Learning': 'Deep Learn.' };
const shortLabel = (s) => SHORT[s] || s;

function truncate(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }

export function GraphLegend() {
  return (
    <div className="graph-legend">
      <span><i className="lg-dot on" /> On your resume</span>
      <span><i className="lg-dot gap" /> Gap</span>
      <span><i className="lg-dot big" /> Required</span>
      <span><i className="lg-dot small" /> Preferred</span>
    </div>
  );
}
