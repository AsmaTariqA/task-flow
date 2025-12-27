'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react'

export default function SignupForm() {
  const { signup, loading, error } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formError, setFormError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!name || !email || !password || !confirmPassword) {
      setFormError('Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters')
      return
    }

    await signup(name, email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name Field */}
      <div className="group">
        <label className="block text-sm font-semibold mb-2.5 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C3ACD0] transition-colors group-focus-within:text-[#674188]">
            <User className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 transition-all duration-200 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg focus:shadow-[#C3ACD0]/20 hover:border-[#C3ACD0]/50"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="group">
        <label className="block text-sm font-semibold mb-2.5 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C3ACD0] transition-colors group-focus-within:text-[#674188]">
            <Mail className="w-5 h-5" />
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 transition-all duration-200 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg focus:shadow-[#C3ACD0]/20 hover:border-[#C3ACD0]/50"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="group">
        <label className="block text-sm font-semibold mb-2.5 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
          Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C3ACD0] transition-colors group-focus-within:text-[#674188]">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 transition-all duration-200 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg focus:shadow-[#C3ACD0]/20 hover:border-[#C3ACD0]/50"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C3ACD0] hover:text-[#674188] transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="mt-1.5 text-xs text-[#674188]/60">Must be at least 8 characters</p>
      </div>

      {/* Confirm Password Field */}
      <div className="group">
        <label className="block text-sm font-semibold mb-2.5 text-[#674188] transition-colors group-focus-within:text-[#C3ACD0]">
          Confirm Password
        </label>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#C3ACD0] transition-colors group-focus-within:text-[#674188]">
            <Lock className="w-5 h-5" />
          </div>
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-[#F7EFE5] bg-[#FFFBF5] text-[#674188] placeholder:text-[#C3ACD0]/50 transition-all duration-200 focus:outline-none focus:border-[#C3ACD0] focus:shadow-lg focus:shadow-[#C3ACD0]/20 hover:border-[#C3ACD0]/50"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#C3ACD0] hover:text-[#674188] transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

   

      {/* Error Message */}
      {(formError || error) && (
        <div className="relative overflow-hidden px-4 py-3.5 rounded-xl bg-linear-to-r from-red-50 to-red-100 border-2 border-red-200">
          <div className="absolute inset-0 bg-red-400/10"></div>
          <p className="relative text-sm font-semibold text-red-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            {formError || error}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="group relative w-full py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-[#674188]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 overflow-hidden"
      >
        <div className="absolute inset-0 bg-linear-to-r from-[#674188] to-[#C3ACD0] transition-transform duration-300 group-hover:scale-105"></div>
        <div className="absolute inset-0 bg-linear-to-r from-[#C3ACD0] to-[#674188] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </span>
      </button>

      
    </form>
  )
}