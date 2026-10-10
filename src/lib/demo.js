import { signUp, findUserByEmail } from './auth.js';
import { saveWorkspace, loadWorkspace, newId } from './db.js';
import { parseResume, parseJob } from './parse.js';
import { matchResumeToJob } from './match.js';
import { SAMPLE_RESUME, SAMPLE_JOB, SAMPLE_JOB_2, SAMPLE_JOB_3 } from './samples.js';

export const DEMO = { email: 'demo@careergraph.app', password: 'Demo1234' };

/** Create the demo account (once) and fill it with a sample resume and three jobs. */
export async function ensureDemoAccount() {
  let user = findUserByEmail(DEMO.email);
  if (!user) user = await signUp({ name: 'Priya Raman', ...DEMO });
  const ws = loadWorkspace(user.id);
  if (!ws.resume && ws.jobs.length === 0) {
    const resume = parseResume(SAMPLE_RESUME);
    const day = 864e5;
    const mk = (title, company, location, jdText, status, ageDays) => ({
      id: newId(), title, company, location, jdText, status, notes: '', done: {}, answers: {},
      scoreAtSave: matchResumeToJob(resume, parseJob(jdText)).score,
      createdAt: new Date(Date.now() - ageDays * day).toISOString(),
      updatedAt: new Date(Date.now() - ageDays * day).toISOString(),
    });
    saveWorkspace(user.id, {
      resume: { text: SAMPLE_RESUME, fileName: 'priya-raman-resume.pdf', updatedAt: new Date().toISOString() },
      jobs: [
        mk('Junior Machine Learning Engineer', 'Example Analytics Labs', 'Bengaluru', SAMPLE_JOB, 'Preparing', 1),
        mk('Frontend Developer Intern', 'Example Commerce', 'Chennai', SAMPLE_JOB_2, 'Applied', 4),
        mk('Data Analyst — Graduate Program', 'Example Retail Group', 'Coimbatore', SAMPLE_JOB_3, 'Interviewing', 9),
      ],
    });
  }
  return user;
}
