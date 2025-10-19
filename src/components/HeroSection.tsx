'use client';

import { Search, Plus } from "lucide-react";

interface HeroSectionProps {
  stats: {
    total: number;
    weekly: number;
    daily: number;
    monthly: number;
  };
}

export default function HeroSection({ stats }: HeroSectionProps) {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MCP Directory
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-12">
            This is a list of all the packages on npm. It is sorted by name. The list is updated in real time. 
            The list might not be exhaustive. If you want to see a particular package, you can use the search 
            feature at the top of every page on Socket.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {stats.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">MCP Servers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {Math.floor(stats.total / 10)}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {Math.floor(stats.total * 0.1)}
              </div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                100
              </div>
              <div className="text-sm text-gray-600">Open Source</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
