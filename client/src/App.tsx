import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspacesPage } from './pages/WorkspacesPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { BoardPage } from './pages/BoardPage';
import { Loading } from './components/Feedback';

function Protected() { const { user, loading } = useAuth(); if (loading) return <Loading label="Restoring your session" />; return user ? <Outlet /> : <Navigate to="/login" replace />; }
function NotFound() { return <main className="not-found"><span className="eyebrow">404</span><h1>That page is not here.</h1><p>The address may be incorrect, or the resource may have been removed.</p><a className="button button-primary" href="/">Return to dashboard</a></main>; }
export default function App() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /><Route element={<Protected />}><Route element={<AppLayout />}><Route index element={<DashboardPage />} /><Route path="workspaces" element={<WorkspacesPage />} /><Route path="workspaces/:id" element={<WorkspacePage />} /><Route path="boards/:id" element={<BoardPage />} /></Route></Route><Route path="*" element={<NotFound />} /></Routes>;
}
