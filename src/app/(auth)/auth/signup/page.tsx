'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      router.push('/dashboard')
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

      <div className="rounded-2xl p-8 border" style={{
        background: 'var(--navy-900)',
        borderColor: 'var(--border-normal)',
      }}>
        <h1 className="text-xl font-semibold mb-6">Create your account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Full name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
              placeholder="Ali Khan"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--navy-800)',
                border: '1px solid var(--border-normal)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

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
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
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
              placeholder="Min. 8 characters"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
              style={{
                background: 'var(--navy-800)',
                border: '1px solid var(--border-normal)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          <div>
            <label className="block text-sm mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              placeholder="Repeat password"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none"
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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-sm text-center mt-5" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium" style={{ color: 'var(--brand-gold)' }}>
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-xs text-center mt-6" style={{ color: 'var(--text-muted)' }}>
        Data provided by Capital Stake · CS Solutions (Pvt) Ltd
      </p>
    </div>
  )
}
