import { NextRequest, NextResponse } from 'next/server';
import { loadMCPData } from '@/lib/mcpData';

// Mark this route as dynamic (not statically generated)
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params;
    const mcpData = loadMCPData(name);

    if (!mcpData) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(mcpData);
  } catch (error) {
    console.error('Error fetching package data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

