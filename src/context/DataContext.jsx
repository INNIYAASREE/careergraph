import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadWorkspace, saveWorkspace, newId } from '../lib/db.js';
import { parseResume, parseJob } from '../lib/parse.js';
import { matchResumeToJob } from '../lib/match.js';
import { useAuth } from './AuthContext.jsx';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { user } = useAuth();
  const [ws, setWs] = useState(() => loadWorkspace(user.id));

  // The provider is re-mounted per user (key={user.id}), so this only ever saves the signed-in user's data.
  useEffect(() => { saveWorkspace(user.id, ws); }, [user.id, ws]);

  const resume = useMemo(() => (ws.resume?.text?.trim() ? parseResume(ws.resume.text) : null), [ws.resume]);

  // Every saved job is re-scored against the CURRENT resume, so improvements show up immediately.
  const jobs = useMemo(() => ws.jobs.map((j) => {
    const parsed = parseJob(j.jdText);
    const report = resume ? matchResumeToJob(resume, parsed) : null;
    return { ...j, parsed, report };
  }), [ws.jobs, resume]);

  const setResume = useCallback((text, fileName = '') => setWs((w) => ({ ...w, resume: text ? { text, fileName, updatedAt: new Date().toISOString() } : null })), []);

  const addJob = useCallback((job) => {
    const id = newId();
    const now = new Date().toISOString();
    setWs((w) => ({ ...w, jobs: [{ id, status: 'Saved', notes: '', location: '', done: {}, answers: {}, createdAt: now, updatedAt: now, ...job }, ...w.jobs] }));
    return id;
  }, []);

  const updateJob = useCallback((id, patch) => setWs((w) => ({ ...w, jobs: w.jobs.map((j) => (j.id === id ? { ...j, ...(typeof patch === 'function' ? patch(j) : patch), updatedAt: new Date().toISOString() } : j)) })), []);
  const removeJob = useCallback((id) => setWs((w) => ({ ...w, jobs: w.jobs.filter((j) => j.id !== id) })), []);
  const replaceAll = useCallback((data) => setWs({ resume: data.resume || null, jobs: Array.isArray(data.jobs) ? data.jobs : [] }), []);

  const value = useMemo(() => ({ raw: ws, resume, resumeMeta: ws.resume, jobs, setResume, addJob, updateJob, removeJob, replaceAll }), [ws, resume, jobs, setResume, addJob, updateJob, removeJob, replaceAll]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
