export const instant = false

// Superadmin dashboard — dummy data, swap for real queries later

const STATS = [
  { label: 'Total Users',    value: '1,248',  delta: '+34 this week',  up: true  },
  { label: 'Active Admins',  value: '6',      delta: '2 pending',      up: null  },
  { label: 'API Calls Today',value: '7,421',  delta: '72% of quota',   up: true  },
  { label: 'Alerts',         value: '3',      delta: '1 critical',     up: false },
]

const RECENT_USERS = [
  { name: 'Ali Hassan',    email: 'ali@example.com',   role: 'user',       joined: '14 Oct 2026' },
  { name: 'Sana Mirza',   email: 'sana@example.com',  role: 'admin',      joined: '13 Oct 2026' },
  { name: 'Umar Farooq',  email: 'umar@example.com',  role: 'user',       joined: '12 Oct 2026' },
  { name: 'Zara Sheikh',  email: 'zara@example.com',  role: 'user',       joined: '11 Oct 2026' },
  { name: 'Kamran Baig',  email: 'kamran@example.com',role: 'superadmin', joined: '10 Oct 2026' },
]

const ROLE_COLORS: Record<string, string> = {
  superadmin: '#7C3AED',
  admin:      '#0891B2',
  user:       '#16A34A',
}

export default function SuperAdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Platform overview · PSX Data Portal · 14 Oct 2026
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="rounded-xl p-5 border"
               style={{ background: 'var(--navy-900)', borderColor: 'var(--border-subtle)' }}>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-2xl font-bold mb-1">{s.value}</p>
            <p className="text-xs" style={{
              color: s.up === true ? 'var(--green-gain)' : s.up === false ? 'var(--red-loss)' : 'var(--text-muted)'
            }}>
              {s.delta}
            </p>
          </div>
        ))}
      </div>

      {/* Role badge legend */}
      <div className="flex items-center gap-2 flex-wrap">
        {Object.entries(ROLE_COLORS).map(([role, color]) => (
          <span key={role} className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: color + '22', color, border: `1px solid ${color}44` }}>
            {role}
          </span>
        ))}
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Role legend</span>
      </div>

      {/* Recent users table */}
      <div className="rounded-xl border overflow-hidden"
           style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between"
             style={{ background: 'var(--navy-900)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="font-semibold text-sm">Recent Users</h2>
          <button className="text-xs px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--brand-gold)', border: '1px solid rgba(245,166,35,0.2)' }}>
            View all →
          </button>
        </div>
        <div style={{ background: 'var(--navy-900)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                {['Name', 'Email', 'Role', 'Joined'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_USERS.map(u => (
                <tr key={u.email} className="border-b transition-colors"
                    style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3" style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: ROLE_COLORS[u.role] + '22',
                            color: ROLE_COLORS[u.role],
                            border: `1px solid ${ROLE_COLORS[u.role]}44`,
                          }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attribution */}
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        Data provided by <a href="#" style={{ color: 'var(--brand-gold)' }}>Capital Stake</a> · CS Solutions (Pvt) Ltd
      </p>
    </div>
  )
}
