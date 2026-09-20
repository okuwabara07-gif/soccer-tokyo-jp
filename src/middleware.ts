import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

let redirectsCache: Array<{ from_path: string; to_path: string; status: number }> = [];
let cacheTime = 0;

async function getRedirects() {
  const now = Date.now();
  if (now - cacheTime < 3600000) {
    return redirectsCache;
  }

  try {
    const { data } = await supabase
      .from('redirects')
      .select('from_path,to_path,status');
    if (data) {
      redirectsCache = data;
      cacheTime = now;
    }
  } catch (err) {
    console.error('Failed to fetch redirects:', err);
  }

  return redirectsCache;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const redirects = await getRedirects();

  for (const redirect of redirects) {
    if (pathname === redirect.from_path) {
      const status = redirect.status || 301;
      return NextResponse.redirect(new URL(redirect.to_path, request.url), { status });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
