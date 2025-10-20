'use client';

import { Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { SecurityReview, getScoreColor, calculateOverallScore } from '@/types/mcp';

interface SecurityScoreProps {
  securityReview: SecurityReview;
}

export default function SecurityScore({ securityReview }: SecurityScoreProps) {
  const { scores, isMalicious, weeklyDownloads, trend, vulnerabilities } = securityReview;
  
  // Calculate overall score (all scores now use same scale: 100=good, 0=bad)
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

  const scoreItems = [
    { label: 'Supply Chain', value: scores.supplyChainSecurity },
    { label: 'Vulnerability', value: scores.vulnerability },
    { label: 'Quality', value: scores.quality },
    { label: 'Maintainability', value: scores.maintainabile },
    { label: 'License', value: scores.license },
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
              <span className={`font-semibold ${getScoreColor(item.value)}`}>
                {item.value}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  item.value >= 80
                    ? 'bg-green-500'
                    : item.value >= 60
                    ? 'bg-yellow-500'
                    : item.value >= 40
                    ? 'bg-orange-500'
                    : 'bg-red-500'
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

