'use client';

import { Task, TaskStatus } from '@/lib/api';
import { TaskCard } from './task-card';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export function TaskColumn({ title, status, tasks, onEdit, onDelete, onStatusChange }: TaskColumnProps) {
  const items = tasks.filter((t) => t.status === status);

  return (
    <div
      className="flex min-h-[300px] flex-1 flex-col rounded-xl border p-3"
      style={{ backgroundColor: 'rgb(var(--surface-2))', borderColor: 'rgb(var(--border))' }}
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span
          className="rounded-full px-2 py-0.5 text-xs"
          style={{ backgroundColor: 'rgb(var(--surface))', color: 'rgb(var(--text-muted))' }}
        >
          {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {items.length === 0 && (
          <p className="px-1 text-xs" style={{ color: 'rgb(var(--text-muted))' }}>
            No tasks here yet.
          </p>
        )}
        {items.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
