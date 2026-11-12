import { prisma } from '../config/prisma.js';
import { HttpError } from '../utils/http-error.js';

export async function listBoards(ownerId: string, workspaceId: string) {
  const workspace = await prisma.workspace.findFirst({ where: { id: workspaceId, ownerId }, select: { id: true } });
  if (!workspace) throw new HttpError(404, 'NOT_FOUND', 'Workspace not found.');
  return prisma.board.findMany({ where: { workspaceId }, include: { _count: { select: { tasks: true } } }, orderBy: { updatedAt: 'desc' } });
}
export async function createBoard(ownerId: string, workspaceId: string, data: { name: string; description?: string | null }) {
  const workspace = await prisma.workspace.findFirst({ where: { id: workspaceId, ownerId }, select: { id: true } });
  if (!workspace) throw new HttpError(404, 'NOT_FOUND', 'Workspace not found.');
  return prisma.board.create({ data: { ...data, workspaceId }, include: { _count: { select: { tasks: true } } } });
}
export async function getBoard(ownerId: string, id: string) {
  const board = await prisma.board.findFirst({ where: { id, workspace: { ownerId } }, include: { workspace: { select: { id: true, name: true } }, _count: { select: { tasks: true } }, tasks: { orderBy: [{ updatedAt: 'desc' }] } } });
  if (!board) throw new HttpError(404, 'NOT_FOUND', 'Board not found.');
  return board;
}
export async function updateBoard(ownerId: string, id: string, data: { name?: string; description?: string | null }) {
  const result = await prisma.board.updateMany({ where: { id, workspace: { ownerId } }, data });
  if (!result.count) throw new HttpError(404, 'NOT_FOUND', 'Board not found.');
  return getBoard(ownerId, id);
}
export async function deleteBoard(ownerId: string, id: string) {
  const result = await prisma.board.deleteMany({ where: { id, workspace: { ownerId } } });
  if (!result.count) throw new HttpError(404, 'NOT_FOUND', 'Board not found.');
}
export const recentBoards = (ownerId: string) => prisma.board.findMany({ where: { workspace: { ownerId } }, include: { workspace: { select: { id: true, name: true } }, _count: { select: { tasks: true } } }, orderBy: { updatedAt: 'desc' }, take: 8 });
