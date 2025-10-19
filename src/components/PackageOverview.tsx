'use client';

import { Copy, ExternalLink, Calendar, Download, User, Tag } from "lucide-react";

interface PackageOverviewProps {
  packageData: {
    name: string;
    description: string;
    version: string;
    author: string;
    lastUpdated: string;
    weeklyDownloads: number;
    securityScores: {
      supplyChain: number;
      vulnerability: number;
      quality: number;
      maintenance: number;
      license: number;
    };
    warnings: Array<{
      type: string;
      message: string;
      category: string;
    }>;
    maintainers: Array<{
      name: string;
      avatar: string;
    }>;
    keywords: string[];
    installCommand: string;
  };
}

export default function PackageOverview({ packageData }: PackageOverviewProps) {
  const { securityScores, warnings, maintainers, keywords, installCommand } = packageData;

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-5">
        {/* Package Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {packageData.name}
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-4xl">
            {packageData.description}
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Package</span>
            </button>
            <button className="bg-gray-100 text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Security Scores */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Security Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-green-600">{securityScores.supplyChain}</span>
                </div>
                <div className="text-sm text-gray-600">Supply Chain Security</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-yellow-600">{securityScores.vulnerability}</span>
                </div>
                <div className="text-sm text-gray-600">Vulnerability</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-orange-600">{securityScores.quality}</span>
                </div>
                <div className="text-sm text-gray-600">Quality</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-red-600">{securityScores.maintenance}</span>
                </div>
                <div className="text-sm text-gray-600">Maintenance</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-gray-600">{securityScores.license}</span>
                </div>
                <div className="text-sm text-gray-600">License</div>
              </div>
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-4">
                {warnings.map((warning, index) => (
                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-yellow-600 text-sm">⚠</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{warning.type}</h4>
                          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs font-medium rounded">
                            {warning.category}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{warning.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Package Info */}
          <div className="space-y-6">
            {/* Version Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{packageData.version}</div>
                  <div className="text-sm text-gray-600">Version published</div>
                  <div className="text-sm text-gray-500">{packageData.lastUpdated}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{packageData.weeklyDownloads.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Weekly downloads</div>
                  <div className="text-sm text-green-600">↗ 0.5%</div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="text-sm text-gray-600 mb-1">Created</div>
                <div className="text-sm text-gray-900">{packageData.lastUpdated}</div>
              </div>
              <button className="w-full mt-4 bg-gray-100 text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                View All Versions
              </button>
            </div>

            {/* Maintainers */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Maintainers</h4>
              <div className="space-y-3">
                {maintainers.map((maintainer, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {maintainer.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{maintainer.name}</div>
                      <div className="text-sm text-gray-500">Maintainer</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    {keyword}
                  </span>
                ))}
                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                  +2 more
                </span>
              </div>
            </div>

            {/* Install Command */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Install</h4>
              <div className="bg-gray-900 text-white p-4 rounded-lg font-mono text-sm flex items-center justify-between">
                <code>{installCommand}</code>
                <button className="text-gray-400 hover:text-white">
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
