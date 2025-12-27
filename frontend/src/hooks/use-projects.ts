'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { Project } from '@/types/database.types'

export function useProjects(userId: string | undefined) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }
    fetchProjects()
  }, [userId])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      setProjects(data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch projects')
    } finally {
      setLoading(false)
    }
  }

 const createProject = async (project: { title: string; description?: string }) => {
  if (!userId) return { data: null, error: 'Not authenticated' }

  try {
    const { data, error } = await supabase
      .from('projects')
      .insert({ ...project, owner_id: userId })
      .select()
      .single()
    if (error) throw error
    setProjects(prev => [data, ...prev])
    return { data, error: null }
  } catch (error) {
    console.error('Error creating project:', error)
    return { data: null, error: error instanceof Error ? error.message : 'Error creating project' }
  }
}
 const updateProject = async (id: string, project: { title: string; description?: string; status?: 'active' | 'completed' | 'archived' }) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      setError(error.message)
    } else {
      setProjects((prev) => prev.map((p) => (p.id === id ? data : p)))
    }
    setLoading(false)
  }
  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id)
      if (error) throw error
      setProjects(prev => prev.filter(p => p.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Error deleting project:', err)
      return { error: err instanceof Error ? err.message : 'Failed to delete project' }
    }
  }

  return { projects, loading, error, createProject, deleteProject, refetch: fetchProjects, updateProject }
}
