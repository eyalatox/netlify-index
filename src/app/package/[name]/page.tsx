'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ChevronDown, Download, Copy, AlertTriangle, ExternalLink, FileText } from "lucide-react";

interface PackagePageProps {
  params: { name: string };
}

// This needs to be a client component to use tabs
export default function PackagePage({ params }: PackagePageProps) {
  const [mcpData, setMcpData] = useState<any>(null);
  const [readmeContent, setReadmeContent] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'vulnerabilities' | 'tools' | 'dependencies' | 'maintainers' | 'versions' | 'explorer'>('overview');
  const [loading, setLoading] = useState(true);
  const [selectedVersionIndex, setSelectedVersionIndex] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      try {
        console.log('Fetching package:', params.name);
        
        // Fetch package data
        const packageRes = await fetch(`/api/package/${params.name}`);
        console.log('API response status:', packageRes.status);
        
        if (!packageRes.ok) {
          throw new Error('Package not found');
        }
        
        const data = await packageRes.json();
        console.log('Package data received:', data);
        
        if (!mounted) return;
        setMcpData(data);
  
  // Fetch README from GitHub if available
        if (data?.repository?.url) {
          try {
            const readmeRes = await fetch(`/api/github-readme?url=${encodeURIComponent(data.repository.url)}`);
            if (readmeRes.ok) {
              const result = await readmeRes.json();
              if (result.content && mounted) {
                setReadmeContent(result.content);
              }
            }
          } catch (readmeErr) {
            console.warn('Failed to fetch README:', readmeErr);
            // README fetch failure is not critical, continue
          }
        }
      } catch (err) {
        console.error('Failed to fetch package data:', err);
        if (mounted) {
          setMcpData(null);
        }
      } finally {
        if (mounted) {
          console.log('Loading complete');
          setLoading(false);
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [params.name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading package...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!mcpData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-[1440px] mx-auto px-5 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Package not found</h1>
            <p className="text-gray-600 mb-6">The package you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2">
              <span>←</span> Back to home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Use selected version or fallback to latest
  const selectedVersion = mcpData.versions[selectedVersionIndex] || mcpData.versions[0];
  const latestVersion = mcpData.versions[0];
  
  const securityScores = selectedVersion?.securityReview?.scores || {
    supplyChainSecurity: 0,
    vulnerability: 0,
    quality: 0,
    maintainabile: 0,
    license: 0
  };
  
  const vulnerabilities = selectedVersion?.securityReview?.vulnerabilities || [];
  const weeklyDownloads = selectedVersion?.securityReview?.weeklyDownloads || 0;

  // Helper function to normalize file paths
  const normalizeFilePath = (filePath: string) => {
    if (!filePath) return '';
    
    // Remove temporary directory prefix like /var/folders/.../T/mcp-scan-{uuid}/
    // Match pattern: anything up to and including /mcp-scan-{uuid}/
    const scanDirPattern = /^.*\/mcp-scan-[a-f0-9-]+\//;
    const normalized = filePath.replace(scanDirPattern, '');
    
    // If the path is still absolute after normalization, make it relative
    return normalized.startsWith('/') ? normalized.slice(1) : normalized;
  };

  // Helper function to get score color
  const getScoreColor = (score: number, isVulnerability = false) => {
    // All scores now use the same scale: 100=good/green, 0=bad/red
    if (score >= 80) return { stroke: '#10b981', text: 'text-green-600' };
    if (score >= 60) return { stroke: '#f59e0b', text: 'text-yellow-600' };
    if (score >= 40) return { stroke: '#f97316', text: 'text-orange-600' };
    return { stroke: '#ef4444', text: 'text-red-600' };
  };

  // Circular progress component
  const CircularProgress = ({ score, label, isVulnerability = false }: { score: number; label: string; isVulnerability?: boolean }) => {
    const colors = getScoreColor(score, isVulnerability);
    const radius = 33;
    const circumference = 2 * Math.PI * radius;
    const progress = (score / 100) * circumference;

  return (
      <div className="flex flex-col items-center">
        <div className="relative w-[74px] h-[74px]">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="37"
              cy="37"
              r={radius}
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="37"
              cy="37"
              r={radius}
              stroke={colors.stroke}
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${colors.text}`}>{score}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center mt-3 max-w-[74px] leading-tight">{label}</p>
      </div>
    );
  };

  const Tab = ({ id, label, count, active, onClick }: { id: string; label: string; count?: number; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`pb-2 px-1 text-base font-medium border-b-2 transition-colors ${
        active
          ? 'text-gray-900 border-gray-900'
          : 'text-gray-600 border-transparent hover:text-gray-900'
      }`}
    >
      <span>{label}</span>
      {count !== undefined && <span className="ml-2 text-gray-400">{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-[1440px] mx-auto px-5 py-8">
        {/* Breadcrumb */}
        <p className="text-gray-500 mb-8 text-base">
          Packages &gt; {mcpData.name}
        </p>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-10 overflow-x-auto">
          <div className="flex gap-6">
            <Tab id="overview" label="Package Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <Tab id="vulnerabilities" label="Vulnerabilities" count={vulnerabilities.length} active={activeTab === 'vulnerabilities'} onClick={() => setActiveTab('vulnerabilities')} />
            <Tab id="tools" label="Tools" count={0} active={activeTab === 'tools'} onClick={() => setActiveTab('tools')} />
            <Tab id="dependencies" label="Dependencies" count={0} active={activeTab === 'dependencies'} onClick={() => setActiveTab('dependencies')} />
            <Tab id="maintainers" label="Maintainers" count={0} active={activeTab === 'maintainers'} onClick={() => setActiveTab('maintainers')} />
            <Tab id="versions" label="Versions" count={0} active={activeTab === 'versions'} onClick={() => setActiveTab('versions')} />
            <Tab id="explorer" label="File Explorer" active={activeTab === 'explorer'} onClick={() => setActiveTab('explorer')} />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* Title Section + Security Circles */}
            <div className="flex flex-col lg:flex-row gap-12 mb-10">
              {/* Left: Title & Description & Buttons */}
              <div className="flex-1 max-w-[568px]">
                <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">{mcpData.name}</h1>
                <div 
                  className="text-base text-gray-700 leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: mcpData.description }}
                />
                
                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex gap-3">
                    {mcpData.repository?.url && (
                      <a
                        href={mcpData.repository.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        Repository
                      </a>
                    )}
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors">
                      <Copy className="w-5 h-5" />
                      Copy install
                  </button>
              </div>

                  {/* GitHub Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">{mcpData.stars?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{mcpData.forks?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{mcpData.openIssues?.toLocaleString() || 0} issues</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Security Score Circles */}
              <div className="flex gap-6 flex-wrap">
                <CircularProgress score={securityScores.supplyChainSecurity} label="Supply Chain Security" />
                <CircularProgress score={securityScores.vulnerability} label="Vulnerability" isVulnerability />
                <CircularProgress score={securityScores.quality} label="Quality" />
                <CircularProgress score={securityScores.maintainabile} label="Maintenance" />
                <CircularProgress score={securityScores.license} label="License" />
              </div>
            </div>

            {/* Warning Cards + Right Sidebar */}
            <div className="flex flex-col lg:flex-row gap-8 mb-10">
              {/* Warning Cards */}
              <div className="flex-1 max-w-[765px]">
                {(weeklyDownloads < 100 || vulnerabilities.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {weeklyDownloads < 100 && (
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <div className="flex gap-4 mb-4">
                          <div className="flex items-start">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </div>
                          </div>
                <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Unpopular package</h4>
                            <span className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full mb-3">
                              QUALITY
                      </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          This package is not very popular.<br />
                          Found 1 instance in 1 package.
                        </p>
                      </div>
                    )}

                    {vulnerabilities.length > 0 && vulnerabilities.slice(0, 2).map((vuln: any, index: number) => {
                      // Truncate description to first 100 characters
                      const shortDescription = vuln.description 
                        ? (vuln.description.length > 100 
                          ? vuln.description.substring(0, 100) + '...' 
                          : vuln.description)
                        : 'Security vulnerability detected in this package.';
                      
                      return (
                        <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6">
                          <div className="flex gap-4 mb-4">
                            <div className="flex items-start">
                              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-lg font-semibold text-gray-900">{vuln.category || 'Security Vulnerability'}</h4>
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded ${
                                  vuln.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                  vuln.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                                  vuln.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {vuln.severity || 'UNKNOWN'}
                                </span>
                              </div>
                              {vuln.id && (
                                <p className="text-sm text-gray-500 mb-2">{vuln.id}</p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {shortDescription}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Found 1 instance in 1 package
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* README Section - Placed in left column */}
                <div className="mt-6">
                  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 px-6 py-4">
                      <div className="flex gap-2 items-center">
                        <FileText className="w-5 h-5 text-purple-600" />
                        <span className="text-lg font-semibold text-gray-900">README</span>
                      </div>
                    </div>
                    <div className="px-8 py-6">
                      {loading ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-3"></div>
                          <p className="text-gray-600 text-sm">Loading documentation...</p>
                        </div>
                      ) : readmeContent ? (
                        <div className="readme-wrapper">
                  <MarkdownRenderer content={readmeContent} />
                </div>
              ) : (
                        <div className="text-center py-12">
                          <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600 mb-4">
                    No README documentation available for this package.
                  </p>
                            {mcpData.repository?.url && (
                    <a 
                                href={mcpData.repository.url}
                      target="_blank"
                      rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View on GitHub
                                <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                          </div>
                </div>
              )}
                    </div>
                  </div>
            </div>
          </div>

              {/* Right Sidebar - Version Card */}
              <div className="w-full lg:w-[371px] flex-shrink-0">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 mb-1">{selectedVersion.version}</p>
                      <p className="text-xs text-gray-500 mb-1">Version published</p>
                      <p className="text-sm text-gray-700">{new Date(selectedVersion.releaseDate).toLocaleDateString()}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900 mb-1">{weeklyDownloads.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 mb-1">Weekly downloads</p>
                      <p className="text-sm text-green-600">↗ 0.5%</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <p className="text-xs text-gray-500 mb-1 text-center">Created</p>
                    <p className="text-sm text-gray-700 text-center">{new Date(mcpData.firstReleaseDate).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-gray-600 text-center mb-4">Download chart</p>
                  
                  {/* Version Dropdown */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Version</label>
                    <select 
                      className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer"
                      value={selectedVersionIndex}
                      onChange={(e) => setSelectedVersionIndex(Number(e.target.value))}
                    >
                      {mcpData.versions.map((version: any, index: number) => (
                        <option key={index} value={index}>
                          {version.version} {index === 0 ? '(latest)' : ''} - {new Date(version.releaseDate).toLocaleDateString()}
                        </option>
                      ))}
                  </select>
                  </div>
                </div>

                {/* Maintainers Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Maintainers</h4>
                  <div className="space-y-3">
                    {mcpData.maintainers && mcpData.maintainers.length > 0 ? (
                      mcpData.maintainers.map((maintainer: any, index: number) => (
                        <div key={index} className="flex items-center gap-3">
                          {maintainer.avatarUrl ? (
                            <img 
                              src={maintainer.avatarUrl} 
                              alt={maintainer.name || maintainer.login}
                              className="w-11 h-11 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                              {(maintainer.name || maintainer.login).split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <p className="text-gray-900 font-medium">{maintainer.name || maintainer.login}</p>
                            <p className="text-sm text-gray-500">{maintainer.type}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                          {mcpData.identifier.split('/')[0].slice(0, 2).toUpperCase()}
                </div>
                <div>
                          <p className="text-gray-900 font-medium">{mcpData.identifier.split('/')[0]}</p>
                          <p className="text-sm text-gray-500">Maintainer</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Keywords Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* MCP Package Name */}
                    <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {mcpData.name}
                    </span>
                    
                    {/* Maintainer/Organization name from identifier */}
                    {mcpData.identifier.split('/')[0] && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {mcpData.identifier.split('/')[0]}
                      </span>
                    )}
                    
                    {/* Repository name if different */}
                    {mcpData.identifier.split('/')[1] && mcpData.identifier.split('/')[1] !== mcpData.name.toLowerCase().replace(/\s+/g, '-') && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {mcpData.identifier.split('/')[1]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Install Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mt-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Install</h4>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`npm i ${mcpData.identifier.split('/').pop() || mcpData.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3.5 pr-12 text-gray-800 font-mono text-sm"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                      <Copy className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Section - Full Width */}
            <div className="max-w-[765px]">
              <div className="bg-white border border-gray-200 rounded-2xl p-8">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">FAQs</h2>
                <div className="space-y-0">
                  <details className="group border-b border-gray-200">
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-medium text-gray-800 py-4">
                      What is amazon?
                      <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                    </summary>
                  </details>

                  <details className="group border-b border-gray-200" open>
                    <summary className="flex justify-between items-center cursor-pointer text-lg font-medium text-gray-800 py-4">
                      Is amazon well maintained?
                      <ChevronDown className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="pb-4 text-gray-600 leading-relaxed">
                      We found that amazon demonstrated a not healthy version release cadence and project activity because the last version was released a year ago. It has 1 open source maintainer collaborating on the project.
                </div>
                  </details>
                </div>
                <p className="text-sm text-gray-500 mt-6">
                  Package last updated on {new Date(latestVersion.releaseDate).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'vulnerabilities' && (
          <div className="max-w-[765px]">
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Security Vulnerabilities</h2>
              {vulnerabilities.length > 0 ? (
                <div className="space-y-6">
                  {vulnerabilities.map((vuln: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                          vuln.severity === 'CRITICAL' || vuln.severity === 'HIGH' ? 'text-red-500' :
                          vuln.severity === 'MEDIUM' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-900">{vuln.id || vuln.category}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              vuln.severity === 'CRITICAL' || vuln.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                              vuln.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {vuln.severity}
                            </span>
                </div>
                          {vuln.category && <p className="text-sm font-medium text-gray-600 mb-3">{vuln.category}</p>}
                          <p className="text-gray-700 mb-4">{vuln.description}</p>

                          {vuln.baseMetricV3?.cvssV3 && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">CVSS Score</span>
                                <span className="text-2xl font-bold text-gray-900">
                                  {vuln.baseMetricV3.cvssV3.baseScore}
                                </span>
                </div>
                              <p className="text-sm text-gray-600">{vuln.baseMetricV3.cvssV3.vectorString}</p>
                </div>
                          )}

                          {vuln.location && (
                            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-4 overflow-x-auto">
                              <p className="text-xs text-gray-400 mb-2">
                                {normalizeFilePath(vuln.location.file)} : Line {vuln.location.line}
                              </p>
                              <code className="text-sm">{vuln.location.snippet}</code>
                </div>
                          )}

                          {vuln.exploitationSteps && (
                            <div className="border-t border-gray-200 pt-4 mt-4">
                              <h4 className="text-sm font-semibold text-gray-900 mb-2">Exploitation Steps</h4>
                              <p className="text-sm text-gray-700">{vuln.exploitationSteps}</p>
                  </div>
                )}
              </div>
            </div>
                  </div>
                  ))}
                  </div>
              ) : (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No security alerts found</p>
                  <p className="text-gray-500 text-sm mt-2">This package has no known vulnerabilities</p>
              </div>
              )}
            </div>
                    </div>
        )}

        {(activeTab === 'tools' || activeTab === 'dependencies' || activeTab === 'maintainers' || activeTab === 'versions' || activeTab === 'explorer') && (
          <div className="max-w-[765px]">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
              <p className="text-gray-600">This section is not available yet.</p>
            </div>
          </div>
        )}
        </div>

      <Footer />
    </div>
  );
}

// Note: This is a client component for tab functionality
// Static generation is disabled to support dynamic routing
