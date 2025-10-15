export interface Vulnerability {
  id: string;
  description: string;
  isOxOriginal: boolean;
  exploitationSteps: string;
  baseMetricV3: {
    cvssV3: {
      version: string;
      vectorString: string;
      attackVector: string;
      attackComplexity: string;
      privilegesRequired: string;
      userInteraction: string;
      scope: string;
      confidentialityImpact: string;
      integrityImpact: string;
      availabilityImpact: string;
      baseScore: number;
      baseSeverity: string;
    };
    exploitabilityScore: number;
    impactScore: number;
  };
  cwe: string;
  severity: string;
  category: string;
  location: {
    file: string;
    line: number;
    snippet: string;
  };
}

export interface SecurityReview {
  scores: {
    supplyChainSecurity: number;
    vulnerability: number;
    quality: number;
    maintainabile: number;
    license: number;
  };
  isMalicious: boolean;
  weeklyDownloads: number;
  trend: string;
  vulnerabilities: Vulnerability[];
}

export interface Version {
  version: string;
  license: string;
  releaseDate: string;
  securityReview: SecurityReview;
}

export interface MCPData {
  identifier: string;
  name: string;
  description: string;
  platform: string;
  firstReleaseDate: string;
  isOfficial: boolean;
  isCommunity: boolean;
  isHostable: boolean;
  repository: {
    provider: string;
    url: string;
  };
  versions: Version[];
  _fileDate?: string; // Date when the file was added to the directory
}

/**
 * Calculate overall security score from individual scores
 * Note: Vulnerability score is inverted (0=good, 100=bad) 
 * so we convert it to match other scores (100=good, 0=bad)
 */
export function calculateOverallScore(scores: SecurityReview['scores']): number {
  const weights = {
    supplyChainSecurity: 0.25,
    vulnerability: 0.30,
    quality: 0.20,
    maintainabile: 0.15,
    license: 0.10
  };
  
  // Invert vulnerability score: 0 vulnerabilities (score=0) should be 100 in final calculation
  const invertedVulnerabilityScore = 100 - scores.vulnerability;
  
  return Math.round(
    scores.supplyChainSecurity * weights.supplyChainSecurity +
    invertedVulnerabilityScore * weights.vulnerability +
    scores.quality * weights.quality +
    scores.maintainabile * weights.maintainabile +
    scores.license * weights.license
  );
}

/**
 * Get severity color for UI display
 */
export function getSeverityColor(severity: string | undefined): string {
  if (!severity) return 'bg-gray-100 text-gray-800 border-gray-300';
  
  switch (severity.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'LOW':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

/**
 * Get score color for UI display
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-600';
  return 'text-red-600';
}

