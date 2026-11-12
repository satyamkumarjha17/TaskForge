export type User = { id: string; name: string; email: string; createdAt: string };
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type Task = { id: string; title: string; description: string | null; priority: Priority; status: TaskStatus; dueDate: string | null; boardId: string; createdAt: string; updatedAt: string };
export type Board = { id: string; name: string; description: string | null; workspaceId: string; createdAt: string; updatedAt: string; _count?: { tasks: number }; workspace?: { id: string; name: string }; tasks?: Task[] };
export type Workspace = { id: string; name: string; description: string | null; createdAt: string; updatedAt: string; _count?: { boards: number }; boards?: Board[] };
export type ApiError = { error: { code: string; message: string; details?: { field: string; message: string }[] } };
