// src/components/projects/create-project-form.tsx
'use client'

import { useState } from 'react'

interface CreateProjectFormProps {
  onSubmit: (data: { title: string; description?: string }) => Promise<void>
  onCancel?: () => void
}

export function CreateProjectForm({ onSubmit, onCancel }: CreateProjectFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setLoading(true)
    try {
      await onSubmit({ title, description: description || undefined })
      setTitle('')
      setDescription('')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Project title"
        className="w-full rounded border px-3 py-2"
        required
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Project description (optional)"
        className="w-full rounded border px-3 py-2"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border px-4 py-2">
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  )
}
