'use client';

import { useState } from 'react';
import { Star, Shield, AlertTriangle, Search } from "lucide-react";
import Link from "next/link";
import SearchBar from './SearchBar';

interface Package {
  id: number;
  name: string;
  displayName: string;
  author: string;
  description: string;
  tags: string[];
  category: string;
  stats: {
    weekly: number;
    total: number;
  };
  updated: string;
  vulnerabilities: number;
  securityScore: number | null;
  isOfficial: boolean;
  isCommunity: boolean;
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
      {/* Search Bar */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Results Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchQuery ? (
            <>
              Search Results for "{searchQuery}" 
              <span className="text-gray-500 text-lg ml-2">({sortedPackages.length})</span>
            </>
          ) : (
            <>All Packages ({packages.length})</>
          )}
        </h2>
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
      <div className="space-y-4">
        {sortedPackages.map((pkg) => (
          <Link 
            key={pkg.id}
            href={`/package/${pkg.name}`}
            className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900">{pkg.displayName}</h3>
                  <span className="text-sm text-gray-500">by {pkg.author}</span>
                  
                  {pkg.isOfficial && (
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      Official
                    </span>
                  )}
                  {pkg.isCommunity && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                      Community
                    </span>
                  )}
                  
                  {pkg.securityScore !== null && (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded flex items-center gap-1 ${
                      pkg.securityScore >= 80 
                        ? 'bg-green-100 text-green-800' 
                        : pkg.securityScore >= 60 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : pkg.securityScore >= 40
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {pkg.securityScore}
                    </span>
                  )}
                  
                  {pkg.vulnerabilities > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs font-semibold rounded flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {pkg.vulnerabilities} {pkg.vulnerabilities === 1 ? 'vuln' : 'vulns'}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-600 mb-3">{pkg.description}</p>
                
                <div className="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">{pkg.category}</span>
                  {pkg.tags.map((tag, i) => (
                    <span key={i} className="text-gray-500">{tag}</span>
                  ))}
                  <span>📥 {pkg.stats.weekly.toLocaleString()} weekly</span>
                  <span>Updated {pkg.updated}</span>
                </div>
              </div>
              
              <button className="text-gray-400 hover:text-yellow-500 ml-4">
                <Star className="w-5 h-5" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

