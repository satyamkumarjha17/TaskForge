import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Priority, Task, TaskStatus, Workspace } from '../types';
import { ErrorMessage } from './Feedback';

type RecordFormProps = { initial?: { name: string; description: string | null }; submitLabel: string; onSubmit: (value: { name: string; description: string }) => Promise<void> };
export function RecordForm({ initial, submitLabel, onSubmit }: RecordFormProps) {
  const [name, setName] = useState(initial?.name ?? ''); const [description, setDescription] = useState(initial?.description ?? ''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setSaving(true); try { await onSubmit({ name: name.trim(), description: description.trim() }); } catch (e) { setError(getError(e)); } finally { setSaving(false); } }
  return <form className="form-stack" onSubmit={submit}><label>Name<input required maxLength={80} value={name} onChange={(e) => setName(e.target.value)} autoFocus /></label><label>Description <span className="optional">Optional</span><textarea rows={3} maxLength={500} value={description} onChange={(e) => setDescription(e.target.value)} /></label>{error && <ErrorMessage message={error} />}<button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : submitLabel}</button></form>;
}
type TaskFormProps = { initial?: Task; defaultStatus?: TaskStatus; onSubmit: (value: { title: string; description: string; priority: Priority; status: TaskStatus; dueDate: string | null }) => Promise<void> };
export function TaskForm({ initial, defaultStatus = 'TODO', onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? ''); const [description, setDescription] = useState(initial?.description ?? ''); const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'MEDIUM'); const [status, setStatus] = useState<TaskStatus>(initial?.status ?? defaultStatus); const [dueDate, setDueDate] = useState(initial?.dueDate?.slice(0, 10) ?? ''); const [error, setError] = useState(''); const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setError(''); setSaving(true); try { await onSubmit({ title: title.trim(), description: description.trim(), priority, status, dueDate: dueDate || null }); } catch (e) { setError(getError(e)); } finally { setSaving(false); } }
  return <form className="form-stack" onSubmit={submit}><label>Task title<input required maxLength={160} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus /></label><label>Description <span className="optional">Optional</span><textarea rows={4} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} /></label><div className="form-grid"><label>Priority<select value={priority} onChange={(e) => setPriority(e.target.value as Priority)}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></label><label>Status<select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}><option value="TODO">To Do</option><option value="IN_PROGRESS">In Progress</option><option value="DONE">Done</option></select></label></div><label>Due date <span className="optional">Optional</span><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>{error && <ErrorMessage message={error} />}<button className="button button-primary" disabled={saving}>{saving ? 'Saving…' : initial ? 'Save changes' : 'Create task'}</button></form>;
}
export function getError(error: unknown) { if (typeof error === 'object' && error !== null && 'response' in error) { const response = (error as { response?: { data?: { error?: { message?: string } } } }).response; return response?.data?.error?.message ?? 'The request could not be completed.'; } return 'The request could not be completed.'; }


export function BoardQuickForm({ workspaces, onSubmit }: { workspaces: Workspace[]; onSubmit: (value: { workspaceId: string; name: string; description: string }) => Promise<void> }) {
  const [workspaceId, setWorkspaceId] = useState(workspaces[0]?.id ?? '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setError(''); setSaving(true);
    try { await onSubmit({ workspaceId, name: name.trim(), description: description.trim() }); }
    catch (e) { setError(getError(e)); }
    finally { setSaving(false); }
  }
  return <form className="form-stack" onSubmit={submit}>
    <label>Workspace<select required value={workspaceId} onChange={(event) => setWorkspaceId(event.target.value)}>{workspaces.map((workspace) => <option value={workspace.id} key={workspace.id}>{workspace.name}</option>)}</select></label>
    <label>Board name<input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} autoFocus /></label>
    <label>Description <span className="optional">Optional</span><textarea rows={3} maxLength={500} value={description} onChange={(event) => setDescription(event.target.value)} /></label>
    {error && <ErrorMessage message={error} />}
    <button className="button button-primary" disabled={saving || !workspaceId}>{saving ? 'Creating…' : 'Create board'}</button>
  </form>;
}
