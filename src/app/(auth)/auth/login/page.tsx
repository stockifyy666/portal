'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError(authError.message)
        return
      }

      // Fetch role and redirect
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()

      const role = profile?.role ?? 'user'
      if (role === 'superadmin') router.push('/superadmin/dashboard')
      else if (role === 'admin') router.push('/admin/dashboard')
      else router.push('/dashboard')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
               style={{ background: 'var(--brand-gold)' }}>
            <span className="text-sm font-bold" style={{ color: '#080D1C' }}>S</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: 'var(--brand-gold)' }}>Stockifyy</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>PSX Data Portal</p>
      </div>

      {/* Card */}
      <div className="rounded-2xl p-8 border" style={{
        background: 'var(--navy-900)',
        borderColor: 'var(--border-normal)',
      }}>
        <h1 className="text-xl font-semibold mb-6">Sign in to your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: 'var(--navy-800)',
                border: '1px solid var(--border-normal)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: 'var(--navy-800)',
                border: '1px solid var(--border-normal)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {error && (
            <p className="text-sm px-3 py-2 rounded-lg"
               style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--red-loss)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-sm transition-opacity disabled:opacity-60"
            style={{ background: 'var(--brand-gold)', color: '#080D1C' }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: 'var(--text-muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="font-medium" style={{ color: 'var(--brand-gold)' }}>
            Sign up
          </Link>
        </p>
      </div>

      {/* Attribution */}
      <p className="text-xs text-center mt-6" style={{ color: 'var(--text-muted)' }}>
        Data provided by Capital Stake · CS Solutions (Pvt) Ltd
      </p>
    </div>
  )
}
