import { NextResponse } from 'next/server';
import { getBookWithDetails } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = getBookWithDetails(id);

  if (!book) {
    return NextResponse.json(
      { error: 'Book not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(book);
}
