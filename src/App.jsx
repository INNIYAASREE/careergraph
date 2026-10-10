import { HashRouter, Navigate, Route, Routes, useLocation, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { DataProvider } from './context/DataContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import AppShell from './components/AppShell.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Resume from './pages/Resume.jsx';
import Jobs from './pages/Jobs.jsx';
import NewJob from './pages/NewJob.jsx';
import JobDetail from './pages/JobDetail.jsx';
import Settings from './pages/Settings.jsx';

function RequireAuth() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return (
    <DataProvider key={user.id}>
      <AppShell />
    </DataProvider>
  );
}

function PublicOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/" replace /> : children;
}

function NotFound() {
  return (
    <div className="page">
      <div className="empty-state">
        <h3>Page not found</h3>
        <p>The page you opened doesn't exist.</p>
        <Link className="btn primary" to="/">Go to dashboard</Link>
      </div>
    </div>
  );
}

// HashRouter keeps routes working on static hosts like GitHub Pages (no server rewrites needed).
export default function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
            <Route path="/signup" element={<PublicOnly><Signup /></PublicOnly>} />
            <Route element={<RequireAuth />}>
              <Route index element={<Dashboard />} />
              <Route path="resume" element={<Resume />} />
              <Route path="jobs" element={<Jobs />} />
              <Route path="jobs/new" element={<NewJob />} />
              <Route path="jobs/:id/:tab?" element={<JobDetail />} />
              <Route path="settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
}
