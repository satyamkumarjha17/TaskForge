import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/http-error.js';

type TaskInput = { title?: string; description?: string | null; priority?: 'LOW' | 'MEDIUM' | 'HIGH'; status?: 'TODO' | 'IN_PROGRESS' | 'DONE'; dueDate?: string | null };
const dateValue = (value: string | null | undefined) => value === undefined ? undefined : value === null ? null : new Date(`${value}T00:00:00.000Z`);
export async function listTasks(ownerId: string, boardId: string) {
  const board = await prisma.board.findFirst({ where: { id: boardId, workspace: { ownerId } }, select: { id: true } });
  if (!board) throw new HttpError(404, 'NOT_FOUND', 'Board not found.');
  return prisma.task.findMany({ where: { boardId }, orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }] });
}
export async function createTask(ownerId: string, boardId: string, data: TaskInput) {
  const board = await prisma.board.findFirst({ where: { id: boardId, workspace: { ownerId } }, select: { id: true } });
  if (!board) throw new HttpError(404, 'NOT_FOUND', 'Board not found.');
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.create({ data: { title: data.title!, description: data.description, priority: data.priority, status: data.status, dueDate: dateValue(data.dueDate), boardId } });
    await tx.board.update({ where: { id: boardId }, data: { updatedAt: new Date() } });
    return task;
  });
}
export async function getTask(ownerId: string, id: string) {
  const task = await prisma.task.findFirst({ where: { id, board: { workspace: { ownerId } } } });
  if (!task) throw new HttpError(404, 'NOT_FOUND', 'Task not found.');
  return task;
}
export async function updateTask(ownerId: string, id: string, data: TaskInput) {
  const existing = await prisma.task.findFirst({ where: { id, board: { workspace: { ownerId } } }, select: { id: true, boardId: true } });
  if (!existing) throw new HttpError(404, 'NOT_FOUND', 'Task not found.');
  const { dueDate, ...rest } = data;
  return prisma.$transaction(async (tx) => {
    const task = await tx.task.update({ where: { id }, data: { ...rest, ...(dueDate !== undefined ? { dueDate: dateValue(dueDate) } : {}) } });
    await tx.board.update({ where: { id: existing.boardId }, data: { updatedAt: new Date() } });
    return task;
  });
}
export async function deleteTask(ownerId: string, id: string) {
  const existing = await prisma.task.findFirst({ where: { id, board: { workspace: { ownerId } } }, select: { id: true, boardId: true } });
  if (!existing) throw new HttpError(404, 'NOT_FOUND', 'Task not found.');
  await prisma.$transaction(async (tx) => {
    await tx.task.delete({ where: { id } });
    await tx.board.update({ where: { id: existing.boardId }, data: { updatedAt: new Date() } });
  });
}
