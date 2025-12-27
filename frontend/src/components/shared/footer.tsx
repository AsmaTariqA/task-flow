"use client"

import {Zap} from 'lucide-react';
 
export default function Footer() {
    return(
        
      <footer className="bg-[#F7EFE5] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-[#674188] to-[#C3ACD0] rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold text-[#674188]">TaskFlow</span>
              </div>
              <p className="text-[#674188]/70 text-sm">
                Built with ❤️ for developers
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-[#674188] mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-[#674188]/70 hover:text-[#674188]">Features</a></li>
                <li><a href="#pricing" className="text-[#674188]/70 hover:text-[#674188]">Pricing</a></li>
                <li><a href="/changelog" className="text-[#674188]/70 hover:text-[#674188]">Changelog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-[#674188] mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href={`${process.env.NEXT_PUBLIC_API_URL}/docs`} className="text-[#674188]/70 hover:text-[#674188]">Documentation</a></li>
                <li><a href={`${process.env.NEXT_PUBLIC_API_URL}/docs`} className="text-[#674188]/70 hover:text-[#674188]">API Reference</a></li>
                <li><a href="/blog" className="text-[#674188]/70 hover:text-[#674188]">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-[#674188] mb-4">Community</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://github.com" className="text-[#674188]/70 hover:text-[#674188]">GitHub</a></li>
                <li><a href="https://twitter.com" className="text-[#674188]/70 hover:text-[#674188]">Twitter</a></li>
                <li><a href="https://discord.com" className="text-[#674188]/70 hover:text-[#674188]">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#C3ACD0]/30 pt-8 text-center text-sm text-[#674188]/60">
            © 2025 TaskFlow. All rights reserved.
          </div>
        </div>
      </footer>
    )
}