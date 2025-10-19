'use client';

import Link from "next/link";
import { ChevronDown, Calendar } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">OX</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">MCP Directory</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
              <span className="text-sm font-medium">Packages</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
              <span className="text-sm font-medium">Documentation</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
              <span className="text-sm font-medium">Community</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <div className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 cursor-pointer">
              <span className="text-sm font-medium">Pricing</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* CTA Button */}
            <button className="bg-black text-white px-3 md:px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center space-x-1 md:space-x-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
