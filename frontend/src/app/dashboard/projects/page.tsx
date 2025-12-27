'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { useProjects } from '@/hooks/use-projects'
import { supabase } from '@/lib/supabase/client'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  FolderKanban, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Search,
  Filter,
  Archive,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react'

export default function ProjectsPage() {
  const { user } = useAuth()
  const { projects, loading, createProject, updateProject, deleteProject, refetch } = useProjects(user?.id)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState<null | typeof projects[0]>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'archived'>('all')

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return

    const subscription = supabase
      .channel('projects-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'projects',
          filter: `created_by=eq.${user.id}`
        },
        () => {
          refetch()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user?.id, refetch])

  const openCreateModal = () => {
    setCurrentProject(null)
    setTitle('')
    setDescription('')
    setIsModalOpen(true)
  }

  const openEditModal = (project: typeof projects[0]) => {
    setCurrentProject(project)
    setTitle(project.title)
    setDescription(project.description || '')
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoadingSubmit(true)

    try {
      if (currentProject) {
        await updateProject(currentProject.id, { title, description })
      } else {
        await createProject({ title, description })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoadingSubmit(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      await deleteProject(id)
    }
  }

  // Filter and search projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Stats
  const activeCount = projects.filter(p => p.status === 'active').length
  const completedCount = projects.filter(p => p.status === 'completed').length
  const archivedCount = projects.filter(p => p.status === 'archived').length

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-[#F7EFE5] rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#674188] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-[#674188]/70 text-lg">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-[#FFFBF5] to-[#F7EFE5] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-[#674188] to-[#C3ACD0] bg-clip-text text-transparent">
                Projects
              </h1>
            </div>
            <p className="text-[#674188]/70 text-lg ml-15">
              Manage and organize all your projects
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="group px-6 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Project
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-white/50 shadow-sm animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#674188]/60 font-medium">Active</p>
                <p className="text-2xl font-bold text-[#674188]">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-white/50 shadow-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#674188]/60 font-medium">Completed</p>
                <p className="text-2xl font-bold text-[#674188]">{completedCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border-2 border-white/50 shadow-sm animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-linear-to-br from-gray-500 to-gray-600 flex items-center justify-center">
                <Archive className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#674188]/60 font-medium">Archived</p>
                <p className="text-2xl font-bold text-[#674188]">{archivedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C3ACD0]" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-white/80 backdrop-blur-sm text-[#674188] placeholder:text-[#C3ACD0]/50 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'completed', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as typeof filterStatus)}
                className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                  filterStatus === status
                    ? 'bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white shadow-lg scale-105'
                    : 'bg-white/80 text-[#674188] border-2 border-[#F7EFE5] hover:border-[#C3ACD0]'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white/50 shadow-sm">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-linear-to-br from-[#F7EFE5] to-[#C3ACD0]/20 flex items-center justify-center">
              <FolderKanban className="w-12 h-12 text-[#C3ACD0]" />
            </div>
            <h3 className="text-2xl font-bold text-[#674188] mb-2">
              {searchQuery || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-[#674188]/70 mb-6">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Create your first project to get started!'}
            </p>
            {!searchQuery && filterStatus === 'all' && (
              <button
                onClick={openCreateModal}
                className="px-8 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all"
              >
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, idx) => (
              <div
                key={project.id}
                className="group bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/50 hover:border-[#C3ACD0] hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#674188] group-hover:text-[#C3ACD0] transition-colors mb-2 line-clamp-2">
                      {project.title}
                    </h3>
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                        project.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {project.status === 'active' ? '🟢 Active' : 
                       project.status === 'completed' ? '✅ Completed' : 
                       '📦 Archived'}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#674188]/70 text-sm mb-6 line-clamp-3 min-h-14">
                  {project.description || 'No description provided'}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/dashboard/projects/${project.id}`} className="flex-1">
                    <button className="group/btn w-full px-4 py-2.5 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </button>
                  </Link>
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-2.5 bg-[#F7EFE5] text-[#674188] rounded-xl hover:bg-[#C3ACD0] hover:text-white transition-all"
                    title="Edit project"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    title="Delete project"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Metadata */}
                <div className="mt-4 pt-4 border-t border-[#F7EFE5] flex items-center justify-between text-xs text-[#674188]/60">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                  <span className="px-2 py-1 bg-[#F7EFE5] rounded-lg font-medium">
                    ID: {project.id.slice(0, 8)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Create / Edit */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
                {currentProject ? <Edit3 className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
              </div>
              <span>{currentProject ? 'Edit Project' : 'Create New Project'}</span>
            </div>
          }
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-[#674188]">
                Project Title *
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
                required
                className="w-full px-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-[#674188]">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your project (optional)"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 bg-white border-2 border-[#F7EFE5] text-[#674188] rounded-xl font-semibold hover:border-[#C3ACD0] transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingSubmit}
                className="flex-1 px-6 py-3 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
              >
                {loadingSubmit ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {currentProject ? 'Saving...' : 'Creating...'}
                  </span>
                ) : (
                  currentProject ? 'Save Changes' : 'Create Project'
                )}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
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
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}