'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Task, TaskUpdate } from '@/types/database.types'

export type TaskInsertHook = {
  title: string
  description?: string | null
  status?: 'todo' | 'in_progress' | 'completed'
  priority?: 'low' | 'medium' | 'high'
  due_date?: string | null
  project_id: string
  created_by: string
}

export function useTasks(userId?: string, projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false })

      if (projectId) {
        query = query.eq('project_id', projectId)
      }

      const { data, error } = await query
      if (error) throw error

      setTasks(data ?? [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [userId, projectId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // 🔧 FIX: DO NOT INSERT AGAIN — TASK IS ALREADY CREATED
  const createTask = async (task: Task) => {
    setLoading(true)
    try {
      setTasks(prev => [task, ...prev])
      return task
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (taskId: string, updatedTask: TaskUpdate) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updatedTask)
      .eq('id', taskId)
      .select()
      .single()

    if (!error && data) {
      setTasks(prev => prev.map(t => (t.id === taskId ? data : t)))
    }
  }

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId)
    if (!error) {
      setTasks(prev => prev.filter(t => t.id !== taskId))
    }
  }

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  }
}
