'use client';

import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SecurityReview, getScoreColor, calculateOverallScore } from '@/types/mcp';

interface SecurityScoreProps {
  securityReview: SecurityReview;
}

export default function SecurityScore({ securityReview }: SecurityScoreProps) {
  const { scores, isMalicious, weeklyDownloads, trend, vulnerabilities } = securityReview;
  
  // Use the centralized calculation function that inverts vulnerability score
  const overallScore = calculateOverallScore(scores);

  const getTrendIcon = () => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'decreasing':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  // Helper to get color for vulnerability score (inverted: 0=good/green, 100=bad/red)
  const getVulnerabilityScoreColor = (score: number): string => {
    if (score <= 20) return 'text-green-600';
    if (score <= 40) return 'text-yellow-600';
    if (score <= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const scoreItems = [
    { label: 'Supply Chain', value: scores.supplyChainSecurity, isVulnerability: false },
    { label: 'Vulnerability', value: scores.vulnerability, isVulnerability: true },
    { label: 'Quality', value: scores.quality, isVulnerability: false },
    { label: 'Maintainability', value: scores.maintainabile, isVulnerability: false },
    { label: 'License', value: scores.license, isVulnerability: false },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Security Score
        </h3>
        {isMalicious && (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
            ⚠️ Malicious
          </span>
        )}
      </div>

      {/* Overall Score */}
      <div className="text-center py-4 bg-gray-50 rounded-lg">
        <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
          {overallScore}
        </div>
        <div className="text-sm text-gray-600 mt-1">Overall Score</div>
      </div>

      {/* Individual Scores */}
      <div className="space-y-3">
        {scoreItems.map((item) => (
          <div key={item.label}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700">{item.label}</span>
              <span className={`font-semibold ${
                item.isVulnerability 
                  ? getVulnerabilityScoreColor(item.value)
                  : getScoreColor(item.value)
              }`}>
                {item.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  item.isVulnerability
                    // Inverted colors for vulnerability: low=good/green, high=bad/red
                    ? (item.value <= 20
                        ? 'bg-green-500'
                        : item.value <= 40
                        ? 'bg-yellow-500'
                        : item.value <= 60
                        ? 'bg-orange-500'
                        : 'bg-red-500')
                    // Normal colors for other metrics: high=good/green, low=bad/red
                    : (item.value >= 80
                        ? 'bg-green-500'
                        : item.value >= 60
                        ? 'bg-yellow-500'
                        : item.value >= 40
                        ? 'bg-orange-500'
                        : 'bg-red-500')
                }`}
                style={{ width: `${item.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Weekly Downloads</span>
          <span className="font-semibold text-gray-900">
            {weeklyDownloads.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Trend</span>
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            <span className="font-semibold text-gray-900 capitalize">{trend}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Vulnerabilities</span>
          <span className="font-semibold text-red-600">
            {vulnerabilities.length}
          </span>
        </div>
      </div>
    </div>
  );
}

