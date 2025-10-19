'use client';

import { useState } from 'react';
import { Star, Shield, AlertTriangle, Search } from "lucide-react";
import Link from "next/link";
import SearchBar from './SearchBar';

interface Package {
  id?: number;
  name: string;
  displayName: string;
  author: string;
  description: string;
  tags?: string[];
  category?: string;
  stats?: {
    weekly: number;
    total: number;
  };
  updated?: string;
  vulnerabilities?: number;
  securityScore?: number | null;
  isOfficial: boolean;
  isCommunity: boolean;
  stars: number;
  forks: number;
  openIssues: number;
  platform?: string;
  firstReleaseDate?: string;
}

interface PackageListProps {
  packages: Package[];
}

export default function PackageList({ packages }: PackageListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Filter packages based on search query
  const filteredPackages = packages.filter(pkg => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      pkg.displayName.toLowerCase().includes(query) ||
      pkg.name.toLowerCase().includes(query) ||
      pkg.description.toLowerCase().includes(query) ||
      pkg.author.toLowerCase().includes(query) ||
      pkg.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  // Sort packages
  const sortedPackages = [...filteredPackages].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.stats.weekly - a.stats.weekly;
      case 'recent':
        return 0; // Already sorted by update date
      case 'security':
        return (b.securityScore || 0) - (a.securityScore || 0);
      case 'vulnerabilities':
        return b.vulnerabilities - a.vulnerabilities;
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">All Packages</h2>
        <p className="text-gray-600">Browse all available MCP packages</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar onSearch={setSearchQuery} />
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          {searchQuery ? (
            <>
              Search Results for "{searchQuery}" 
              <span className="text-gray-500 text-lg ml-2">({sortedPackages.length})</span>
            </>
          ) : (
            <>Showing {sortedPackages.length} packages</>
          )}
        </h3>
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="popular">Most Popular</option>
          <option value="recent">Recently Updated</option>
          <option value="security">Best Security Score</option>
          <option value="vulnerabilities">Most Vulnerabilities</option>
        </select>
      </div>

      {/* No Results */}
      {sortedPackages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
          <p className="text-gray-600">
            Try adjusting your search query or browse all packages
          </p>
        </div>
      )}

      {/* Package List */}
      <div className="space-y-3">
        {sortedPackages.map((pkg) => (
          <Link 
            key={pkg.id}
            href={`/package/${pkg.name}`}
            className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium text-gray-900 truncate">{pkg.displayName}</h3>
                <p className="text-sm text-gray-500 mt-1">by {pkg.author}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{pkg.description}</p>
                
                {/* GitHub Stats */}
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{pkg.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{pkg.forks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{pkg.openIssues} issues</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {pkg.isOfficial && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                    Official
                  </span>
                )}
                {pkg.isCommunity && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                    Community
                  </span>
                )}
                <button className="text-gray-400 hover:text-yellow-500">
                  <Star className="w-4 h-4" />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center space-x-2">
        <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">←</button>
        <button className="px-3 py-2 text-sm bg-gray-100 text-gray-900 rounded">1</button>
        <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">2</button>
        <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">3</button>
        <span className="px-2 text-sm text-gray-500">...</span>
        <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">21</button>
        <button className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700">→</button>
      </div>
    </div>
  );
}

