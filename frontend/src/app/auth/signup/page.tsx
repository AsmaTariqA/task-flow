"use client"
import SignupForm from "@/components/auth/signup-form"
import { Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-[#FFFBF5] via-[#F7EFE5] to-[#FFFBF5]">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#C3ACD0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#674188] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-[#F7EFE5] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Back to home link */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-[#674188] hover:text-[#C3ACD0] transition-all group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold">Back to Home</span>
      </Link>

      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-[#674188] blur-xl opacity-30 rounded-full"></div>
              <div className="relative w-12 h-12 bg-linear-to-br from-[#674188] to-[#C3ACD0] rounded-xl flex items-center justify-center transform rotate-12">
                <Zap className="w-6 h-6 text-white -rotate-12" />
              </div>
            </div>
            <span className="text-3xl font-bold bg-linear-to-r from-[#674188] to-[#C3ACD0] bg-clip-text text-transparent">
              TaskFlow
            </span>
          </div>

          {/* Card */}
          <div className="relative rounded-3xl p-8 md:p-10 shadow-2xl bg-white/80 backdrop-blur-md border-2 border-white/50">
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-[#674188]/20 to-[#C3ACD0]/20 -z-10 blur-xl"></div>
            
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#674188] mb-2">
                Create Account
              </h1>
              <p className="text-[#674188]/70 text-lg">
                Start managing your projects today
              </p>
            </div>

            <SignupForm />

            {/* Login link */}
            <div className="mt-6 text-center">
              <p className="text-[#674188]/70">
                Already have an account?{' '}
                <Link 
                  href="/auth/login" 
                  className="text-[#674188] font-bold hover:text-[#C3ACD0] transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-8 text-center text-sm text-[#674188]/60 space-y-1">
            <p>🔒 Your data is encrypted and secure</p>
            <p>✨ Free forever • No credit card required</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}