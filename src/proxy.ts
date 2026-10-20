import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { rateLimit, rateLimitAuth } from '@/lib/ratelimit'
import type { Role } from '@/types'

const ROLE_ROUTES: Record<string, Role[]> = {
  '/superadmin': ['superadmin'],
  '/admin':      ['superadmin', 'admin'],
  '/dashboard':  ['superadmin', 'admin', 'user'],
}

const AUTH_PATHS = ['/auth/login', '/auth/signup']

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const SUPABASE_READY = SUPABASE_URL.startsWith('http') && SUPABASE_ANON.length > 0

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

  // ── Rate limiting ────────────────────────────────────────────────────────
  // Skip rate limiting for localhost (dev environment)
  const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip === 'localhost'
  const isAuthRoute = AUTH_PATHS.some(p => pathname.startsWith(p))
  // Only rate-limit POST/PUT/PATCH on auth routes — not page loads (GET)
  const applyAuthLimit = !isLocalhost && isAuthRoute && request.method !== 'GET'
  const { allowed, remaining, resetMs } = (isLocalhost)
    ? { allowed: true, remaining: 999, resetMs: 0 }
    : applyAuthLimit
      ? rateLimitAuth(ip)
      : rateLimit(ip)

  if (!allowed) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'X-RateLimit-Limit': applyAuthLimit ? '10' : '60',
        'X-RateLimit-Remaining': '0',
        'Retry-After': String(Math.ceil(resetMs / 1000)),
      },
    })
  }

  // Skip Supabase checks if not configured (local dev without .env)
  if (!SUPABASE_READY) {
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Remaining', String(remaining))
    return response
  }

  // ── Build response and wire Supabase cookie refresh ──────────────────────
  let response = NextResponse.next({
    request: { headers: request.headers },
  })
  response.headers.set('X-RateLimit-Remaining', String(remaining))

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request: { headers: request.headers } })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // ── Public auth pages: redirect if already logged in ─────────────────────
  if (isAuthRoute) {
    if (user) {
      const role = await getUserRole(supabase, user.id)
      return NextResponse.redirect(new URL(roleHomePath(role), request.url))
    }
    return response
  }

  // ── Protected routes ──────────────────────────────────────────────────────
  const protectedPrefix = Object.keys(ROLE_ROUTES).find(p => pathname.startsWith(p))

  if (protectedPrefix) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    const role = await getUserRole(supabase, user.id)
    const allowedRoles = ROLE_ROUTES[protectedPrefix]

    if (!allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL(roleHomePath(role), request.url))
    }

    // Redirect admin/superadmin away from the user dashboard to their panel
    if (protectedPrefix === '/dashboard' && (role === 'admin' || role === 'superadmin')) {
      return NextResponse.redirect(new URL(roleHomePath(role), request.url))
    }
  }

  return response
}

async function getUserRole(supabase: ReturnType<typeof createServerClient>, userId: string): Promise<Role> {
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', userId)
    .single()
  return (data?.role as Role) ?? 'user'
}

function roleHomePath(role: Role): string {
  if (role === 'superadmin') return '/superadmin/dashboard'
  if (role === 'admin') return '/admin/dashboard'
  return '/dashboard'
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
