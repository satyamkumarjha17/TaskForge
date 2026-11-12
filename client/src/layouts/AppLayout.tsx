import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ErrorMessage } from '../components/Feedback';

export function AppLayout() {
  const { user, logout } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const currentSection = location.pathname.startsWith('/boards/') ? 'Board' : location.pathname.startsWith('/workspaces/') ? 'Workspace' : location.pathname === '/workspaces' ? 'Workspaces' : 'Overview'; const [mobileOpen, setMobileOpen] = useState(false); const [logoutError, setLogoutError] = useState('');
  async function signOut() { setLogoutError(''); try { await logout(); navigate('/login'); } catch { setLogoutError('Could not log out. Check your connection and try again.'); } }
  return <div className="app-shell"><aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}><div className="brand"><span className="brand-mark">T</span><span>TaskForge</span><button className="icon-button mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={18} /></button></div><div className="side-label">WORKSPACE</div><nav className="side-nav"><NavLink to="/" end onClick={() => setMobileOpen(false)}><LayoutDashboard size={17} />Overview</NavLink><NavLink to="/workspaces" onClick={() => setMobileOpen(false)}><span className="nav-grid">▦</span>Workspaces</NavLink></nav><div className="sidebar-bottom">{logoutError && <ErrorMessage message={logoutError} />}<div className="profile"><span className="avatar">{user?.name.slice(0, 1).toUpperCase()}</span><span className="profile-name">{user?.name}</span><button className="icon-button" onClick={() => void signOut()} aria-label="Log out" title="Log out"><LogOut size={16} /></button></div></div></aside>{mobileOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}<main className="main-area"><header className="topbar"><button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={19} /></button><div className="breadcrumb">TaskForge <span>/</span> {currentSection}</div></header><div className="page-content"><Outlet /></div></main></div>;
}
