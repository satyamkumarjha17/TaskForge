import { beforeEach, describe, expect, it, vi } from 'vitest';


const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    board: { findFirst: vi.fn(), update: vi.fn() },
    task: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn() },
    $transaction: vi.fn(),
  },
}));
vi.mock('../src/config/prisma.js', () => ({ prisma: prismaMock }));
import { createTask, deleteTask, listTasks, updateTask } from '../src/services/task-service.js';

describe('task ownership', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('does not list tasks when the board is not owned by the user', async () => {
    prismaMock.board.findFirst.mockResolvedValue(null);
    await expect(listTasks('user-a', 'board-b')).rejects.toMatchObject({ status: 404, code: 'NOT_FOUND' });
    expect(prismaMock.task.findMany).not.toHaveBeenCalled();
  });

  it('does not create a task in another user’s board', async () => {
    prismaMock.board.findFirst.mockResolvedValue(null);
    await expect(createTask('user-a', 'board-b', { title: 'Private task' })).rejects.toMatchObject({ status: 404 });
    expect(prismaMock.task.create).not.toHaveBeenCalled();
  });

  it('does not update a task outside the ownership chain', async () => {
    prismaMock.task.findFirst.mockResolvedValue(null);
    await expect(updateTask('user-a', 'task-b', { title: 'Changed' })).rejects.toMatchObject({ status: 404 });
    expect(prismaMock.task.update).not.toHaveBeenCalled();
  });

  it('does not delete a task outside the ownership chain', async () => {
    prismaMock.task.findFirst.mockResolvedValue(null);
    await expect(deleteTask('user-a', 'task-b')).rejects.toMatchObject({ status: 404 });
    expect(prismaMock.task.delete).not.toHaveBeenCalled();
  });
});
