'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Role } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: string
}

const SUPERADMIN_NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/superadmin/dashboard', icon: '⬡' },
  { label: 'Users',       href: '/superadmin/users',     icon: '◈' },
  { label: 'Admins',      href: '/superadmin/admins',    icon: '◇' },
  { label: 'Settings',    href: '/superadmin/settings',  icon: '◎' },
  { label: 'Audit Log',   href: '/superadmin/audit',     icon: '◉' },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard',   href: '/admin/dashboard',      icon: '⬡' },
  { label: 'Market',      href: '/admin/market',         icon: '◈' },
  { label: 'Users',       href: '/admin/users',          icon: '◇' },
  { label: 'Reports',     href: '/admin/reports',        icon: '◎' },
]

interface Props {
  role: Role
  userEmail: string
  userName?: string
}

export default function Sidebar({ role, userEmail, userName }: Props) {
  const pathname = usePathname()
  const router = useRouter()
  const nav = role === 'superadmin' ? SUPERADMIN_NAV : ADMIN_NAV
  const roleLabel = role === 'superadmin' ? 'Super Admin' : 'Admin'
  const roleBadgeColor = role === 'superadmin' ? '#7C3AED' : '#0891B2'

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className="flex flex-col h-screen w-60 shrink-0 border-r"
           style={{
             background: 'var(--navy-900)',
             borderColor: 'var(--border-subtle)',
           }}>

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b"
           style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
             style={{ background: 'var(--brand-gold)' }}>
          <span className="text-xs font-bold" style={{ color: '#080D1C' }}>S</span>
        </div>
        <div>
          <span className="font-bold text-base" style={{ color: 'var(--brand-gold)' }}>Stockifyy</span>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>PSX Portal</p>
        </div>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: roleBadgeColor + '22', color: roleBadgeColor, border: `1px solid ${roleBadgeColor}44` }}>
          {roleLabel}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {nav.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors mx-2 rounded-lg"
              style={{
                color: active ? 'var(--brand-gold)' : 'var(--text-secondary)',
                background: active ? 'rgba(245,166,35,0.1)' : 'transparent',
                fontWeight: active ? 600 : 400,
              }}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User info + sign out */}
      <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
               style={{ background: 'var(--navy-700)', color: 'var(--brand-gold)' }}>
            {(userName ?? userEmail)[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            {userName && <p className="text-sm font-medium truncate">{userName}</p>}
            <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-sm py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border-normal)' }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
