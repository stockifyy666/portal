export const instant = false

// Admin dashboard — dummy data, swap for real API calls later

const MARKET_STATS = [
  { label: 'KSE-100',       value: '164,907', delta: '+0.08%', up: true  },
  { label: 'Total Volume',  value: 'PKR 15.1B', delta: 'Today', up: null },
  { label: 'Advances',      value: '214',     delta: 'vs 186 declines', up: true  },
  { label: 'Foreign Flow',  value: '-$2.3M',  delta: 'Net sell today',  up: false },
]

const TOP_MOVERS = [
  { symbol: 'BML',   name: 'Bank Makramah Limited',          price: 58.69,  change: +10.01 },
  { symbol: 'THALL', name: 'Thal Limited',                   price: 520.90, change: +2.12  },
  { symbol: 'JDWS',  name: 'JDW Sugar Mills Limited',        price: 850.00, change: -2.49  },
  { symbol: 'AGP',   name: 'AGP Limited',                    price: 156.01, change: -1.78  },
  { symbol: 'KEL',   name: 'K-Electric Limited',             price: 5.90,   change: +0.85  },
]

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          PSX market overview · 14 Oct 2026
        </p>
      </div>

      {/* Market stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {MARKET_STATS.map(s => (
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

      {/* Top movers */}
      <div className="rounded-xl border overflow-hidden"
           style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="px-5 py-4 border-b flex items-center justify-between"
             style={{ background: 'var(--navy-900)', borderColor: 'var(--border-subtle)' }}>
          <h2 className="font-semibold text-sm">Top Movers — PSX</h2>
          <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--green-gain)', border: '1px solid rgba(34,197,94,0.2)' }}>
            Live
          </span>
        </div>
        <div style={{ background: 'var(--navy-900)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                {['Symbol', 'Company', 'Price (PKR)', 'Change'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_MOVERS.map(m => (
                <tr key={m.symbol} className="border-b transition-colors"
                    style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-5 py-3">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded"
                          style={{ background: 'rgba(245,166,35,0.1)', color: 'var(--brand-gold)' }}>
                      {m.symbol}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{m.name}</td>
                  <td className="px-5 py-3 font-medium font-mono">{m.price.toFixed(2)}</td>
                  <td className="px-5 py-3 font-medium text-sm"
                      style={{ color: m.change >= 0 ? 'var(--green-gain)' : 'var(--red-loss)' }}>
                    {m.change >= 0 ? '▲' : '▼'} {Math.abs(m.change).toFixed(2)}%
                  </td>
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
