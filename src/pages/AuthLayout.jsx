import { Logo } from '../components/ui.jsx';
import SkillGraph from '../components/SkillGraph.jsx';

const DEMO_NODES = [
  ['Python', true, 'Required'], ['SQL', true, 'Required'], ['Machine Learning', true, 'Required'], ['Deep Learning', false, 'Required'],
  ['Docker', false, 'Required'], ['Git', true, 'Required'], ['REST APIs', true, 'Required'], ['Statistics', false, 'Required'],
  ['AWS', true, 'Preferred'], ['Kubernetes', false, 'Preferred'], ['NLP', false, 'Preferred'], ['Communication', true, 'Required'],
].map(([skill, matched, importance]) => ({ skill, matched, importance }));

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <section className="auth-art" aria-hidden="true">
        <Logo light />
        <div className="auth-art-graph">
          <SkillGraph nodes={DEMO_NODES} centerLabel="ML Engineer" size={520} />
        </div>
        <div className="auth-art-copy">
          <h2>See exactly where your resume meets the job.</h2>
          <p>Every skill a job asks for, the line on your resume that proves it, and a plan for the ones that are missing.</p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card">
          <div className="only-mobile auth-mobile-logo"><Logo /></div>
          <h1>{title}</h1>
          {subtitle && <p className="auth-sub">{subtitle}</p>}
          {children}
        </div>
      </section>
    </div>
  );
}
