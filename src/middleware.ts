import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const LEGACY_MICROSITES = new Set(['BARS2016', 'BARS2018', 'SBRS2014'])

function hasFileExtension(pathname: string): boolean {
  return /\/[^/]+\.[^/]+$/.test(pathname)
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) {
    return NextResponse.next()
  }

  const microsite = parts[0]
  if (!LEGACY_MICROSITES.has(microsite) || hasFileExtension(pathname)) {
    return NextResponse.next()
  }

  const targetPath = parts.length === 1
    ? `/${microsite}/index.html`
    : `/${microsite}/${parts.slice(1).join('/')}/index.html`

  const url = request.nextUrl.clone()
  url.pathname = targetPath
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ['/BARS2016/:path*', '/BARS2018/:path*', '/SBRS2014/:path*'],
}
