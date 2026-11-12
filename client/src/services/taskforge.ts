import type { AxiosResponse } from 'axios';
import { api } from './api';
import type { Board, Task, User, Workspace, Priority, TaskStatus } from '../types';

type Envelope<T> = { data: T };
type WorkspaceInput = { name: string; description: string };
type BoardInput = WorkspaceInput;
type TaskInput = { title: string; description: string | null; priority: Priority; status: TaskStatus; dueDate: string | null };
const unwrap = async <T>(request: Promise<AxiosResponse<Envelope<T>>>) => (await request).data.data;

export const authApi = {
  me: async () => (await unwrap(api.get<Envelope<{ user: User }>>('/auth/me'))).user,
  login: async (email: string, password: string) => (await unwrap(api.post<Envelope<{ user: User }>>('/auth/login', { email, password }))).user,
  register: async (name: string, email: string, password: string) => (await unwrap(api.post<Envelope<{ user: User }>>('/auth/register', { name, email, password }))).user,
  logout: () => unwrap(api.post<Envelope<{ loggedOut: boolean }>>('/auth/logout')),
};

export const taskforgeApi = {
  listWorkspaces: () => unwrap(api.get<Envelope<Workspace[]>>('/workspaces')),
  createWorkspace: (input: WorkspaceInput) => unwrap(api.post<Envelope<Workspace>>('/workspaces', input)),
  getWorkspace: (id: string) => unwrap(api.get<Envelope<Workspace>>(`/workspaces/${id}`)),
  updateWorkspace: (id: string, input: Partial<WorkspaceInput>) => unwrap(api.patch<Envelope<Workspace>>(`/workspaces/${id}`, input)),
  deleteWorkspace: (id: string) => api.delete(`/workspaces/${id}`).then(() => undefined),
  createBoard: (workspaceId: string, input: BoardInput) => unwrap(api.post<Envelope<Board>>(`/workspaces/${workspaceId}/boards`, input)),
  recentBoards: () => unwrap(api.get<Envelope<Board[]>>('/boards/recent')),
  getBoard: (id: string) => unwrap(api.get<Envelope<Board>>(`/boards/${id}`)),
  updateBoard: (id: string, input: Partial<BoardInput>) => unwrap(api.patch<Envelope<Board>>(`/boards/${id}`, input)),
  deleteBoard: (id: string) => api.delete(`/boards/${id}`).then(() => undefined),
  createTask: (boardId: string, input: TaskInput) => unwrap(api.post<Envelope<Task>>(`/boards/${boardId}/tasks`, input)),
  updateTask: (id: string, input: Partial<TaskInput>) => unwrap(api.patch<Envelope<Task>>(`/tasks/${id}`, input)),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`).then(() => undefined),
};
