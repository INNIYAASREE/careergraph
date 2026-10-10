# CareerGraph — AI Resume and Job-Matching Intelligence

Students often apply to jobs without knowing how well their skills line up with each role. **CareerGraph** extracts skills from a resume and a job description, shows the evidence for every matched or missing skill, and turns the gaps into a preparation plan and interview practice — across every job you're tracking.

> **About the match score:** it measures how well a resume aligns with the skills listed in the selected job description. It is **not** a prediction of whether a company will hire someone.

## Features

| Area | What it does |
|---|---|
| **Sign up / sign in** | Accounts with hashed passwords (PBKDF2-SHA256, 150k iterations, random salt), "keep me signed in", sign out, change password, delete account. Each account's data is kept separate. |
| **Demo account** | "Explore with a demo account" on the sign-in page loads a sample resume and three job matches. |
| **Dashboard** | Setup checklist, saved jobs, average alignment, active applications, topics completed, most common skill gaps across jobs, and the application pipeline. |
| **Resume** | Drag-and-drop PDF upload. Extracts education, projects, experience, certifications and skills; the text is editable. |
| **New job match** | Paste or upload a job description; required vs preferred skills are shown live. |
| **Fit report** | A radial **skill graph** (filled = found on resume, dashed = gap, large = required), alignment score, and a table quoting the job-description line and resume line behind each skill. |
| **Learning plan** | Week-by-week topics for gaps, prioritised, with progress saved per job. |
| **Interview prep** | Role-specific technical questions and project deep-dives, with autosaved practice answers. |
| **Job matches** | Search, filter by status, sort by alignment, change status inline, export CSV. Scores update when you edit your resume and show the change since the job was saved. |
| **Settings** | Profile, password, export/import data (JSON), clear data, delete account. |

## Tech stack

- React 18 (JavaScript/JSX), HTML, CSS — no CSS framework
- Vite, React Router (hash routing), lucide-react icons
- pdf.js (`pdfjs-dist`) for in-browser PDF text extraction
- Web Crypto API for password hashing

## About sign-in (important)

Accounts and data are stored in the **browser's localStorage** — there is no server. That means:

- Passwords are never stored, only salted hashes, and nothing leaves the device.
- Accounts exist only in the browser where they were created. Use **Settings → Export data** to move data elsewhere.
- There is no "forgot password" email. This setup suits a demo or student project; a production app would use a backend or an auth provider (e.g. Firebase Auth, Supabase, Auth0).
- Sign-in requires a secure context: `http://localhost` or an `https://` site (GitHub Pages is fine).

## Run it locally

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:5173, then create an account or click **Explore with a demo account**.

```bash
npm run build     # production build in dist/
npm run preview   # serve the build locally
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CareerGraph"
git branch -M main
git remote add origin https://github.com/<your-username>/careergraph.git
git push -u origin main
```

### Free hosting on GitHub Pages

The repo includes `.github/workflows/deploy.yml`. After pushing, open **Settings → Pages → Source → GitHub Actions**. Every push to `main` publishes the app at `https://<your-username>.github.io/careergraph/`.

## Project structure

```
src/
├── main.jsx                 # entry point
├── App.jsx                  # routes + protected-route guard
├── styles/app.css           # design tokens, layout, components (light + dark)
├── context/
│   ├── AuthContext.jsx      # current user, sign in/up/out, profile
│   ├── DataContext.jsx      # per-user resume + jobs, live re-scoring
│   └── ToastContext.jsx     # notifications
├── components/
│   ├── AppShell.jsx         # sidebar, mobile menu, user card
│   ├── SkillGraph.jsx       # radial skill graph (SVG)
│   └── ui.jsx               # shared UI pieces, confirm dialog, helpers
├── pages/
│   ├── Login.jsx, Signup.jsx, AuthLayout.jsx
│   ├── Dashboard.jsx
│   ├── Resume.jsx
│   ├── Jobs.jsx, NewJob.jsx, JobDetail.jsx
│   └── Settings.jsx
└── lib/
    ├── auth.js              # accounts, hashing, sessions
    ├── db.js                # per-user storage
    ├── demo.js              # demo account seeding
    ├── skills.js            # skill taxonomy, aliases, topics, questions
    ├── parse.js             # resume sections + JD required/preferred split
    ├── match.js             # scoring, learning plan, question selection
    ├── pdf.js               # PDF text extraction (lazy-loaded)
    └── samples.js           # sample resume and job descriptions
```

## How matching works

1. `skills.js` defines ~50 skills, each with aliases (e.g. *React* ← "react", "reactjs", "react.js").
2. Resume and JD text are split into lines/sentences; aliases are matched as whole words, and the matching sentence is kept as **evidence**. Contact lines (email, URLs) are ignored.
3. Score = matched weight ÷ total weight; required skills weigh 2, preferred weigh 1.

**Extending:** add a skill to `SKILLS` in `src/lib/skills.js` with `category`, `aliases`, `topics` and `questions`. To use an LLM for extraction or questions, call it from a backend — never put API keys in front-end code.

**Limitations:** alias matching detects whether a skill is mentioned, not how deep the proficiency is. Scanned (image-only) PDFs have no text to extract; paste the text instead.
