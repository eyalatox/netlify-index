import { ArrowLeft, Star, Download, ExternalLink, Github, Users, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { loadMCPData, getAllMCPData } from "@/lib/mcpData";
import { fetchGitHubReadme } from "@/lib/githubFetcher";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import SecurityScore from "@/components/SecurityScore";
import VersionSelector from "@/components/VersionSelector";

interface VersionPageProps {
  params: Promise<{ name: string; version: string }>;
}

// Generate static paths for version-specific pages
export async function generateStaticParams() {
  const allMCPs = getAllMCPData();
  const paths: { name: string; version: string }[] = [];
  
  allMCPs.forEach(mcp => {
    const nameParts = mcp.identifier.split('/');
    const packageName = nameParts[nameParts.length - 1];
    
    // Generate a path for each version
    mcp.versions.forEach(version => {
      paths.push({
        name: packageName,
        version: version.version
      });
    });
  });
  
  return paths;
}

export default async function VersionPage({ params }: VersionPageProps) {
  const { name, version } = await params;
  
  // Load MCP data from JSON files
  const mcpData = loadMCPData(name);
  
  // Fetch README from GitHub if available
  let readmeContent = null;
  if (mcpData?.repository?.url) {
    readmeContent = await fetchGitHubReadme(mcpData.repository.url);
  }
  
  // Find the specific version
  const selectedVersion = mcpData?.versions?.find(v => v.version === version) || mcpData?.versions?.[0];
  
  // Fallback data if MCP data not found
  const packageData = mcpData ? {
    name: mcpData.name,
    fullName: mcpData.identifier,
    version: selectedVersion?.version || "1.0.0",
    description: mcpData.description,
    author: mcpData.identifier.split('/')[0],
    category: mcpData.isOfficial ? "Official" : mcpData.isCommunity ? "Community" : "Other Servers",
    tags: [mcpData.platform, mcpData.isOfficial ? "official" : "community"],
    stats: {
      weekly: selectedVersion?.securityReview?.weeklyDownloads || 0,
      total: selectedVersion?.securityReview?.weeklyDownloads || 0,
      starCount: 1,
      downloadCount: selectedVersion?.securityReview?.weeklyDownloads || 0
    },
    lastUpdated: selectedVersion?.releaseDate ? new Date(selectedVersion.releaseDate).toLocaleDateString() : "Unknown",
    maintainers: [mcpData.identifier.split('/')[0]],
    repository: mcpData.repository.url,
    homepage: mcpData.repository.url,
    license: selectedVersion?.license || "MIT",
    platform: mcpData.platform,
    isOfficial: mcpData.isOfficial,
    isCommunity: mcpData.isCommunity,
    firstReleaseDate: mcpData.firstReleaseDate
  } : {
    name: name,
    fullName: name,
    version: version,
    description: "Package information not available",
    author: "unknown",
    category: "Other Servers",
    tags: ["mcp"],
    stats: {
      weekly: 0,
      total: 0,
      starCount: 0,
      downloadCount: 0
    },
    lastUpdated: "Unknown",
    maintainers: ["unknown"],
    repository: "",
    homepage: "",
    license: "Unknown",
    platform: "nodejs",
    isOfficial: false,
    isCommunity: false,
    firstReleaseDate: "Unknown"
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">OX</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">MCP Directory</span>
          </div>
          <nav className="flex items-center space-x-8">
            <Link href="/packages" className="text-gray-600 hover:text-gray-900">Packages</Link>
            <Link href="/documentation" className="text-gray-600 hover:text-gray-900">Documentation</Link>
            <Link href="/community" className="text-gray-600 hover:text-gray-900">Community</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium">Get Started</button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link href="/" className="hover:text-gray-900 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Packages
          </Link>
          <span>/</span>
          <Link href={`/package/${name}`} className="hover:text-gray-900">{packageData.name}</Link>
          <span>/</span>
          <span className="text-gray-900">{version}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{packageData.name}</h1>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      v{packageData.version}
                    </span>
                    {packageData.isOfficial && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        Official
                      </span>
                    )}
                    {packageData.isCommunity && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                        Community
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mt-2">{packageData.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <Star className="w-4 h-4" />
                    <span className="text-sm">{packageData.stats.starCount}</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Download className="w-4 h-4" />
                    <span className="text-sm">Install</span>
                  </button>
                </div>
              </div>

              {/* Package Stats */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Weekly: {packageData.stats.weekly}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Total: {packageData.stats.total}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {packageData.lastUpdated}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {packageData.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Version Selector & Vulnerabilities */}
            {mcpData && mcpData.versions && mcpData.versions.length > 0 && (
              <VersionSelector 
                versions={mcpData.versions} 
                packageName={name}
                currentVersion={version}
              />
            )}

            {/* README Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Documentation</h2>
              {readmeContent ? (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <MarkdownRenderer content={readmeContent} />
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <p className="text-gray-600">
                    No README documentation available for this package.
                  </p>
                  {packageData.repository && (
                    <a 
                      href={packageData.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-flex items-center gap-1"
                    >
                      View on GitHub
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Security Score Card */}
            {selectedVersion?.securityReview && (
              <SecurityScore securityReview={selectedVersion.securityReview} />
            )}

            {/* Install Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Installation</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Package Manager</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>npm</option>
                    <option>yarn</option>
                    <option>pnpm</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Version</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>{packageData.version}</option>
                  </select>
                </div>
                <div className="pt-2">
                  <code className="block p-3 bg-gray-900 text-white rounded text-sm">
                    npm install {packageData.fullName}@{packageData.version}
                  </code>
                </div>
              </div>
            </div>

            {/* Package Info */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Package Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">{packageData.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-medium capitalize">{packageData.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">License</span>
                  <span className="font-medium">{packageData.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Downloads</span>
                  <span className="font-medium">{packageData.stats.weekly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">First Release</span>
                  <span className="font-medium">{packageData.firstReleaseDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{packageData.lastUpdated}</span>
                </div>
                {mcpData && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Versions</span>
                    <span className="font-medium">{mcpData.versions.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Links</h3>
              <div className="space-y-3">
                <a
                  href={packageData.repository}
                  className="flex items-center justify-between w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <Github className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Repository</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </a>
                <a
                  href={packageData.homepage}
                  className="flex items-center justify-between w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Homepage</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </a>
              </div>
            </div>

            {/* Maintainers */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Maintainers</h3>
              <div className="space-y-2">
                {packageData.maintainers.map((maintainer) => (
                  <div key={maintainer} className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="text-sm font-medium">{maintainer}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

