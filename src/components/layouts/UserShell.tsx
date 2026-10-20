'use client'

import { ThemeProvider, useTheme } from './ThemeProvider'
import UserNavbar from './UserNavbar'
import { Toaster } from 'react-hot-toast'

interface Props {
  userEmail: string
  userName?: string
  children: React.ReactNode
}

function ShellInner({ userEmail, userName, children }: Props) {
  const { theme, toggle } = useTheme()
  return (
    <div className="min-h-screen" style={{ background: 'var(--navy-950)' }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: 8,
            background: 'var(--navy-900)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            fontSize: 13,
            fontFamily: 'var(--font-sans)',
          },
          success: { iconTheme: { primary: '#16A34A', secondary: '#fff' } },
          error:   { iconTheme: { primary: '#DC2626', secondary: '#fff' } },
        }}
      />
      <UserNavbar
        userEmail={userEmail}
        userName={userName}
        theme={theme}
        onThemeToggle={toggle}
      />
      <main style={{ maxWidth: 1440, margin: '0 auto', padding: '24px 16px' }}>
        {children}
      </main>
      <footer className="border-t mt-12 py-4 text-center text-xs"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
        Data provided by{' '}
        <a href="https://www.capitalstake.com" target="_blank" rel="noopener noreferrer"
           style={{ color: 'var(--brand-gold)' }}>
          Capital Stake
        </a>{' '}
        · CS Solutions (Pvt) Ltd · PSX Licensed Data
      </footer>
    </div>
  )
}

export default function UserShell({ userEmail, userName, children }: Props) {
  return (
    <ThemeProvider>
      <ShellInner userEmail={userEmail} userName={userName}>
        {children}
      </ShellInner>
    </ThemeProvider>
  )
}
