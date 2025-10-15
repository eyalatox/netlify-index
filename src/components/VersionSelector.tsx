'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Version } from '@/types/mcp';
import VulnerabilityCard from './VulnerabilityCard';
import { AlertTriangle } from 'lucide-react';

interface VersionSelectorProps {
  versions: Version[];
  packageName: string;
  currentVersion?: string;
}

export default function VersionSelector({ versions, packageName, currentVersion }: VersionSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedVersion, setSelectedVersion] = useState(currentVersion || versions[0].version);
  
  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);
    // Navigate to version-specific URL
    if (newVersion === versions[0].version) {
      // Latest version - go to base package URL
      router.push(`/package/${packageName}`);
    } else {
      // Specific version - go to versioned URL
      router.push(`/package/${packageName}/${newVersion}`);
    }
  };
  
  const versionData = versions.find(v => v.version === selectedVersion) || versions[0];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Security Analysis</h2>
        <select 
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedVersion}
          onChange={(e) => handleVersionChange(e.target.value)}
        >
          {versions.map((version) => (
            <option key={version.version} value={version.version}>
              Version {version.version}
            </option>
          ))}
        </select>
      </div>

      {/* Vulnerabilities Warning Banner */}
      {versionData.securityReview?.vulnerabilities && 
       versionData.securityReview.vulnerabilities.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 mb-1">
                Security Alert
              </h3>
                <p className="text-sm text-red-700">
                  This version has {versionData.securityReview.vulnerabilities.length} known {versionData.securityReview.vulnerabilities.length === 1 ? 'vulnerability' : 'vulnerabilities'}.
                Review the details below before installing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Vulnerabilities List */}
      {versionData.securityReview?.vulnerabilities && 
       versionData.securityReview.vulnerabilities.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Known Vulnerabilities ({versionData.securityReview.vulnerabilities.length})
          </h3>
          <div className="space-y-3">
            {versionData.securityReview.vulnerabilities.map((vuln, index) => (
              <VulnerabilityCard 
                key={vuln.id} 
                vulnerability={vuln} 
                index={index} 
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <div className="text-green-800 font-semibold mb-2">
            ✓ No Known Vulnerabilities
          </div>
          <p className="text-sm text-green-700">
            This version has passed security analysis with no detected vulnerabilities.
          </p>
        </div>
      )}
    </div>
  );
}

