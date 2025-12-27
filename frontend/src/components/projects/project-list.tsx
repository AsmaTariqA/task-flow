'use client'

import { useEffect } from 'react'
import { useProjects } from '@/hooks/use-projects'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase/client'
import { ProjectCard } from './project-card'
import { CreateProjectForm } from './create-project-form'
import { FolderKanban, Sparkles } from 'lucide-react'

export function ProjectList() {
  const { user } = useAuth()
  const { projects, loading, error, refetch, createProject } = useProjects(user?.id)

  // Real-time subscription
  useEffect(() => {
    if (!user?.id) return

    const subscription = supabase
      .channel('projects-list-realtime')
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

  const handleCreateProject = async (data: { title: string; description?: string }) => {
    await createProject(data)
    refetch()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-[#F7EFE5] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#674188] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-[#674188]/70 text-lg">Loading projects...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-700 font-semibold">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
          <FolderKanban className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-linear-to-r from-[#674188] to-[#C3ACD0] bg-clip-text text-transparent">
            My Projects
          </h2>
          <p className="text-[#674188]/70">Manage and track your projects</p>
        </div>
        <Sparkles className="w-6 h-6 text-[#C3ACD0] ml-auto animate-pulse" />
      </div>

      {/* Create Project Form */}
      <CreateProjectForm onSubmit={handleCreateProject} />

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-white/50">
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-linear-to-br from-[#F7EFE5] to-[#C3ACD0]/20 flex items-center justify-center">
            <FolderKanban className="w-12 h-12 text-[#C3ACD0]" />
          </div>
          <h3 className="text-2xl font-bold text-[#674188] mb-2">No projects yet</h3>
          <p className="text-[#674188]/70">
            Create your first project using the form above
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#674188]">
              All Projects ({projects.length})
            </h3>
            <span className="px-3 py-1 bg-[#F7EFE5] text-[#674188] rounded-lg text-sm font-semibold">
              Live Updates
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, idx) => (
              <div
                key={project.id}
                className="animate-fade-in"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        </>
      )}

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
