import { useState } from 'react';
import type { ReactNode } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ErrorMessage } from '../components/Feedback';
import { getError } from '../components/Forms';

export function LoginPage() {
  const { user, login, loading } = useAuth(); const navigate = useNavigate(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  if (loading) return <div className="auth-loading">Loading TaskForge…</div>; if (user) return <Navigate to="/" replace />;
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); setError(''); try { await login(email, password); navigate('/'); } catch (e) { setError(getError(e)); } finally { setSaving(false); } }
  return <AuthFrame mode="login"><form className="form-stack" onSubmit={submit}><label>Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>{error && <ErrorMessage message={error} />}<button className="button button-primary auth-submit" disabled={saving}>{saving ? 'Signing in…' : 'Sign in'}</button></form><p className="auth-switch">New to TaskForge? <Link to="/register">Create an account</Link></p></AuthFrame>;
}
export function RegisterPage() {
  const { user, register, loading } = useAuth(); const navigate = useNavigate(); const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  if (loading) return <div className="auth-loading">Loading TaskForge…</div>; if (user) return <Navigate to="/" replace />;
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); setError(''); try { await register(name, email, password); navigate('/'); } catch (e) { setError(getError(e)); } finally { setSaving(false); } }
  return <AuthFrame mode="register"><form className="form-stack" onSubmit={submit}><label>Your name<input autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(e) => setName(e.target.value)} /></label><label>Email address<input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} /><span className="field-hint">At least 8 characters. Maximum 72 UTF-8 bytes.</span></label>{error && <ErrorMessage message={error} />}<button className="button button-primary auth-submit" disabled={saving}>{saving ? 'Creating account…' : 'Create account'}</button></form><p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p></AuthFrame>;
}
function AuthFrame({ mode, children }: { mode: 'login' | 'register'; children: ReactNode }) { return <main className="auth-page"><div className="auth-aside"><div className="brand auth-brand"><span className="brand-mark">T</span><span>TaskForge</span></div><div className="auth-note"><span className="eyebrow">A CLEARER WAY TO WORK</span><h1>Keep the work moving.</h1><p>One place for your projects, priorities, and next steps.</p></div><span className="auth-footnote">Personal work, brought into focus.</span></div><section className="auth-panel"><div className="auth-panel-inner"><span className="eyebrow">YOUR WORKSPACE STARTS HERE</span><h2>{mode === 'login' ? 'Welcome back.' : 'Create your account.'}</h2><p className="auth-intro">{mode === 'login' ? 'Sign in to pick up where you left off.' : 'Set up a workspace for the work ahead.'}</p>{children}</div></section></main>; }
