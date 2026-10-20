'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { label: 'Dashboard',  href: '/dashboard' },
  { label: 'Macro',      href: '/dashboard/macro' },
  { label: 'Stocks',     href: '/dashboard/stocks' },
  { label: 'News',       href: '/dashboard/news' },
  { label: 'Indices',    href: '/dashboard/indices' },
  { label: 'Charts',     href: '/dashboard/charts' },
  { label: 'Portfolio',  href: '/dashboard/portfolio' },
  { label: 'Reports',    href: '/dashboard/reports' },
]

const MORE_ITEMS = [
  { label: 'Screener',    href: '/dashboard/screener' },
  { label: 'Heatmap',     href: '/dashboard/heatmap' },
  { label: 'Watchlist',   href: '/dashboard/watchlist' },
  { label: 'Tools',       href: '/dashboard/tools' },
  { label: 'Alerts',      href: '/dashboard/alerts' },
  { label: 'FIPI / LIPI', href: '/dashboard/fipi-lipi' },
]

const ALL_ITEMS = [...NAV_ITEMS, ...MORE_ITEMS]

interface Props {
  userEmail: string
  userName?: string
  theme: 'light' | 'dark'
  onThemeToggle: () => void
}

export default function UserNavbar({ userEmail, userName, theme, onThemeToggle }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const [moreOpen,    setMoreOpen]    = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const moreRef    = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const dark = theme === 'dark'

  // close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (moreRef.current    && !moreRef.current.contains(e.target as Node))    setMoreOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href)

  const moreActive  = MORE_ITEMS.some(n => isActive(n.href))
  const initials    = (userName ?? userEmail).slice(0, 2).toUpperCase()

  const navTextColor   = dark ? '#CBD5E1' : '#374151'
  const navActiveColor = '#D97706'
  const navHoverColor  = dark ? '#F1F5F9' : '#111827'
  const dropdownBg     = dark ? '#0D1426' : '#FFFFFF'
  const dropdownBorder = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
  const dropdownShadow = dark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)'
  const headerBg       = dark ? 'rgba(8,13,28,0.98)' : '#FAFAF8'
  const borderColor    = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'
  const mobileBg       = dark ? '#080D1C' : '#FFFFFF'

  return (
    <>
      <header className="sticky top-0 z-50" style={{ background: headerBg, borderBottom: `1px solid ${borderColor}`, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 70, gap: 12 }}>

            {/* â”€â”€ Logo â”€â”€ */}
            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>S</span>
              </div>
              <div className="navbar-logo-text">
                <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.03em', color: dark ? '#F1F5F9' : '#111827' }}>Stockifyy</span>
                <div style={{ fontSize: 10, color: 'var(--brand-gold)', marginTop: -2, letterSpacing: '0.02em', fontWeight: 500 }}>PSX Data Portal</div>
              </div>
            </Link>

            {/* â”€â”€ Desktop nav â”€â”€ */}
            <nav className="navbar-desktop" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
              {NAV_ITEMS.map(item => {
                const active = isActive(item.href)
                return (
                  <Link key={item.href} href={item.href} style={{
                    padding: '6px 11px', fontSize: 15, fontWeight: active ? 600 : 450,
                    color: active ? navActiveColor : navTextColor,
                    textDecoration: 'none', borderRadius: 6, whiteSpace: 'nowrap',
                    transition: 'color 0.15s', letterSpacing: '-0.01em',
                  }}
                    onMouseEnter={e => { if (!active) (e.target as HTMLElement).style.color = navHoverColor }}
                    onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.color = navTextColor }}
                  >{item.label}</Link>
                )
              })}

              {/* More dropdown */}
              <div ref={moreRef} style={{ position: 'relative' }}>
                <button onClick={() => setMoreOpen(v => !v)} style={{
                  display: 'flex', alignItems: 'center', gap: 4, padding: '6px 11px',
                  fontSize: 15, fontWeight: moreActive ? 600 : 450,
                  color: moreActive ? navActiveColor : navTextColor,
                  background: 'none', border: 'none', cursor: 'pointer', borderRadius: 6,
                  letterSpacing: '-0.01em', transition: 'color 0.15s', whiteSpace: 'nowrap',
                }}
                  onMouseEnter={e => { if (!moreActive) (e.currentTarget).style.color = navHoverColor }}
                  onMouseLeave={e => { if (!moreActive) (e.currentTarget).style.color = moreActive ? navActiveColor : navTextColor }}
                >
                  More
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
                    style={{ transition: 'transform 0.15s', transform: moreOpen ? 'rotate(180deg)' : 'none' }}>
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {moreOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', left: 0,
                    minWidth: 180, borderRadius: 12, overflow: 'hidden', padding: '4px',
                    background: dropdownBg, border: `1px solid ${dropdownBorder}`,
                    boxShadow: dropdownShadow, zIndex: 100,
                  }}>
                    {MORE_ITEMS.map(item => {
                      const active = isActive(item.href)
                      return (
                        <Link key={item.href} href={item.href} onClick={() => setMoreOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '9px 14px', borderRadius: 8, fontSize: 15,
                            fontWeight: active ? 600 : 400, color: active ? navActiveColor : navTextColor,
                            textDecoration: 'none', transition: 'background 0.1s',
                          }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                          {item.label}
                          {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-gold)', display: 'inline-block' }} />}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </nav>

            {/* â”€â”€ Right side â”€â”€ */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>

              {/* Profile avatar â€” desktop */}
              <div ref={profileRef} className="navbar-desktop" style={{ position: 'relative' }}>
                <button onClick={() => setProfileOpen(v => !v)} title={userName ?? userEmail}
                  style={{
                    width: 34, height: 34, borderRadius: '50%', background: '#D97706',
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff',
                  }}>
                  {initials}
                </button>
                {profileOpen && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                    width: 220, borderRadius: 12, overflow: 'hidden',
                    background: dropdownBg, border: `1px solid ${dropdownBorder}`,
                    boxShadow: dropdownShadow, zIndex: 100,
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${dropdownBorder}` }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: dark ? '#F1F5F9' : '#111827', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {userName ?? userEmail.split('@')[0]}
                      </div>
                      <div style={{ fontSize: 12, color: navTextColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>
                    </div>
                    <button onClick={() => { onThemeToggle(); setProfileOpen(false) }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: navTextColor }}
                      onMouseEnter={e => (e.currentTarget).style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                      onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                    >
                      <span>{dark ? 'Switch to Light' : 'Switch to Dark'}</span>
                      <span style={{ fontSize: 15 }}>{dark ? 'â˜€ï¸' : 'ðŸŒ™'}</span>
                    </button>
                    <Link href="/dashboard/settings" onClick={() => setProfileOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', textDecoration: 'none', fontSize: 15, color: navTextColor }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <span>Settings</span>
                    </Link>
                    <div style={{ borderTop: `1px solid ${dropdownBorder}` }} />
                    <button onClick={signOut}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--red-loss)' }}
                      onMouseEnter={e => (e.currentTarget).style.background = 'rgba(220,38,38,0.06)'}
                      onMouseLeave={e => (e.currentTarget).style.background = 'transparent'}
                    >
                      <span>Sign out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Hamburger â€” mobile only */}
              <button className="navbar-hamburger" onClick={() => setMobileOpen(v => !v)}
                style={{
                  display: 'none', flexDirection: 'column', justifyContent: 'center',
                  alignItems: 'center', gap: 5, width: 36, height: 36,
                  background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                }}>
                <span style={{ display: 'block', width: 20, height: 2, background: navTextColor, borderRadius: 2, transition: 'all 0.2s', transform: mobileOpen ? 'translateY(7px) rotate(45deg)' : 'none' }} />
                <span style={{ display: 'block', width: 20, height: 2, background: navTextColor, borderRadius: 2, opacity: mobileOpen ? 0 : 1, transition: 'all 0.2s' }} />
                <span style={{ display: 'block', width: 20, height: 2, background: navTextColor, borderRadius: 2, transition: 'all 0.2s', transform: mobileOpen ? 'translateY(-7px) rotate(-45deg)' : 'none' }} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* â”€â”€ Mobile drawer â”€â”€ */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 49,
          background: 'rgba(0,0,0,0.4)',
        }} onClick={() => setMobileOpen(false)} />
      )}
      <div style={{
        position: 'fixed', top: 56, right: 0, bottom: 0,
        width: 280, background: mobileBg,
        borderLeft: `1px solid ${borderColor}`,
        zIndex: 49, overflowY: 'auto',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.25s ease',
      }} className="navbar-mobile-drawer">
        <div style={{ padding: '8px 0' }}>
          {/* User info */}
          <div style={{ padding: '12px 20px 14px', borderBottom: `1px solid ${dropdownBorder}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: dark ? '#F1F5F9' : '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {userName ?? userEmail.split('@')[0]}
                </p>
                <p style={{ fontSize: 11, color: navTextColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</p>
              </div>
            </div>
          </div>

          {/* All nav links */}
          <div style={{ padding: '8px 12px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: navTextColor, padding: '8px 8px 4px' }}>Navigation</p>
            {ALL_ITEMS.map(item => {
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 8, fontSize: 14,
                    fontWeight: active ? 600 : 400,
                    color: active ? navActiveColor : navTextColor,
                    textDecoration: 'none', marginBottom: 2,
                    background: active ? (dark ? 'rgba(217,119,6,0.1)' : 'rgba(217,119,6,0.08)') : 'transparent',
                  }}
                >
                  {item.label}
                  {active && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--brand-gold)' }} />}
                </Link>
              )
            })}
          </div>

          {/* Actions */}
          <div style={{ padding: '8px 12px', borderTop: `1px solid ${dropdownBorder}`, marginTop: 4 }}>
            <button onClick={() => { onThemeToggle(); setMobileOpen(false) }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: navTextColor }}
            >
              <span>{dark ? 'Switch to Light' : 'Switch to Dark'}</span>
              <span>{dark ? 'â˜€ï¸' : 'ðŸŒ™'}</span>
            </button>
            <button onClick={() => { signOut(); setMobileOpen(false) }}
              style={{ width: '100%', display: 'flex', alignItems: 'center', padding: '10px 12px', borderRadius: 8, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: 'var(--red-loss)' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

