import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecordForm, TaskForm } from './Forms';

describe('forms', () => {
  it('requires a workspace name before submission', async () => {
    const onSubmit = vi.fn();
    render(<RecordForm submitLabel="Create workspace" onSubmit={onSubmit} />);
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it('submits trimmed workspace fields', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<RecordForm submitLabel="Create workspace" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '  Semester project  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create workspace' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'Semester project', description: '' }));
  });
  it('submits the default task priority and status', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskForm onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Task title'), { target: { value: 'Prepare demo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create task' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ title: 'Prepare demo', description: '', priority: 'MEDIUM', status: 'TODO', dueDate: null }));
  });
});
