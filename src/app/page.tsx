import { Search, Star } from "lucide-react";
import Link from "next/link";

// Mock data for packages
const packages = [
  {
    id: 1,
    name: "example-mcp-server",
    author: "modelcontextprotocol",
    description: "Example implementation demonstrating core Model Context Protocol features",
    tags: ["example", "demo"],
    category: "Other Servers",
    stats: { weekly: 10, total: 50 },
    updated: "2 days ago"
  },
  {
    id: 2,
    name: "example-servers-php",
    author: "modelcontextprotocol", 
    description: "Example servers showcasing Model Context Protocol implementation in PHP",
    tags: ["php", "servers"],
    category: "Other Servers",
    stats: { weekly: 10, total: 100 },
    updated: "2 days ago"
  },
  {
    id: 3,
    name: "example-servers-python",
    author: "modelcontextprotocol",
    description: "Python server examples for Model Context Protocol development",
    tags: ["python", "servers"],
    category: "Other Servers", 
    stats: { weekly: 50, total: 150 },
    updated: "2 days ago"
  },
  {
    id: 4,
    name: "everything-mcp",
    author: "modelcontextprotocol",
    description: "Comprehensive collection of Model Context Protocol implementations", 
    tags: ["comprehensive", "collection"],
    category: "Other Servers",
    stats: { weekly: 50, total: 10 },
    updated: "2 days ago"
  }
];

const categories = [
  "Other Servers", "Data Sources", "Other Servers", "Other Servers", "Other Servers", "Other Servers",
  "Other Servers", "Other Servers", "Other Servers", "Other Servers", "Other Servers", "Other Servers",
  "Other Servers", "Other Servers", "Other Servers", "Other Servers", "Other Servers", "Other Servers"
];

const stats = { total: 14914, weekly: 50, daily: 50, monthly: 100 };

export default function Home() {
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
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
              <div>Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.weekly}</div>
              <div>Weekly</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.daily}</div>
              <div>Daily</div>
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
            {categories.slice(0, 18).map((category, index) => (
              <Link 
                key={index}
                href={`/category/${category.toLowerCase().replace(' ', '-')}`}
                className="p-4 border border-gray-200 rounded-lg text-center hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-lg mx-auto mb-2"></div>
                <div className="text-sm font-medium text-gray-900">{category}</div>
                <div className="text-xs text-gray-500">MCP Server</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/categories" className="text-blue-600 hover:text-blue-800 font-medium">
              View all →
            </Link>
          </div>
        </section>

        {/* All Packages */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Packages</h2>
          <div className="space-y-4">
            {packages.map((pkg) => (
              <Link 
                key={pkg.id}
                href={`/package/${pkg.name}`}
                className="block p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                      <span className="text-sm text-gray-500">by {pkg.author}</span>
                    </div>
                    <p className="text-gray-600 mb-3">{pkg.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded">{pkg.category}</span>
                      <span>Weekly: {pkg.stats.weekly}</span>
                      <span>Total: {pkg.stats.total}</span>
                      <span>Updated {pkg.updated}</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-yellow-500">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}