"use client"

import { ArrowRight, Github, FileText, Zap, Users, Lock, Code, CheckCircle2} from 'lucide-react';
import Navbar from '@/components/shared/navbar';
import Footer from '@/components/shared/footer';
export default function Home() {


  return (
    <div className="min-h-screen bg-[#FFFBF5] overflow-hidden">
      {/* Navigation */}
      <Navbar />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#C3ACD0] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#674188] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#F7EFE5] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm border border-[#C3ACD0]/30 rounded-full mb-8 shadow-sm">
              <div className="w-2 h-2 bg-[#674188] rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-[#674188]">Built for developers, by developers</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="bg-linear-to-r from-[#674188] via-[#C3ACD0] to-[#674188] bg-clip-text text-transparent animate-gradient bg-size-[200%_auto]">
                Ship Faster
              </span>
              <br />
              <span className="text-[#674188]">Code Smarter</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#674188]/70 mb-12 max-w-2xl mx-auto leading-relaxed">
              The task management tool designed specifically for development teams. 
              Track issues, manage sprints, and collaborate seamlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <a href="/auth/signup" 
                 className="group px-8 py-4 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-3">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-[#C3ACD0]/30">
              <div>
                <div className="text-3xl font-bold text-[#674188] mb-1">10k+</div>
                <div className="text-sm text-[#674188]/60">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#674188] mb-1">500k+</div>
                <div className="text-sm text-[#674188]/60">Tasks Completed</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#674188] mb-1">99.9%</div>
                <div className="text-sm text-[#674188]/60">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-linear-to-b from-transparent to-[#F7EFE5]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-[#674188] mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-[#674188]/70 max-w-2xl mx-auto">
              Powerful features that make project management feel effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-8 h-8" />,
                title: "Developer-First",
                description: "Git integration, markdown support, and keyboard shortcuts built in"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Lightning Fast",
                description: "Optimized performance with real-time updates across your team"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Team Collaboration",
                description: "Comments, mentions, and file sharing to keep everyone in sync"
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Secure by Default",
                description: "Enterprise-grade security with end-to-end encryption"
              },
              {
                icon: <CheckCircle2 className="w-8 h-8" />,
                title: "Custom Workflows",
                description: "Adapt TaskFlow to match your team's unique process"
              },
              {
                icon: <FileText className="w-8 h-8" />,
                title: "Rich Documentation",
                description: "Comprehensive docs and API references for developers"
              }
            ].map((feature, idx) => (
              <div key={idx} 
                   className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#C3ACD0]/20 hover:border-[#C3ACD0]/50 hover:-translate-y-1">
                <div className="absolute inset-0 bg-linear-to-br from-[#674188]/5 to-[#C3ACD0]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-linear-to-br from-[#674188] to-[#C3ACD0] rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-[#674188] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#674188]/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-linear-to-br from-[#674188] to-[#C3ACD0] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of developers who've already made the switch
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/auth/signup" 
               className="px-10 py-5 bg-white text-[#674188] rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Start Free Trial
            </a>
            <a href="https://github.com" 
               className="px-10 py-5 bg-transparent text-white border-2 border-white rounded-full font-bold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <Github className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

    
<Footer />
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
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
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
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}