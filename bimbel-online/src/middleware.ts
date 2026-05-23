import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = ['/admin', '/dashboard']
const publicRoutes = ['/login', '/register', '/']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
  const isPublicRoute = publicRoutes.includes(path)

  const sessionCookie = req.cookies.get('session')?.value
  const session = await decrypt(sessionCookie)

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // Admin route protection
  if (path.startsWith('/admin') && session?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  if (
    isPublicRoute &&
    session &&
    (path === '/login' || path === '/register')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
