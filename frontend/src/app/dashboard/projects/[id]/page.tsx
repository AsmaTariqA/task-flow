'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import { useTasks } from '@/hooks/use-tasks'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { CreateTaskForm } from '@/components/tasks/create-task-form'
import { Calendar } from 'lucide-react'

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = typeof params.id === 'string' ? params.id : params.id?.[0]
  const router = useRouter()

  const { user } = useAuth()
  const { projects, loading: projectLoading } = useProjects(user?.id)
  const { tasks, loading: tasksLoading, createTask } = useTasks(user?.id, projectId)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const capitalize = (str?: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : ''

  if (!projectId) {
    return <p className="text-center py-12 text-red-600">Invalid project ID</p>
  }

  if (!user) {
    return <p className="text-center py-12 text-gray-600">Please log in</p>
  }

  const project = projects.find(p => p.id === projectId)

  if (projectLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5]">
        <p className="text-[#674188]/70 text-lg">Loading project...</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5]">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#674188] mb-4">
            Project not found
          </h2>
          <Button onClick={() => router.push('/dashboard/projects')}>
            Back to Projects
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] p-6">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <button
            onClick={() => router.push('/dashboard/projects')}
            className="text-[#674188]/70 hover:text-[#C3ACD0] mb-4 flex items-center gap-2"
          >
            ← Back to Projects
          </button>

          <div className="bg-white/80 rounded-2xl shadow-sm p-6 flex justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#674188] mb-2">
                {project.title}
              </h1>
              <p className="text-[#674188]/70">
                {project.description || 'No description'}
              </p>
            </div>

            <span className="px-4 py-2 rounded-full text-sm font-semibold border border-[#F7EFE5] text-[#674188]">
              {capitalize(project.status)}
            </span>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white/80 rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#674188]">
              Tasks ({tasks.length})
            </h2>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-linear-to-r from-[#674188] to-[#C3ACD0]"
            >
              New Task
            </Button>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-[#F7EFE5] rounded-xl">
              <h3 className="text-xl font-semibold text-[#674188] mb-2">
                No tasks yet
              </h3>
              <p className="text-[#674188]/70">
                Create your first task to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map(task => (
                <button
                  key={task.id}
                  onClick={() => router.push(`/dashboard/task/${task.id}`)}
                  className="text-left p-5 rounded-xl border-2 border-[#F7EFE5] bg-white hover:border-[#C3ACD0] hover:shadow-md transition-all"
                >
                  <h3 className="text-lg font-semibold text-[#674188] mb-2">
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="text-[#674188]/70 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#674188]/70">
                    <span className="px-3 py-1 rounded-lg border border-[#F7EFE5]">
                      {task.priority.toUpperCase()}
                    </span>

                    <span className="px-3 py-1 rounded-lg border border-[#F7EFE5]">
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>

                    {task.due_date && (
                      <span className="px-3 py-1 rounded-lg border border-[#F7EFE5] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Task"
      >
        <CreateTaskForm
          createdBy={user.id}
          projectId={projectId}
          onSubmit={async task => {
            await createTask(task)
            setIsModalOpen(false)
          }}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}
