import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Briefcase, Settings, Plus, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { Logo } from './ui.jsx';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/resume', label: 'Resume', icon: FileText },
  { to: '/jobs', label: 'Job matches', icon: Briefcase },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const { jobs, resumeMeta } = useData();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const initials = user.name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className={`shell ${open ? 'nav-open' : ''}`}>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="sidebar-top">
          <Logo />
          <button className="icon-btn only-mobile" aria-label="Close menu" onClick={() => setOpen(false)}><X size={20} /></button>
        </div>
        <button className="btn primary block" onClick={() => navigate('/jobs/new')}><Plus size={18} /> New job match</button>
        <nav className="nav">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
              {to === '/jobs' && jobs.length > 0 && <span className="nav-count">{jobs.length}</span>}
              {to === '/resume' && !resumeMeta && <span className="nav-dot" aria-label="Resume not added" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="avatar" aria-hidden="true">{initials}</div>
          <div className="user-meta">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button className="icon-btn" aria-label="Sign out" title="Sign out" onClick={logout}><LogOut size={18} /></button>
        </div>
      </aside>
      <div className="scrim" onClick={() => setOpen(false)} />

      <div className="main">
        <header className="mobile-bar">
          <button className="icon-btn" aria-label="Open menu" onClick={() => setOpen(true)}><Menu size={22} /></button>
          <Logo />
          <span style={{ width: 36 }} />
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
