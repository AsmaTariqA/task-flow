'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import { supabase } from '@/lib/supabase/client'
import { CreateTaskForm } from '@/components/tasks/create-task-form'
import { TaskCard } from '@/components/tasks/task-card'
import type { Task } from '@/types/database.types'

import Link from 'next/link'
import {
  ListTodo,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  FolderKanban
} from 'lucide-react'

export default function TasksPage() {
  const { user } = useAuth()
  const { projects, loading: projectsLoading, refetch: refetchProjects } = useProjects(user?.id)
  
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all')
  const [filterProject, setFilterProject] = useState<string>('all')

  // Fetch all tasks for the user
  const fetchTasks = async () => {
    if (!user?.id) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAllTasks(data || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user?.id])

  // Real-time subscription for tasks
  useEffect(() => {
    if (!user?.id) return

    const subscription = supabase
      .channel('all-tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `created_by=eq.${user.id}`
        },
        () => {
          fetchTasks()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id])

  const handleCreateTask = async (task: any) => {
    await fetchTasks()
    setShowCreateForm(false)
    setSelectedProjectId('')
  }

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', taskId)

        if (error) throw error
        await fetchTasks()
      } catch (error) {
        console.error('Error deleting task:', error)
        alert('Failed to delete task')
      }
    }
  }

  const handleEditTask = async (task: Task) => {
    // Implement edit functionality if needed
    console.log('Edit task:', task)
  }

  // Filter tasks
  const filteredTasks = allTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesProject = filterProject === 'all' || task.project_id === filterProject
    return matchesSearch && matchesStatus && matchesProject
  })

  // Calculate stats
  const todoTasks = allTasks.filter(t => t.status === 'todo')
  const inProgressTasks = allTasks.filter(t => t.status === 'in_progress')
  const completedTasks = allTasks.filter(t => t.status === 'completed')

  // Get tasks due today
  const today = new Date().toISOString().split('T')[0]
  const tasksDueToday = allTasks.filter(t => 
    t.due_date && t.due_date.split('T')[0] === today && t.status !== 'completed'
  ).length

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] flex items-center justify-center p-6">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl border-2 border-white/50 shadow-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-[#F7EFE5] to-[#C3ACD0]/20 flex items-center justify-center">
            <ListTodo className="w-10 h-10 text-[#C3ACD0]" />
          </div>
          <h2 className="text-2xl font-bold text-[#674188] mb-2">Please Log In</h2>
          <p className="text-[#674188]/70 mb-6">You need to be logged in to view your tasks</p>
          <Link
            href="/auth/login"
            className="inline-block px-8 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
          >
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading || projectsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#F7EFE5] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#674188] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#674188]/70 text-lg">Loading your tasks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-fade-in">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
                <ListTodo className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-[#674188] to-[#C3ACD0] bg-clip-text text-transparent">
                All Tasks
              </h1>
             
            </div>
            <p className="text-[#674188]/70 text-lg ml-15">
              View and manage all your tasks across projects
            </p>
          </div>
          <button
            onClick={() => {
              if (projects.length === 0) {
                alert('Please create a project first before creating tasks')
                return
              }
              setShowCreateForm(true)
            }}
            className="group px-6 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Task
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <ListTodo className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-2xl font-bold text-[#674188]">{todoTasks.length}</span>
            </div>
            <p className="text-sm text-[#674188]/60 font-medium">To Do</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-[#674188]">{inProgressTasks.length}</span>
            </div>
            <p className="text-sm text-[#674188]/60 font-medium">In Progress</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-[#674188]">{completedTasks.length}</span>
            </div>
            <p className="text-sm text-[#674188]/60 font-medium">Completed</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border-2 border-white/50 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-2xl font-bold text-[#674188]">{tasksDueToday}</span>
            </div>
            <p className="text-sm text-[#674188]/60 font-medium">Due Today</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C3ACD0]" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-white/80 backdrop-blur-sm text-[#674188] placeholder:text-[#C3ACD0]/50 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all"
            />
          </div>

          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-white/80 backdrop-blur-sm text-[#674188] focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'todo', 'in_progress', 'completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as typeof filterStatus)}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${
                  filterStatus === status
                    ? 'bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white shadow-lg scale-105'
                    : 'bg-white/80 text-[#674188] border-2 border-[#F7EFE5] hover:border-[#C3ACD0]'
                }`}
              >
                {status === 'all' ? 'All' :
                 status === 'todo' ? 'To Do' :
                 status === 'in_progress' ? 'In Progress' :
                 'Completed'}
              </button>
            ))}
          </div>
        </div>

        {/* Create Task Form Modal */}
        {showCreateForm && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#C3ACD0] shadow-xl">
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2 text-[#674188]">
                  Select Project *
                </label>
                <div className="relative">
                  <FolderKanban className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C3ACD0]" />
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all"
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedProjectId ? (
                <CreateTaskForm
                  projectId={selectedProjectId}
                  createdBy={user.id}
                  onSubmit={handleCreateTask}
                  onCancel={() => {
                    setShowCreateForm(false)
                    setSelectedProjectId('')
                  }}
                />
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-[#C3ACD0]/50 rounded-xl bg-[#FFFBF5]">
                  <FolderKanban className="w-12 h-12 text-[#C3ACD0] mx-auto mb-3" />
                  <p className="text-[#674188]/70 font-medium">
                    Please select a project to continue
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white/50 shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-linear-to-br from-[#F7EFE5] to-[#C3ACD0]/20 flex items-center justify-center">
              <ListTodo className="w-12 h-12 text-[#C3ACD0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#674188] mb-2">
              {searchQuery || filterStatus !== 'all' || filterProject !== 'all' 
                ? 'No tasks found' 
                : 'No tasks yet'}
            </h3>
            <p className="text-[#674188]/70 mb-6">
              {searchQuery || filterStatus !== 'all' || filterProject !== 'all'
                ? 'Try adjusting your search or filters' 
                : projects.length === 0
                  ? 'Create a project first, then add tasks to it'
                  : 'Create your first task to get started!'}
            </p>
            {projects.length === 0 ? (
              <Link
                href="/dashboard/projects"
                className="inline-block px-8 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Create Project
              </Link>
            ) : (
              !searchQuery && filterStatus === 'all' && filterProject === 'all' && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="px-8 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
                >
                  Create Task
                </button>
              )
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task, idx) => (
              <div
                key={task.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <TaskCard
                  task={task}
                 
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}