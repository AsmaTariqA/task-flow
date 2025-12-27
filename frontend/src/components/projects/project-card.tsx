'use client'

import Link from 'next/link'
import type { Project } from '@/types/database.types'
import { ExternalLink, Calendar, FolderKanban } from 'lucide-react'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link 
      href={`/dashboard/projects/${project.id}`}
      className="group block bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/50 hover:border-[#C3ACD0] hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
    >
      {/* Icon & Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center group-hover:scale-110 transition-transform">
          <FolderKanban className="w-6 h-6 text-white" />
        </div>
        <span
          className={`px-3 py-1 rounded-lg text-xs font-semibold ${
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

      {/* Title */}
      <h3 className="text-xl font-bold text-[#674188] group-hover:text-[#C3ACD0] transition-colors mb-3 line-clamp-2">
        {project.title}
      </h3>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-[#674188]/70 mb-4 line-clamp-2 min-h-10">
          {project.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F7EFE5]">
        <span className="flex items-center gap-2 text-xs text-[#674188]/60 font-medium">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(project.created_at).toLocaleDateString()}
        </span>
        <ExternalLink className="w-4 h-4 text-[#C3ACD0] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
      </div>
    </Link>
  )
}