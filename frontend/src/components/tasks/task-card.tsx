'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Task } from '@/types/database.types'
import Link from 'next/link'
import { CreateTaskForm } from './create-task-form'
import { FolderKanban, Sparkles, X, CheckCircle2, Calendar } from 'lucide-react'

type TaskCardProps = {
  task: Task


}

export function TaskCard({ task }: TaskCardProps) {
  const [showEdit, setShowEdit] = useState(false)

  return (
    <>
      {/* Task Card */}
      <div className="group p-4 rounded-xl border-2 border-[#F7EFE5] hover:border-[#C3ACD0]/50 bg-linear-to-br from-white to-[#FFFBF5] hover:shadow-md transition-all duration-300">
        <Link href={`/dashboard/task/${task.id}`} className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-[#674188]">{task.title}</h3>
          {task.description && <p className="text-[#674188]/70">{task.description}</p>}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-lg text-xs font-semibold border border-[#F7EFE5] text-[#674188]/70">
              {task.priority?.toUpperCase() || 'MEDIUM'}
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold border border-[#F7EFE5] text-[#674188]/70">
              {task.status?.toUpperCase() || 'TODO'}
            </span>
            {task.due_date && (
              <span className="text-xs text-[#674188]/70 px-2 py-1 rounded-lg border border-[#F7EFE5] flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {new Date(task.due_date).toLocaleDateString()}
              </span>
            )}
          </div>
        </Link>

        {/* Action Buttons */}
        
      </div>

      
  
    </>
  )
}
