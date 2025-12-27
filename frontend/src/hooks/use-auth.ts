'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { UserProfile } from '@/types/database.types'

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // ---------------------------------------------------------
  // Check session on mount
  // ---------------------------------------------------------
  useEffect(() => {
    checkUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const formattedUser = {
            id: session.user.id,
            email: session.user.email || '',
            full_name: session.user.user_metadata.full_name || '',
            created_at: session.user.created_at
          }
          setUser(formattedUser)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => authListener.subscription.unsubscribe()
  }, [])

  // ---------------------------------------------------------
  // Fetch user on mount
  // ---------------------------------------------------------
  async function checkUser() {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata.full_name || '',
          created_at: session.user.created_at,
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ---------------------------------------------------------
  // SIGNUP
  // ---------------------------------------------------------
// ---------------------------------------------------------
// SIGNUP
// ---------------------------------------------------------
async function signup(name: string, email: string, password: string) {
  setError(null)
  setLoading(true)

  try {
    const { data, error: err } = await supabase.auth.signUp({
      email,       // email must come from the email parameter
      password,    // password as is
      options: { 
        data: { full_name: name } // store full name in user metadata
      }
    })

    if (err) throw err

    router.push('/dashboard/dashboard') // After creating account → go to login
    return data
  } catch (err: any) {
    setError(err.message)
    return null
  } finally {
    setLoading(false)
  }
}



  // ---------------------------------------------------------
  // LOGIN
  // ---------------------------------------------------------
  async function login(email: string, password: string) {
    setError(null)
    setLoading(true)

    const { data, error: err } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    setLoading(false)

    if (err) {
      setError(err.message)
      return null
    }

    router.push('/dashboard/dashboard') // Redirect after login
    return data
  }

  // ---------------------------------------------------------
  // SIGN OUT
  // ---------------------------------------------------------
  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    loading,
    error,
    signup,
    login,
    signOut
  }
}
