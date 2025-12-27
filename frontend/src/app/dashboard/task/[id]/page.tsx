'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { CreateTaskForm } from '@/components/tasks/create-task-form'
import { 
  X, 
  Calendar, 
  Clock,
  Edit3,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  FolderKanban,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id
  const { user, loading: userLoading } = useAuth()
  const [task, setTask] = useState<any>(null)
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (userLoading || !user?.id || !taskId) return

    const fetchTaskAndProject = async () => {
      setLoading(true)
      try {
        // Fetch task
        const { data: taskData, error: taskError } = await supabase
          .from('tasks')
          .select('*')
          .eq('id', taskId)
          .single()

        if (taskError) throw taskError
        setTask(taskData)

        // Fetch associated project
        if (taskData?.project_id) {
          const { data: projectData } = await supabase
            .from('projects')
            .select('title, id')
            .eq('id', taskData.project_id)
            .single()
          
          setProject(projectData)
        }
      } catch (err) {
        console.error(err)
        setError('Task not found')
      } finally {
        setLoading(false)
      }
    }

    fetchTaskAndProject()
  }, [userLoading, user?.id, taskId])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showEditModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showEditModal])

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      
      router.push('/dashboard/tasks')
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Failed to delete task')
      setDeleting(false)
    }
  }

  const handleUpdate = async (updatedTask: any) => {
    setTask(updatedTask)
    setShowEditModal(false)
  }

  const priorityConfig = {
    high: { bg: 'bg-red-100', text: 'text-red-700', icon: '🔴', label: 'High Priority' },
    medium: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '🟡', label: 'Medium Priority' },
    low: { bg: 'bg-gray-100', text: 'text-gray-700', icon: '🟢', label: 'Low Priority' }
  }

  const statusConfig = {
    todo: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'To Do', icon: '📋' },
    in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'In Progress', icon: '⚡' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed', icon: '✅' }
  }

  if (loading || userLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#F7EFE5] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#674188] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#674188]/70 text-lg">Loading task details...</p>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] flex items-center justify-center p-6">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/50 shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#674188] mb-2">Task Not Found</h2>
          <p className="text-[#674188]/70 mb-6">{error || 'This task does not exist or you do not have access to it.'}</p>
          <Link
            href="/dashboard/tasks"
            className="inline-block px-8 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            Back to Tasks
          </Link>
        </div>
      </div>
    )
  }

  const priority = priorityConfig[(task.priority || 'low') as keyof typeof priorityConfig]
  const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.todo
  const isOverdue = task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center gap-2 text-[#674188] hover:text-[#C3ACD0] font-semibold mb-6 transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Tasks
        </Link>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-white/50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-linear-to-r from-[#674188] to-[#C3ACD0] p-8 text-white">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${status.bg} ${status.text}`}>
                    {status.icon} {status.label}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${priority.bg} ${priority.text}`}>
                    {priority.icon} {priority.label}
                  </span>
                  {isOverdue && (
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-600 text-white">
                      ⚠️ Overdue
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">{task.title}</h1>
                {project && (
                  <Link 
                    href={`/dashboard/projects/${project.id}`}
                    className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
                  >
                    <FolderKanban className="w-4 h-4" />
                    {project.title}
                  </Link>
                )}
              </div>
              <div className="relative">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                  task.status === 'completed' ? 'bg-green-500' :
                  task.status === 'in_progress' ? 'bg-blue-500' :
                  'bg-white/20'
                }`}>
                  {status.icon}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Description Section */}
            {task.description && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#674188]" />
                  <h2 className="text-xl font-bold text-[#674188]">Description</h2>
                </div>
                <p className="text-[#674188]/80 leading-relaxed whitespace-pre-wrap bg-[#F7EFE5]/50 p-4 rounded-xl">
                  {task.description}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Due Date */}
              {task.due_date && (
                <div className="bg-[#F7EFE5]/50 p-5 rounded-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#674188]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#674188]/60 font-medium">Due Date</p>
                      <p className="text-lg font-bold text-[#674188]">
                        {new Date(task.due_date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  {isOverdue && (
                    <p className="text-sm text-red-600 font-semibold">This task is overdue!</p>
                  )}
                </div>
              )}

              {/* Created */}
              <div className="bg-[#F7EFE5]/50 p-5 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[#674188]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#674188]/60 font-medium">Created</p>
                    <p className="text-lg font-bold text-[#674188]">
                      {new Date(task.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-2 text-sm text-[#674188]/60 mb-8 pb-8 border-b border-[#F7EFE5]">
              
              Last updated: {new Date(task.updated_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                <Edit3 className="w-5 h-5" />
                Edit Task
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-6 py-3 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-600 hover:text-white hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEditModal(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#F7EFE5] p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
                  <Edit3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#674188]">Edit Task</h2>
                  <p className="text-sm text-[#674188]/70">Update task details</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-[#674188]" />
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <CreateTaskForm
                projectId={task.project_id}
                createdBy={task.created_by}
                initialData={task}
                onCancel={() => setShowEditModal(false)}
                onSubmit={handleUpdate}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}