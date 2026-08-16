'use client';

import { Task, TaskStatus } from '@/lib/api';

const priorityColors: Record<Task['priority'], string> = {
  LOW: 'bg-emerald-500/15 text-emerald-500',
  MEDIUM: 'bg-amber-500/15 text-amber-500',
  HIGH: 'bg-red-500/15 text-red-500',
};

const statusOrder: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const currentIndex = statusOrder.indexOf(task.status);
  const canMoveForward = currentIndex < statusOrder.length - 1;
  const canMoveBack = currentIndex > 0;

  return (
    <div
      className="group rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md"
      style={{ backgroundColor: 'rgb(var(--surface))', borderColor: 'rgb(var(--border))' }}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{task.title}</h3>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="mb-3 line-clamp-2 text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <p className="mb-3 text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
          Due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <button
            disabled={!canMoveBack}
            onClick={() => onStatusChange(task.id, statusOrder[currentIndex - 1])}
            className="rounded-md px-1.5 py-0.5 text-xs hover:bg-[rgb(var(--surface-2))] disabled:opacity-30"
            aria-label="Move to previous status"
          >
            ←
          </button>
          <button
            disabled={!canMoveForward}
            onClick={() => onStatusChange(task.id, statusOrder[currentIndex + 1])}
            className="rounded-md px-1.5 py-0.5 text-xs hover:bg-[rgb(var(--surface-2))] disabled:opacity-30"
            aria-label="Move to next status"
          >
            →
          </button>
        </div>

        <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onEdit(task)}
            className="text-xs underline"
            style={{ color: 'rgb(var(--text-muted))' }}
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-xs text-red-500 underline"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
