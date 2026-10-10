// Per-user workspace stored in localStorage under cg:data:<userId>.
// Shape: { resume: { text, fileName, updatedAt } | null, jobs: Job[] }
// Job:   { id, title, company, location, jdText, status, notes, scoreAtSave, createdAt, updatedAt, done: {}, answers: {} }

export const STATUSES = ['Saved', 'Preparing', 'Applied', 'Interviewing', 'Offer', 'Rejected', 'Withdrawn'];

const key = (userId) => `cg:data:${userId}`;
export const emptyWorkspace = () => ({ resume: null, jobs: [] });

export function loadWorkspace(userId) {
  try { return { ...emptyWorkspace(), ...JSON.parse(localStorage.getItem(key(userId))) }; } catch { return emptyWorkspace(); }
}

export function saveWorkspace(userId, data) {
  try { localStorage.setItem(key(userId), JSON.stringify(data)); return true; } catch { return false; }
}

export const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
