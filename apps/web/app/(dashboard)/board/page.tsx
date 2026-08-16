'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/use-tasks';
import { Task, TaskStatus } from '@/lib/api';
import { TaskColumn } from '@/components/tasks/task-column';
import { TaskFormModal } from '@/components/tasks/task-form-modal';
import { Button } from '@/components/ui/button';

const columns: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: 'TODO' },
  { title: 'In Progress', status: 'IN_PROGRESS' },
  { title: 'Done', status: 'DONE' },
];

export default function BoardPage() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (data: Partial<Task>) => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    } else {
      await createTask(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task? This cannot be undone.')) {
      await deleteTask(id);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Board</h2>
        <Button onClick={openCreateModal}>+ New Task</Button>
      </div>

      {loading && (
        <p className="text-sm" style={{ color: 'rgb(var(--text-muted))' }}>
          Loading tasks…
        </p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col gap-4 sm:flex-row">
          {columns.map((col) => (
            <TaskColumn
              key={col.status}
              title={col.title}
              status={col.status}
              tasks={tasks}
              onEdit={openEditModal}
              onDelete={handleDelete}
              onStatusChange={(id, status) => updateTask(id, { status })}
            />
          ))}
        </div>
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialTask={editingTask}
      />
    </div>
  );
}
