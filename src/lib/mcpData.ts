import fs from 'fs';
import path from 'path';
import type { MCPData } from '@/types/mcp';

// Re-export types for convenience
export type { MCPData, Version, SecurityReview, Vulnerability } from '@/types/mcp';

/**
 * Load MCP data for a specific package by searching through JSON files
 */
export function loadMCPData(packageName: string): MCPData | null {
  try {
    const mcpsDataDir = path.join(process.cwd(), 'mcps-data');
    
    // Check if directory exists
    if (!fs.existsSync(mcpsDataDir)) {
      console.warn('mcps-data directory not found');
      return null;
    }

    // Read all JSON files in the directory
    const files = fs.readdirSync(mcpsDataDir).filter(file => file.endsWith('.json'));
    
  for (const file of files) {
    const filePath = path.join(mcpsDataDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data: MCPData = JSON.parse(content);
    
    // Extract date from filename (format: name_timestamp.json)
    const dateMatch = file.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
    if (dateMatch) {
      // Convert filename timestamp to ISO format
      data._fileDate = dateMatch[1].replace(/-(\d{2})-(\d{2})-(\d{3})Z?/, 'T$1:$2:$3Z').replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3');
    }
    
    // Check if this is the package we're looking for
    // Match by name or identifier
    const normalizedPackageName = packageName.toLowerCase().replace(/[-_]/g, '');
    const normalizedDataName = data.name.toLowerCase().replace(/[-_\s]/g, '');
    const identifierParts = data.identifier.split('/');
    const lastIdentifierPart = identifierParts[identifierParts.length - 1].toLowerCase().replace(/[-_]/g, '');
    
    if (
      normalizedDataName === normalizedPackageName ||
      lastIdentifierPart === normalizedPackageName ||
      data.identifier.toLowerCase().includes(packageName.toLowerCase())
    ) {
      return data;
    }
  }
    
    return null;
  } catch (error) {
    console.error('Error loading MCP data:', error);
    return null;
  }
}

/**
 * Get all available MCP packages
 */
export function getAllMCPData(): MCPData[] {
  try {
    const mcpsDataDir = path.join(process.cwd(), 'mcps-data');
    
    if (!fs.existsSync(mcpsDataDir)) {
      return [];
    }

    const files = fs.readdirSync(mcpsDataDir).filter(file => file.endsWith('.json'));
    const allData: MCPData[] = [];
    
    for (const file of files) {
      const filePath = path.join(mcpsDataDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const data: MCPData = JSON.parse(content);
      
      // Extract date from filename (format: name_timestamp.json)
      const dateMatch = file.match(/(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2})/);
      if (dateMatch) {
        // Convert filename timestamp to ISO format
        data._fileDate = dateMatch[1].replace(/-(\d{2})-(\d{2})-(\d{3})Z?/, 'T$1:$2:$3Z').replace(/T(\d{2})-(\d{2})-(\d{2})/, 'T$1:$2:$3');
      }
      
      allData.push(data);
    }
    
    return allData;
  } catch (error) {
    console.error('Error loading all MCP data:', error);
    return [];
  }
}

// Re-export utility functions
export { calculateOverallScore, getSeverityColor, getScoreColor } from '@/types/mcp';

