'use client'

import { useState } from 'react'
import { TaskCard } from './task-card'
import { CreateTaskForm } from './create-task-form'
import { useTasks } from '@/hooks/use-tasks'
import { Button } from '@/components/ui/button'

interface TaskListProps {
  userId: string
  projectId: string
}

export function TaskList({ userId, projectId }: TaskListProps) {
  const { tasks, createTask, deleteTask, loading, error } = useTasks(userId)
  const [showForm, setShowForm] = useState(false)

  const handleDelete = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId)
    }
  }

  const handleUpdate = async (taskId: string) => {
    // You can implement modal or redirect to edit page here
  }

  return (
    <div>
      {/* New Task Button */}
      <div className="mb-4 flex justify-end">
        <Button
          className="bg-linear-to-r from-[#674188] to-[#C3ACD0] hover:shadow-lg"
          onClick={() => setShowForm(true)}
        >
          + New Task
        </Button>
      </div>

      {/* Task Form */}
      {showForm && (
        <CreateTaskForm
          projectId={projectId}
          createdBy={userId}
          onSubmit={async (task) => {
            await createTask(task)
            setShowForm(false)
          }}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Loading & Error */}
      {loading && <p className="text-[#674188]/70">Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* No Tasks Placeholder */}
      {tasks.length === 0 && !loading ? (
        <div className="text-center py-16 border-2 border-dashed border-[#F7EFE5] rounded-xl">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-[#674188] mb-2">No tasks yet</h3>
          <p className="text-[#674188]/70 mb-6">Create your first task to get started!</p>
          <Button
            className="bg-linear-to-r from-[#674188] to-[#C3ACD0] hover:shadow-lg"
            onClick={() => setShowForm(true)}
          >
            Create Task
          </Button>
        </div>
      ) : (
        /* Task Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task}  />
          ))}
        </div>
      )}
    </div>
  )
}
