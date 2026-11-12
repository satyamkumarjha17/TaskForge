import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FolderKanban, Plus } from 'lucide-react';
import { taskforgeApi } from '../services/taskforge';
import type { Workspace } from '../types';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback';
import { Modal } from '../components/Modal';
import { RecordForm } from '../components/Forms';

export function WorkspacesPage() {
  const [items, setItems] = useState<Workspace[]>([]); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [createOpen, setCreateOpen] = useState(false);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setItems(await taskforgeApi.listWorkspaces()); } catch { setError('Workspaces could not be loaded.'); } finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  async function create(value: { name: string; description: string }) { await taskforgeApi.createWorkspace(value); setCreateOpen(false); await load(); }
  return <><div className="page-heading"><div><span className="eyebrow">ORGANIZE YOUR WORK</span><h1>Workspaces</h1><p>Separate projects, courses, and areas of responsibility.</p></div><button className="button button-primary" onClick={() => setCreateOpen(true)}><Plus size={16} />New workspace</button></div>{error && <ErrorMessage message={error} />}{loading ? <Loading /> : items.length ? <div className="workspace-list workspace-list-large">{items.map((item) => <Link to={`/workspaces/${item.id}`} className="workspace-row" key={item.id}><span className="record-icon"><FolderKanban size={18} /></span><span className="record-main"><strong>{item.name}</strong><small>{item.description || 'No description'}</small></span><span className="record-count">{item._count?.boards ?? 0} boards</span><ArrowRight size={16} className="row-arrow" /></Link>)}</div> : <EmptyState title="No workspaces yet" description="Create your first workspace to start organizing boards and tasks." action={<button className="button button-primary" onClick={() => setCreateOpen(true)}><Plus size={15} />Create workspace</button>} />}{createOpen && <Modal title="Create workspace" onClose={() => setCreateOpen(false)}><RecordForm submitLabel="Create workspace" onSubmit={create} /></Modal>}</>;
}
