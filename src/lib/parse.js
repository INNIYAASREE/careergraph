import { findSkills } from './skills.js';

// Section headings commonly found in student resumes.
const SECTION_PATTERNS = {
  education: /^(education|academic|academics|academic qualifications?|qualifications?)\b/i,
  projects: /^(projects?|academic projects|personal projects|key projects)\b/i,
  skills: /^(skills|technical skills|key skills|core competencies|technologies|tools)\b/i,
  certifications: /^(certifications?|certificates?|courses|licenses|achievements & certifications)\b/i,
  experience: /^(experience|work experience|internships?|employment|professional experience)\b/i,
  other: /^(summary|objective|profile|achievements|awards|hobbies|interests|languages|declaration|personal details|extra[- ]curricular|activities|publications)\b/i,
};

function headingOf(line) {
  const clean = line.replace(/[:\-–|]+$/, '').trim();
  if (clean.length > 40) return null;
  for (const [key, re] of Object.entries(SECTION_PATTERNS)) if (re.test(clean)) return key;
  return null;
}

/** Split resume text into sections and extract structured fields. */
export function parseResume(text) {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const sections = { header: [], education: [], projects: [], skills: [], certifications: [], experience: [], other: [] };
  let current = 'header';
  for (const line of lines) {
    const h = headingOf(line);
    if (h) { current = h; continue; }
    sections[current].push(line);
  }

  const name = sections.header.find((l) => /^[A-Za-z][A-Za-z .'-]{2,40}$/.test(l) && !/@|\d/.test(l)) || '';
  const email = (text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/) || [''])[0];

  return {
    name,
    email,
    education: groupEntries(sections.education),
    projects: groupEntries(sections.projects),
    certifications: sections.certifications.map(stripBullet).filter(Boolean),
    experience: groupEntries(sections.experience),
    skillsLine: sections.skills.map(stripBullet).join(', '),
    skills: findSkills(text),
    rawText: text,
  };
}

function stripBullet(l) { return l.replace(/^[•▪●\-*–·]\s*/, '').trim(); }

// Group lines into entries: a non-bullet line starts a new entry, bullet lines attach to it.
function groupEntries(lines) {
  const entries = [];
  for (const raw of lines) {
    const isBullet = /^[•▪●\-*–·]/.test(raw);
    const l = stripBullet(raw);
    if (!l) continue;
    if (!isBullet || entries.length === 0) entries.push({ title: l, details: [] });
    else entries[entries.length - 1].details.push(l);
  }
  return entries;
}

/** Extract required vs preferred skills from a job description. */
const PREF_HEADING = /^(nice to have|good to have|preferred( qualifications| skills)?|bonus( points)?|desirable|plus)\b/i;
const OTHER_HEADING = /^(requirements?|required|qualifications|must have|responsibilities|what you.?ll do|about|skills|soft skills|who you are|eligibility)\b/i;
const PREF_WORDS = /\b(nice to have|preferred|is a plus|a plus|bonus|good to have|desirable|optional|familiarity)\b/i;

export function parseJob(text) {
  // Separate lines that sit under a "Nice to have" heading or use preference wording.
  let inPref = false;
  const reqLines = [];
  const prefLines = [];
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    const bare = line.replace(/[:\-–]+$/, '');
    if (bare.length < 45 && PREF_HEADING.test(bare)) { inPref = true; continue; }
    if (bare.length < 45 && OTHER_HEADING.test(bare)) { inPref = false; }
    (inPref || PREF_WORDS.test(line) ? prefLines : reqLines).push(line);
  }
  const required = findSkills(reqLines.join('\n'));
  const preferred = new Map();
  for (const [skill, ev] of findSkills(prefLines.join('\n'))) {
    if (!required.has(skill)) preferred.set(skill, ev);
  }
  const titleLine = text.split('\n').map((l) => l.trim()).find((l) => l.length > 2 && l.length < 80) || 'Untitled role';
  return { required, preferred, titleGuess: titleLine };
}
