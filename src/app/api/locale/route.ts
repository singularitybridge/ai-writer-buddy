import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { locales, type Locale } from '@/i18n/config';

export async function POST(request: NextRequest) {
  const { locale } = await request.json();

  if (!locales.includes(locale as Locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const cookieStore = await cookies();
  cookieStore.set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });

  return NextResponse.json({ success: true, locale });
}

export async function GET() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('locale')?.value || 'he';
  return NextResponse.json({ locale });
}
