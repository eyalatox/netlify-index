/**
 * Fetch README content from a GitHub repository
 */
export async function fetchGitHubReadme(repoUrl: string): Promise<string | null> {
  try {
    // Parse GitHub URL to get owner and repo
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = repoUrl.match(urlPattern);
    
    if (!match) {
      console.error('Invalid GitHub URL format');
      return null;
    }
    
    const [, owner, repo] = match;
    
    // Try to fetch README from GitHub API
    // First try README.md, then Readme.md, then readme.md
    const readmeVariants = ['README.md', 'Readme.md', 'readme.md', 'README.MD', 'README'];
    
    for (const variant of readmeVariants) {
      try {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${variant}`;
        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw',
            // Add GitHub token if available (optional, increases rate limit)
            ...(process.env.GITHUB_TOKEN && {
              'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`
            })
          },
          // Add cache control for better performance
          next: { revalidate: 3600 } // Revalidate every hour
        });
        
        if (response.ok) {
          return await response.text();
        }
      } catch (error) {
        // Continue to next variant
        continue;
      }
    }
    
    // If API fails, try raw GitHub content
    for (const variant of readmeVariants) {
      try {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${variant}`;
        const response = await fetch(rawUrl, {
          next: { revalidate: 3600 }
        });
        
        if (response.ok) {
          return await response.text();
        }
        
        // Also try 'master' branch if 'main' fails
        const masterUrl = `https://raw.githubusercontent.com/${owner}/${repo}/master/${variant}`;
        const masterResponse = await fetch(masterUrl, {
          next: { revalidate: 3600 }
        });
        
        if (masterResponse.ok) {
          return await masterResponse.text();
        }
      } catch (error) {
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching GitHub README:', error);
    return null;
  }
}

/**
 * Extract repository information from GitHub URL
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const urlPattern = /github\.com\/([^\/]+)\/([^\/]+)/;
    const match = url.match(urlPattern);
    
    if (!match) {
      return null;
    }
    
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  } catch (error) {
    return null;
  }
}

