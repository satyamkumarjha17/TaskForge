import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { taskforgeApi } from '../services/taskforge';
import type { Workspace } from '../types';
import { EmptyState, ErrorMessage, Loading } from '../components/Feedback';
import { Modal } from '../components/Modal';
import { RecordForm } from '../components/Forms';

export function WorkspacePage() {
  const { id = '' } = useParams(); const navigate = useNavigate(); const [workspace, setWorkspace] = useState<Workspace | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const [dialog, setDialog] = useState<'board' | 'edit' | null>(null);
  const load = useCallback(async () => { setLoading(true); setError(''); try { setWorkspace(await taskforgeApi.getWorkspace(id)); } catch { setError('This workspace could not be found or loaded.'); } finally { setLoading(false); }
  }, [id]);
  useEffect(() => { void load(); }, [load]);
  async function createBoard(value: { name: string; description: string }) { await taskforgeApi.createBoard(id, value); setDialog(null); await load(); }
  async function editWorkspace(value: { name: string; description: string }) { await taskforgeApi.updateWorkspace(id, value); setDialog(null); await load(); }
  async function deleteWorkspace() { if (!window.confirm('Delete this workspace and all its boards and tasks? This cannot be undone.')) return; try { await taskforgeApi.deleteWorkspace(id); navigate('/workspaces'); } catch { setError('Workspace could not be deleted.'); } }
  if (loading) return <Loading label="Loading workspace" />;
  if (error || !workspace) return <ErrorMessage message={error || 'Workspace not found.'} />;
  return <><div className="back-link"><Link to="/workspaces"><ArrowLeft size={15} />All workspaces</Link></div><div className="page-heading"><div><span className="eyebrow">WORKSPACE</span><h1>{workspace.name}</h1><p>{workspace.description || 'No description added.'}</p></div><div className="heading-actions"><button className="button button-secondary" onClick={() => setDialog('edit')}>Edit</button><button className="button button-danger-quiet" onClick={() => void deleteWorkspace()}>Delete</button><button className="button button-primary" onClick={() => setDialog('board')}><Plus size={16} />New board</button></div></div><section className="section-block"><div className="section-heading"><div><span className="eyebrow">PROJECT SPACES</span><h2>Boards <span className="inline-count">{workspace.boards?.length ?? 0}</span></h2></div></div>{workspace.boards?.length ? <div className="board-grid">{workspace.boards.map((board) => <Link to={`/boards/${board.id}`} className="board-tile" key={board.id}><div className="board-tile-top"><span className="eyebrow">BOARD</span><ArrowRight size={16} /></div><h3>{board.name}</h3><p>{board.description || 'No description'}</p><span className="tile-meta">{board._count?.tasks ?? 0} tasks</span></Link>)}</div> : <EmptyState title="This workspace is ready for a board." description="Boards keep related tasks together. Create one for a project or workflow." action={<button className="button button-primary" onClick={() => setDialog('board')}><Plus size={15} />Create board</button>} />}</section>{dialog === 'board' && <Modal title="Create board" onClose={() => setDialog(null)}><RecordForm submitLabel="Create board" onSubmit={createBoard} /></Modal>}{dialog === 'edit' && <Modal title="Edit workspace" onClose={() => setDialog(null)}><RecordForm initial={workspace} submitLabel="Save workspace" onSubmit={editWorkspace} /></Modal>}</>;
}
