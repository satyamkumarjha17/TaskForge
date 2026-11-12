import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/http-error.js';

export const listWorkspaces = (ownerId: string) => prisma.workspace.findMany({ where: { ownerId }, include: { _count: { select: { boards: true } } }, orderBy: { updatedAt: 'desc' } });
export const createWorkspace = (ownerId: string, data: { name: string; description?: string | null }) => prisma.workspace.create({ data: { ...data, ownerId }, include: { _count: { select: { boards: true } } } });
export async function getWorkspace(ownerId: string, id: string) {
  const workspace = await prisma.workspace.findFirst({ where: { id, ownerId }, include: { boards: { orderBy: { updatedAt: 'desc' }, include: { _count: { select: { tasks: true } } } }, _count: { select: { boards: true } } } });
  if (!workspace) throw new HttpError(404, 'NOT_FOUND', 'Workspace not found.');
  return workspace;
}
export async function updateWorkspace(ownerId: string, id: string, data: { name?: string; description?: string | null }) {
  const result = await prisma.workspace.updateMany({ where: { id, ownerId }, data });
  if (!result.count) throw new HttpError(404, 'NOT_FOUND', 'Workspace not found.');
  return getWorkspace(ownerId, id);
}
export async function deleteWorkspace(ownerId: string, id: string) {
  const result = await prisma.workspace.deleteMany({ where: { id, ownerId } });
  if (!result.count) throw new HttpError(404, 'NOT_FOUND', 'Workspace not found.');
}
