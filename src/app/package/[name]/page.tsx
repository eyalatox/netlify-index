import { ArrowLeft, Star, Download, ExternalLink, Github, Users, Calendar, ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface PackagePageProps {
  params: Promise<{ name: string }>;
}

// Generate static paths for the packages we want to pre-render
export async function generateStaticParams() {
  return [
    { name: 'serverless' },
    { name: 'example-mcp-server' },
    { name: 'example-servers-php' },
    { name: 'example-servers-python' },
    { name: 'everything-mcp' },
  ];
}

export default async function PackagePage({ params }: PackagePageProps) {
  const { name } = await params;
  
  // Mock package data - in a real app this would come from an API
  const packageData = {
    name: "serverless",
    fullName: "@ox-security/serverless",
    version: "1.0.0",
    description: "The all-in-one application to monitor usage patterns and read data hosted files. There are subfolders to organize various types, one for each application type. Some are ready to be used as templates for new types of applications.",
    author: "ox-security",
    category: "Data Sources",
    tags: ["serverless", "monitoring", "templates"],
    stats: {
      weekly: 10,
      total: 500,
      starCount: 1,
      downloadCount: 500
    },
    lastUpdated: "3 days ago",
    maintainers: ["ox-security"],
    repository: "https://github.com/ox-security/serverless",
    homepage: "https://ox-security.com",
    license: "MIT",
    readme: {
      title1: "Title 1",
      content1: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      title2: "Title 2", 
      content2: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages.",
      title3: "Title 3",
      content3: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged."
    },
    faqs: [
      {
        question: "What is serverless?",
        answer: "Serverless is a cloud computing execution model where the cloud provider dynamically manages the allocation of machine resources."
      },
      {
        question: "Is serverless well-supported?",
        answer: "Yes, serverless is well-supported by major cloud providers including AWS, Google Cloud, and Microsoft Azure."
      }
    ]
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
          <span className="text-gray-900">{packageData.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Package Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{packageData.name}</h1>
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

            {/* README Content */}
            <div className="prose max-w-none space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{packageData.readme.title1}</h2>
                <p className="text-gray-700 leading-relaxed">{packageData.readme.content1}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{packageData.readme.title2}</h2>
                <p className="text-gray-700 leading-relaxed">{packageData.readme.content2}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">{packageData.readme.title3}</h2>
                <p className="text-gray-700 leading-relaxed">{packageData.readme.content3}</p>
              </div>
            </div>

            {/* FAQs */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
              <div className="space-y-4">
                {packageData.faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                    npm install {packageData.fullName}
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
                  <span className="text-gray-600">License</span>
                  <span className="font-medium">{packageData.license}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Weekly Downloads</span>
                  <span className="font-medium">{packageData.stats.weekly}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Downloads</span>
                  <span className="font-medium">{packageData.stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">{packageData.lastUpdated}</span>
                </div>
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