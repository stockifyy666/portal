import Link from 'next/link'
import { MdTrendingDown, MdArrowBack } from 'react-icons/md'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--navy-950)', padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 440 }}>

        {/* Large 404 */}
        <p style={{
          fontSize: 120, fontWeight: 900, lineHeight: 1,
          color: 'var(--brand-gold)', letterSpacing: '-0.05em',
          opacity: 0.18, userSelect: 'none', marginBottom: 16,
        }}>404</p>


        <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.02em' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 32 }}>
          This page doesn't exist or has been moved. Check the URL or head back to the dashboard.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 700,
            background: 'var(--brand-gold)', color: '#fff', textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}>
            <MdArrowBack size={15} /> Back to Dashboard
          </Link>
          <Link href="/dashboard/charts" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '10px 22px', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
            background: 'var(--navy-900)', color: 'var(--text-secondary)', textDecoration: 'none',
            border: '1px solid var(--border-subtle)',
          }}>
            View Charts
          </Link>
        </div>

      </div>
    </div>
  )
}
