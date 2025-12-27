'use client'

import { useState } from 'react'
import type { TaskInsertHook } from '@/hooks/use-tasks'
import { supabase } from '@/lib/supabase/client'
import { useTaskFiles } from '@/hooks/use-task-files'
import { 
  Calendar, 
  FileText, 
  AlertCircle, 
  Upload, 
  X,
  Paperclip,
  Sparkles
} from 'lucide-react'

interface CreateTaskFormProps {
  projectId: string
  createdBy: string
  onSubmit: (task: any) => Promise<void> | void
  onCancel: () => void
  initialData?: any
}

export function CreateTaskForm({
  onSubmit,
  onCancel,
  initialData,
  createdBy,
  projectId
}: CreateTaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(
    initialData?.priority ?? 'medium'
  )
  const [dueDate, setDueDate] = useState(initialData?.due_date ?? '')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const { uploadFile } = useTaskFiles()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || submitting) return

    setSubmitting(true)

    try {
      const { data: task, error } = await supabase
        .from('tasks')
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          priority,
          due_date: dueDate || null,
          status: initialData?.status ?? 'todo',
          created_by: createdBy,
          project_id: projectId
        })
        .select()
        .single()

      if (error || !task) {
        console.error('Task creation error:', error)
        throw error
      }

      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          await uploadFile(task.id, createdBy, file)
        }
      }

      await onSubmit(task)

      if (!initialData) {
        setTitle('')
        setDescription('')
        setPriority('medium')
        setDueDate('')
        setSelectedFiles([])
      }

      onCancel()
    } catch (err) {
      console.error('CreateTaskForm error:', err)
      alert('Failed to create task. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-white/50 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[#F7EFE5]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#674188] to-[#C3ACD0] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-bold text-[#674188]">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h3>
      </div>

      {/* Title */}
      <div className="group">
        <label className="block text-sm font-semibold mb-2 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
          Task Title *
        </label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all"
        />
      </div>

      {/* Description */}
      <div className="group">
        <label className="block text-sm font-semibold mb-2 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
          Description
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-4 w-5 h-5 text-[#C3ACD0] transition-colors group-focus-within:text-[#674188]" />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe the task..."
            rows={4}
            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all resize-none"
          />
        </div>
      </div>

      {/* Priority & Due Date Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority */}
        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
            Priority
          </label>
          <div className="relative">
            <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C3ACD0]" />
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all appearance-none cursor-pointer"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="group">
          <label className="block text-sm font-semibold mb-2 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
            Due Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C3ACD0]" />
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg transition-all"
            />
          </div>
        </div>
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-semibold mb-2 text-[#674188]">
          Attachments
        </label>
        <div className="relative">
          <input
            type="file"
            multiple
            onChange={e => setSelectedFiles(Array.from(e.target.files || []))}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center gap-3 w-full px-4 py-4 rounded-xl border-2 border-dashed border-[#C3ACD0]/50 bg-[#FFFBF5] hover:border-[#C3ACD0] hover:bg-[#F7EFE5] transition-all cursor-pointer group"
          >
            <Upload className="w-5 h-5 text-[#C3ACD0] group-hover:scale-110 transition-transform" />
            <span className="text-[#674188] font-medium">
              Click to upload files
            </span>
          </label>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-3 space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-2 rounded-lg bg-[#F7EFE5] border border-[#C3ACD0]/30 group hover:border-[#C3ACD0] transition-all"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Paperclip className="w-4 h-4 text-[#C3ACD0] shrink-0" />
                  <span className="text-sm text-[#674188] truncate">
                    {file.name}
                  </span>
                  <span className="text-xs text-[#674188]/60 shrink-0">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="p-1 rounded-lg hover:bg-red-100 text-red-600 transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-[#F7EFE5]">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-white border-2 border-[#F7EFE5] text-[#674188] rounded-xl font-semibold hover:border-[#C3ACD0] transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-[#674188] to-[#C3ACD0] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {initialData ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            initialData ? 'Update Task' : 'Create Task'
          )}
        </button>
      </div>
    </form>
  )
}