import { Search } from "lucide-react";
import Link from "next/link";
import { getAllMCPData } from "@/lib/mcpData";
import PackageList from "@/components/PackageList";

export default function Home() {
  // Load all MCP data from JSON files
  const allMCPs = getAllMCPData();
  
  // Generate real statistics - calculate packages added over time
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  // Count packages added in different time periods
  // Use _fileDate (when file was added) instead of firstReleaseDate (when package was released)
  const dailyAdded = allMCPs.filter(mcp => {
    const addedDate = new Date(mcp._fileDate || mcp.firstReleaseDate);
    return addedDate >= oneDayAgo;
  }).length;
  
  const weeklyAdded = allMCPs.filter(mcp => {
    const addedDate = new Date(mcp._fileDate || mcp.firstReleaseDate);
    return addedDate >= oneWeekAgo;
  }).length;
  
  const monthlyAdded = allMCPs.filter(mcp => {
    const addedDate = new Date(mcp._fileDate || mcp.firstReleaseDate);
    return addedDate >= oneMonthAgo;
  }).length;
  
  const stats = {
    total: allMCPs.length,
    weekly: weeklyAdded,
    daily: dailyAdded,
    monthly: monthlyAdded
  };
  
  // Extract unique categories from the data
  const categorySet = new Set<string>();
  allMCPs.forEach(mcp => {
    if (mcp.isOfficial) categorySet.add('Official');
    if (mcp.isCommunity) categorySet.add('Community');
    categorySet.add(mcp.platform);
    
    // Add category based on name patterns
    const name = mcp.name.toLowerCase();
    if (name.includes('database') || name.includes('mongo') || name.includes('sql')) {
      categorySet.add('Databases');
    } else if (name.includes('gitlab') || name.includes('github')) {
      categorySet.add('Version Control');
    } else if (name.includes('pdf') || name.includes('excel') || name.includes('reader')) {
      categorySet.add('Document Processing');
    } else if (name.includes('earth') || name.includes('data')) {
      categorySet.add('Data Sources');
    } else if (name.includes('inspector') || name.includes('toolkit')) {
      categorySet.add('Development Tools');
    } else {
      categorySet.add('Other Servers');
    }
  });
  
  const categories = Array.from(categorySet);
  
  // Convert MCP data to package format
  const packages = allMCPs.map((mcp, index) => {
    const latestVersion = mcp.versions[0];
    const nameParts = mcp.identifier.split('/');
    const packageName = nameParts[nameParts.length - 1];
    
    // Determine category
    let category = 'Other Servers';
    if (mcp.isOfficial) category = 'Official';
    else if (mcp.isCommunity) category = 'Community';
    
    // Calculate days since release
    const releaseDate = new Date(latestVersion?.releaseDate || mcp.firstReleaseDate);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));
    const updatedText = daysSince === 0 ? 'today' : daysSince === 1 ? 'yesterday' : `${daysSince} days ago`;
    
    return {
      id: index + 1,
      name: packageName,
      displayName: mcp.name,
      author: mcp.identifier.split('/')[0],
      description: mcp.description,
      tags: [mcp.platform, mcp.isOfficial ? 'official' : 'community'],
      category,
      stats: {
        weekly: latestVersion?.securityReview?.weeklyDownloads || 0,
        total: (latestVersion?.securityReview?.weeklyDownloads || 0) * 52
      },
      updated: updatedText,
      vulnerabilities: latestVersion?.securityReview?.vulnerabilities?.length || 0,
      securityScore: latestVersion?.securityReview ? Math.round(
        (latestVersion.securityReview.scores.supplyChainSecurity * 0.25 +
        latestVersion.securityReview.scores.vulnerability * 0.30 +
        latestVersion.securityReview.scores.quality * 0.20 +
        latestVersion.securityReview.scores.maintainabile * 0.15 +
        latestVersion.securityReview.scores.license * 0.10)
      ) : null,
      isOfficial: mcp.isOfficial,
      isCommunity: mcp.isCommunity
    };
  }).sort((a, b) => b.stats.weekly - a.stats.weekly); // Sort by popularity
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MCP Directory</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Browse the largest collection of Model Context Protocol packages. Find high-quality packages for all your development needs, from APIs to databases.
          </p>
          

          {/* Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
              <div>Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.daily}</div>
              <div>Daily</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.weekly}</div>
              <div>Weekly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.monthly}</div>
              <div>Monthly</div>
            </div>
          </div>
        </div>

        {/* Popular Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((category, index) => {
              // Count packages in this category
              const count = packages.filter(pkg => 
                pkg.category === category || 
                pkg.tags.includes(category.toLowerCase()) ||
                (category === 'nodejs' && pkg.tags.includes('nodejs')) ||
                (category === 'Community' && pkg.isCommunity) ||
                (category === 'Official' && pkg.isOfficial)
              ).length;
              
              // Get icon/emoji for category
              const getCategoryIcon = (cat: string) => {
                if (cat === 'Official') return '🏅';
                if (cat === 'Community') return '👥';
                if (cat === 'nodejs') return '🟢';
                if (cat === 'python') return '🐍';
                if (cat === 'Databases') return '🗄️';
                if (cat === 'Version Control') return '🔀';
                if (cat === 'Document Processing') return '📄';
                if (cat === 'Data Sources') return '📊';
                if (cat === 'Development Tools') return '🛠️';
                return '📦';
              };
              
              return (
                <Link 
                  key={index}
                  href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                  className="p-4 border border-gray-200 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg mx-auto mb-2 flex items-center justify-center text-2xl">
                    {getCategoryIcon(category)}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{category}</div>
                  <div className="text-xs text-gray-500">{count} {count === 1 ? 'package' : 'packages'}</div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-6">
            <Link href="/categories" className="text-blue-600 hover:text-blue-800 font-medium">
              View all {categories.length} categories →
            </Link>
          </div>
        </section>

        {/* All Packages with Search */}
        <section>
          <PackageList packages={packages} />
        </section>
      </main>
    </div>
  );
}