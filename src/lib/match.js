import { SKILLS } from './skills.js';

/**
 * Compare resume skills with job skills.
 * The score is an ALIGNMENT measure against the job's listed criteria —
 * required skills weigh 2, preferred skills weigh 1. It is NOT a hiring prediction.
 */
export function matchResumeToJob(resume, job) {
  const rows = [];
  let earned = 0;
  let possible = 0;

  const add = (skill, jdEvidence, weight, importance) => {
    const resumeEvidence = resume.skills.get(skill) || [];
    const matched = resumeEvidence.length > 0;
    possible += weight;
    if (matched) earned += weight;
    rows.push({ skill, category: SKILLS[skill]?.category || 'Other', importance, matched, resumeEvidence, jdEvidence });
  };

  for (const [skill, ev] of job.required) add(skill, ev, 2, 'Required');
  for (const [skill, ev] of job.preferred) add(skill, ev, 1, 'Preferred');

  const extra = [...resume.skills.keys()].filter((s) => !job.required.has(s) && !job.preferred.has(s));
  const score = possible ? Math.round((earned / possible) * 100) : 0;

  return {
    score,
    matched: rows.filter((r) => r.matched),
    missing: rows.filter((r) => !r.matched).sort((a, b) => (a.importance === b.importance ? 0 : a.importance === 'Required' ? -1 : 1)),
    extra,
    totalCriteria: rows.length,
  };
}

/** Build a learning plan: missing required skills first, then preferred, then weakly evidenced matches. */
export function buildLearningPlan(report, weeks = 4) {
  const items = [];
  for (const r of report.missing) {
    items.push({ skill: r.skill, reason: `${r.importance} by the job description, not found in your resume`, priority: r.importance === 'Required' ? 'High' : 'Medium', topics: SKILLS[r.skill]?.topics || [] });
  }
  for (const r of report.matched) {
    if (r.resumeEvidence.length === 1 && r.importance === 'Required') {
      items.push({ skill: r.skill, reason: 'Mentioned only once in your resume — strengthen it with a project or deeper practice', priority: 'Low', topics: (SKILLS[r.skill]?.topics || []).slice(0, 2) });
    }
  }
  // distribute across weeks round-robin by priority order
  const plan = Array.from({ length: weeks }, (_, i) => ({ week: i + 1, items: [] }));
  items.forEach((it, i) => plan[Math.min(Math.floor((i * weeks) / Math.max(items.length, 1)), weeks - 1)].items.push(it));
  return { items, plan: plan.filter((w) => w.items.length) };
}

/** Pick interview questions: emphasise required skills, include matched ones (you'll be asked about your resume) and gaps. */
export function buildInterviewQuestions(report, resume) {
  const qs = [];
  const ordered = [...report.matched.filter((r) => r.importance === 'Required'), ...report.missing.filter((r) => r.importance === 'Required'), ...report.matched.filter((r) => r.importance === 'Preferred'), ...report.missing.filter((r) => r.importance === 'Preferred')];
  for (const r of ordered) {
    const bank = SKILLS[r.skill]?.questions || [];
    bank.slice(0, r.importance === 'Required' ? 3 : 1).forEach((q) => qs.push({ skill: r.skill, question: q, type: r.matched ? 'On your resume' : 'Gap area' }));
  }
  // project-based questions
  (resume.projects || []).slice(0, 3).forEach((p) => {
    qs.push({ skill: 'Projects', question: `Walk me through "${p.title}". What was your role, what was hardest, and what would you change?`, type: 'Project deep-dive' });
  });
  return qs;
}
