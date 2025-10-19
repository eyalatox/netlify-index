import { getAllMCPData } from "@/lib/mcpData";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Search } from "lucide-react";

export default function Home() {
  // Load all MCP data from JSON files
  const allMCPs = getAllMCPData();

  // Calculate statistics from real data
  const stats = {
    total: allMCPs.length,
    categories: new Set(allMCPs.map(mcp => mcp.platform)).size + 
                (allMCPs.some(m => m.isOfficial) ? 1 : 0) + 
                (allMCPs.some(m => m.isCommunity) ? 1 : 0), // Unique platforms + Official + Community
    featured: allMCPs.filter(mcp => mcp.isOfficial).length, // Official packages as featured
    openSource: allMCPs.filter(mcp => mcp.repository?.provider === 'github.com').length // Packages with GitHub repos
  };

  // Generate categories from real data
  const categoryMap = new Map<string, number>();
  
  allMCPs.forEach(mcp => {
    if (mcp.isOfficial) {
      categoryMap.set('Official Servers', (categoryMap.get('Official Servers') || 0) + 1);
    }
    
    const name = mcp.name.toLowerCase();
    if (name.includes('database') || name.includes('mongo') || name.includes('sql')) {
      categoryMap.set('Database', (categoryMap.get('Database') || 0) + 1);
    } else if (name.includes('api')) {
      categoryMap.set('API', (categoryMap.get('API') || 0) + 1);
    } else if (name.includes('file') || name.includes('pdf') || name.includes('excel')) {
      categoryMap.set('File Processing', (categoryMap.get('File Processing') || 0) + 1);
    } else if (name.includes('tool') || name.includes('dev')) {
      categoryMap.set('Development', (categoryMap.get('Development') || 0) + 1);
    } else if (name.includes('data')) {
      categoryMap.set('Data Sources', (categoryMap.get('Data Sources') || 0) + 1);
    }
  });

  const categories = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 18); // Get top 18 categories for 3 rows of 6

  // Get package list
  const packages = allMCPs.map((mcp) => {
    const nameParts = mcp.identifier.split('/');
    const packageName = nameParts[nameParts.length - 1];
    
    return {
      name: packageName,
      displayName: mcp.name,
      identifier: mcp.identifier,
      author: nameParts[0],
      description: mcp.description,
      stars: mcp.stars || 0,
      forks: mcp.forks || 0,
      openIssues: mcp.openIssues || 0,
      isOfficial: mcp.isOfficial,
      isCommunity: mcp.isCommunity,
      platform: mcp.platform,
      firstReleaseDate: mcp.firstReleaseDate
    };
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#061c37] to-[#3f11f7] bg-clip-text text-transparent mb-6">
            MCP Directory
          </h1>
          <p className="text-gray-700 text-lg mb-10 max-w-2xl mx-auto">
            This is a list of all the packages on npm. It is sorted by name. The list is updated in real time. The list might not be exhaustive. If you want to see a particular package, you can use the search feature at the top of every page on Socket.
          </p>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search MCP servers"
                className="w-full pl-14 pr-4 py-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-gray-700 text-sm mb-2">MCP Servers</div>
              <div className="h-px bg-gray-200 mb-2"></div>
              <div className="text-4xl font-semibold text-gray-900">{stats.total.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-700 text-sm mb-2">Categories</div>
              <div className="h-px bg-gray-200 mb-2"></div>
              <div className="text-4xl font-semibold text-gray-900">{stats.categories}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-700 text-sm mb-2">Featured</div>
              <div className="h-px bg-gray-200 mb-2"></div>
              <div className="text-4xl font-semibold text-gray-900">{stats.featured}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-700 text-sm mb-2">Open Source</div>
              <div className="h-px bg-gray-200 mb-2"></div>
              <div className="text-4xl font-semibold text-gray-900">{stats.openSource}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Popular Categories</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="bg-white border border-gray-200 rounded-2xl p-6 text-center hover:border-gray-300 hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-3">🔧</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{category.name}</div>
                <div className="text-gray-500 text-xs">{category.count} servers</div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/categories" className="text-purple-700 hover:text-purple-900 font-semibold text-sm inline-flex items-center border-b-2 border-purple-700">
              View All
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* All Packages */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">All Packages</h2>
          
          <div className="space-y-3">
            {packages.slice(0, 22).map((pkg, index) => (
              <Link
                key={index}
                href={`/package/${pkg.name}`}
                className="block text-gray-700 hover:text-gray-900 underline text-base"
              >
                {pkg.identifier}
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-8 flex items-center justify-center space-x-4 text-sm">
            <button className="text-gray-400">←</button>
            <button className="text-purple-700 font-bold">1</button>
            <button className="text-gray-700">2</button>
            <button className="text-gray-700">3</button>
            <button className="text-gray-700">4</button>
            <button className="text-gray-700">5</button>
            <span className="text-gray-700">...</span>
            <button className="text-gray-700">21</button>
            <button className="text-gray-700">→</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}