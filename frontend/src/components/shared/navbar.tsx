"use client"
import React, { useState } from 'react';
import { ArrowRight, Github, FileText, Zap, Users, Lock, Code, CheckCircle2, Menu, X } from 'lucide-react';
 

export default function Navbar()  {
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    return (

<nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFBF5]/80 backdrop-blur-md border-b border-[#C3ACD0]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-[#674188] blur-xl opacity-30 rounded-full"></div>
                <div className="relative w-10 h-10 bg-linear-to-br from-[#674188] to-[#C3ACD0] rounded-xl flex items-center justify-center transform rotate-12">
                  <Zap className="w-5 h-5 text-white -rotate-12" />
                </div>
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-[#674188] to-[#C3ACD0] bg-clip-text text-transparent">
                TaskFlow
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
             
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
                 className="text-[#674188] hover:text-[#C3ACD0] transition-colors font-medium flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/docs`} className="text-[#674188] hover:text-[#C3ACD0] transition-colors font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Docs
              </a>
              <a href="/auth/login" className="text-[#674188] hover:text-[#C3ACD0] transition-colors font-medium">
                Login
              </a>
              <a href="/auth/signup" 
                 className="px-6 py-2.5 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all">
                Get Started
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#674188]">
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-6 flex flex-col gap-4 border-t border-[#C3ACD0]/20 mt-4">
            
              <a href="https://github.com" className="text-[#674188] hover:text-[#C3ACD0] transition-colors font-medium flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a href={`${process.env.NEXT_PUBLIC_API_URL}/docs`} className="text-[#674188] hover:text-[#C3ACD0] transition-colors font-medium flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Docs
              </a>
              <a href="/auth/login" className="text-[#674188] hover:text-[#C3ACD0] transition-colors font-medium">
                Login
              </a>
              <a href="/auth/signup" 
                 className="px-6 py-2.5 bg-linear-to-r from-[#674188] to-[#C3ACD0] text-white rounded-full font-semibold text-center">
                Get Started
              </a>
            </div>
          )}
        </div>
      </nav>

        );

{} }