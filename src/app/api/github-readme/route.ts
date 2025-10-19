import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubReadme } from '@/lib/githubFetcher';

// Mark this route as dynamic (not statically generated)
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'GitHub URL is required' },
        { status: 400 }
      );
    }

    const content = await fetchGitHubReadme(url);

    if (!content) {
      return NextResponse.json(
        { error: 'README not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching GitHub README:', error);
    return NextResponse.json(
      { error: 'Failed to fetch README' },
      { status: 500 }
    );
  }
}

