export const instant = false

import MacroDrivers from '@/components/dashboard/MacroDrivers'

// ─── Key Indicators data ─────────────────────────────────────────────────────

const MACRO_CARDS: {
  label: string; value: string; unit: string; change: string; changePts: string;
  up: boolean | null;
}[] = [
  { label: 'USD / PKR',            value: '278.50', unit: 'PKR',     change: '+0.18%', changePts: '+0.50',         up: false },
  { label: 'SBP Policy Rate',      value: '17.50',  unit: '%',       change: '0.00%',  changePts: 'No change',     up: null  },
  { label: 'CPI Inflation (NCPI)', value: '11.8',   unit: '%',       change: '-1.2%',  changePts: 'YoY',           up: true  },
  { label: 'Brent Crude',          value: '87.42',  unit: 'USD/bbl', change: '+0.63%', changePts: '+0.55',         up: true  },
  { label: 'WTI Crude',            value: '83.17',  unit: 'USD/bbl', change: '+0.71%', changePts: '+0.59',         up: true  },
  { label: 'Current Account',      value: '-1.2',   unit: 'B USD',   change: '+0.3B',  changePts: 'vs last month', up: true  },
  { label: 'GDP Growth',           value: '3.2',    unit: '%',       change: '+0.4%',  changePts: 'vs prev qtr',   up: true  },
  { label: 'Remittances',          value: '3.1',    unit: 'B USD',   change: '+12.4%', changePts: 'YoY',           up: true  },
  { label: 'Forex Reserves',       value: '9.8',    unit: 'B USD',   change: '+0.4B',  changePts: 'vs last week',  up: true  },
  { label: 'Trade Balance',        value: '-2.4',   unit: 'B USD',   change: '-0.2B',  changePts: 'vs last month', up: false },
]

const IMF_TRANCHES = [
  { tranche: 'Tranche 1', amount: 1.0,  date: 'Jul 2023', status: 'disbursed' },
  { tranche: 'Tranche 2', amount: 1.1,  date: 'Feb 2024', status: 'disbursed' },
  { tranche: 'Tranche 3', amount: 1.1,  date: 'Sep 2024', status: 'disbursed' },
  { tranche: 'Tranche 4', amount: 1.2,  date: 'Mar 2025', status: 'disbursed' },
  { tranche: 'Tranche 5', amount: 1.3,  date: 'Oct 2025', status: 'disbursed' },
  { tranche: 'Tranche 6', amount: 1.3,  date: 'Apr 2026', status: 'pending'   },
  { tranche: 'Tranche 7', amount: 1.0,  date: 'Oct 2026', status: 'upcoming'  },
]
const IMF_TOTAL     = 7.0
const IMF_DISBURSED = 5.7
const IMF_PROGRESS  = Math.round((IMF_DISBURSED / IMF_TOTAL) * 100)

const MPC_MEETINGS = [
  { date: 'Jan 27, 2025', decision: 'Cut 100bps → 17.50%', status: 'past',     rate: '17.50%' },
  { date: 'Mar 10, 2025', decision: 'Hold → 17.50%',        status: 'past',     rate: '17.50%' },
  { date: 'Apr 28, 2025', decision: 'Hold → 17.50%',        status: 'past',     rate: '17.50%' },
  { date: 'Jun 16, 2025', decision: 'Hold → 17.50%',        status: 'past',     rate: '17.50%' },
  { date: 'Jul 28, 2025', decision: 'Hold → 17.50%',        status: 'past',     rate: '17.50%' },
  { date: 'Sep 15, 2025', decision: 'Cut 50bps → 17.00%',   status: 'past',     rate: '17.00%' },
  { date: 'Nov 03, 2025', decision: 'Expected decision',     status: 'upcoming', rate: '—'      },
  { date: 'Jan 12, 2026', decision: 'Expected decision',     status: 'upcoming', rate: '—'      },
]

const RESERVES_DATA = [
  { week: 'Sep 5',   sbp: 9.21, commercial: 5.82, total: 15.03 },
  { week: 'Sep 12',  sbp: 9.34, commercial: 5.79, total: 15.13 },
  { week: 'Sep 19',  sbp: 9.48, commercial: 5.85, total: 15.33 },
  { week: 'Sep 26',  sbp: 9.61, commercial: 5.91, total: 15.52 },
  { week: 'Oct 3',   sbp: 9.72, commercial: 5.88, total: 15.60 },
  { week: 'Oct 10',  sbp: 9.80, commercial: 5.94, total: 15.74 },
]

const RUPEE_IMPACT = [
  { symbol: 'PSO',    name: 'Pakistan State Oil',      impact: 'negative', reason: 'Imports crude in USD; cost of sales rises',              effect: 'High'   },
  { symbol: 'HASCOL', name: 'Hascol Petroleum',        impact: 'negative', reason: 'USD-denominated inventory and import costs',             effect: 'High'   },
  { symbol: 'LUCK',   name: 'Lucky Cement',            impact: 'negative', reason: 'Coal imports; capex in foreign currency',                effect: 'Medium' },
  { symbol: 'ENGRO',  name: 'Engro Corporation',       impact: 'mixed',    reason: 'Fertilizer exports offset by USD debt',                  effect: 'Low'    },
  { symbol: 'MLCF',   name: 'Maple Leaf Cement',       impact: 'negative', reason: 'Energy and coal inputs priced in USD',                   effect: 'Medium' },
  { symbol: 'TRG',    name: 'TRG Pakistan',            impact: 'positive', reason: 'USD-earning BPO; revenues in foreign currency',          effect: 'High'   },
  { symbol: 'SYS',    name: 'Systems Limited',         impact: 'positive', reason: 'IT exports in USD; PKR depreciation boosts revenue',     effect: 'High'   },
  { symbol: 'NETSOL', name: 'NetSol Technologies',     impact: 'positive', reason: 'USD/EUR software revenues; natural hedge',               effect: 'High'   },
  { symbol: 'HUBC',   name: 'Hub Power Company',       impact: 'positive', reason: 'Tariff indexed to USD; capacity payments rise',          effect: 'Medium' },
  { symbol: 'OGDC',   name: 'OGDC',                    impact: 'positive', reason: 'Oil & gas priced in USD; realizations improve',          effect: 'Medium' },
]

// ─── Shared ───────────────────────────────────────────────────────────────────

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', ...style }}>
      {children}
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 3 }}>{title}</h2>
      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{subtitle}</p>
    </div>
  )
}

// ─── Key Indicator card ───────────────────────────────────────────────────────

function MacroCard({ label, value, unit, change, changePts, up }: typeof MACRO_CARDS[0]) {
  const isNeutral = up === null
  const color  = isNeutral ? '#64748B'                : up ? 'var(--green-gain)' : 'var(--red-loss)'
  const bg     = isNeutral ? 'rgba(100,116,139,0.06)' : up ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)'
  const border = isNeutral ? 'rgba(100,116,139,0.18)' : up ? 'rgba(22,163,74,0.18)' : 'rgba(220,38,38,0.18)'
  return (
    <div className="market-card" style={{ borderRadius: 8, background: bg, border: `1px solid ${border}`, padding: '12px 14px', minWidth: 0, cursor: 'pointer' }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color, marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color, lineHeight: 1, marginBottom: 6 }}>
        {value} <span style={{ fontSize: 12, fontWeight: 500, opacity: 0.75 }}>{unit}</span>
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, color }}>
        {isNeutral ? '—' : up ? '▲' : '▼'} {change}
        <span style={{ fontWeight: 400, opacity: 0.7 }}> {changePts}</span>
      </p>
    </div>
  )
}

// ─── IMF Program Tracker ──────────────────────────────────────────────────────

function IMFTracker() {
  const statusColor = (s: string) =>
    s === 'disbursed' ? 'var(--green-gain)' : s === 'pending' ? 'var(--brand-gold)' : 'var(--text-muted)'
  const statusBg = (s: string) =>
    s === 'disbursed' ? 'rgba(22,163,74,0.08)' : s === 'pending' ? 'rgba(217,119,6,0.08)' : 'rgba(148,163,184,0.08)'

  return (
    <SectionCard style={{ padding: '20px 20px' }}>
      {/* Summary row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Total Program</p>
          <p style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>
            $7.0B <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>EFF</span>
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>IMF Extended Fund Facility · 2023 – 2027</p>
        </div>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Disbursed</p>
          <p style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1, color: 'var(--green-gain)', marginBottom: 4 }}>
            ${IMF_DISBURSED}B
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{IMF_PROGRESS}% of program</p>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ height: 6, borderRadius: 3, background: 'var(--navy-800)', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${IMF_PROGRESS}%`, borderRadius: 3, background: 'var(--green-gain)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>$0</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>$7.0B</span>
        </div>
      </div>

      {/* Tranches — scroll on mobile */}
      <div className="table-scroll">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(90px, 1fr))', gap: 6, minWidth: 500 }}>
          {IMF_TRANCHES.map(t => (
            <div key={t.tranche} style={{ textAlign: 'center' }}>
              <div style={{ borderRadius: 8, border: `1px solid ${statusBg(t.status)}`, background: statusBg(t.status), padding: '10px 6px', marginBottom: 6 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: statusColor(t.status), lineHeight: 1, marginBottom: 2 }}>${t.amount}B</p>
                <p style={{ fontSize: 10, color: statusColor(t.status), opacity: 0.8 }}>{t.date}</p>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: statusColor(t.status), background: statusBg(t.status), borderRadius: 3, padding: '2px 6px', textTransform: 'capitalize' }}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

// ─── MPC Rate Calendar ────────────────────────────────────────────────────────

function MPCCalendar() {
  return (
    <SectionCard style={{ padding: '20px 20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 8 }} className="mpc-grid">
        {MPC_MEETINGS.map((m, i) => {
          const isPast     = m.status === 'past'
          const isUpcoming = m.status === 'upcoming'
          const isLatest   = isPast && i === MPC_MEETINGS.filter(x => x.status === 'past').length - 1
          return (
            <div key={m.date} className="card-hover" style={{
              borderRadius: 8, cursor: 'pointer',
              border: isLatest ? '1px solid rgba(217,119,6,0.4)' : isUpcoming ? '1px dashed var(--border-subtle)' : '1px solid var(--border-subtle)',
              background: isLatest ? 'rgba(217,119,6,0.06)' : isUpcoming ? 'var(--navy-800)' : 'var(--navy-900)',
              padding: '14px 16px',
            }}>
              {isLatest && (
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-gold)', display: 'block', marginBottom: 6 }}>Latest</span>
              )}
              <p style={{ fontSize: 11, color: isPast ? 'var(--text-secondary)' : 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>{m.date}</p>
              <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: isPast ? 'var(--text-primary)' : 'var(--text-muted)', lineHeight: 1, marginBottom: 6 }}>{m.rate}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{m.decision}</p>
            </div>
          )
        })}
      </div>
    </SectionCard>
  )
}

// ─── Foreign Reserves Monitor ─────────────────────────────────────────────────

function ReservesMonitor() {
  const latest = RESERVES_DATA[RESERVES_DATA.length - 1]
  const prev   = RESERVES_DATA[RESERVES_DATA.length - 2]
  const sbpChg = (latest.sbp - prev.sbp).toFixed(2)
  const totChg = (latest.total - prev.total).toFixed(2)

  return (
    <SectionCard style={{ padding: '20px 20px' }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginBottom: 20 }} className="reserves-grid">
        {[
          { label: 'SBP Reserves',         value: latest.sbp,        change: sbpChg, unit: 'B USD' },
          { label: 'Commercial Banks',      value: latest.commercial, change: null,   unit: 'B USD' },
          { label: 'Total Liquid Reserves', value: latest.total,      change: totChg, unit: 'B USD' },
        ].map(item => {
          const up     = item.change !== null ? Number(item.change) >= 0 : null
          const color  = up === null ? 'var(--text-muted)' : up ? 'var(--green-gain)' : 'var(--red-loss)'
          const bg     = up === null ? 'rgba(148,163,184,0.06)' : up ? 'rgba(22,163,74,0.06)' : 'rgba(220,38,38,0.06)'
          const border = up === null ? 'rgba(148,163,184,0.18)' : up ? 'rgba(22,163,74,0.18)' : 'rgba(220,38,38,0.18)'
          return (
            <div key={item.label} style={{ borderRadius: 8, background: bg, border: `1px solid ${border}`, padding: '12px 14px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: up === null ? 'var(--text-muted)' : color, marginBottom: 4 }}>{item.label}</p>
              <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', color: up === null ? 'var(--text-primary)' : color, lineHeight: 1, marginBottom: 6 }}>${item.value}B</p>
              {item.change !== null && (
                <p style={{ fontSize: 12, fontWeight: 600, color }}>{up ? '▲' : '▼'} {up ? '+' : ''}{item.change}B <span style={{ fontWeight: 400, opacity: 0.7 }}>WoW</span></p>
              )}
            </div>
          )
        })}
      </div>

      {/* Weekly table */}
      <div className="table-scroll">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 380 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Period', 'SBP (B USD)', 'Commercial (B USD)', 'Total (B USD)'].map(h => (
                <th key={h} style={{ padding: '8px 12px', textAlign: h === 'Period' ? 'left' : 'right', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...RESERVES_DATA].reverse().map((row, i) => (
              <tr key={row.week} style={{ borderBottom: '1px solid var(--border-subtle)', background: i === 0 ? 'rgba(22,163,74,0.03)' : 'transparent' }}>
                <td style={{ padding: '8px 12px', color: 'var(--text-secondary)', fontSize: 12, whiteSpace: 'nowrap' }}>
                  Week ending {row.week} {i === 0 && <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--green-gain)', marginLeft: 6 }}>Latest</span>}
                </td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>${row.sbp}B</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-secondary)' }}>${row.commercial}B</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>${row.total}B</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  )
}

// ─── Rupee Impact Analysis ────────────────────────────────────────────────────

function RupeeImpact() {
  const effectColor = (e: string) =>
    e === 'High' ? 'var(--brand-gold)' : e === 'Medium' ? '#8B5CF6' : 'var(--text-muted)'
  const effectBg = (e: string) =>
    e === 'High' ? 'rgba(217,119,6,0.08)' : e === 'Medium' ? 'rgba(139,92,246,0.08)' : 'rgba(148,163,184,0.08)'
  const impactColor = (imp: string) =>
    imp === 'positive' ? 'var(--green-gain)' : imp === 'negative' ? 'var(--red-loss)' : 'var(--text-muted)'

  return (
    <SectionCard style={{ padding: '20px 20px' }}>
      {/* Scenario banner */}
      <div style={{ borderRadius: 8, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.2)', padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--brand-gold)' }}>Scenario:</span>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>PKR depreciates 5% against USD — from 278.50 to ~292.40</span>
      </div>

      {/* Scrollable table on mobile */}
      <div className="table-scroll">
        <div style={{ minWidth: 480 }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 90px', gap: 10, padding: '0 10px', marginBottom: 6 }}>
            {['Symbol', 'Impact Reason', 'Direction', 'Sensitivity'].map(h => (
              <p key={h} style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</p>
            ))}
          </div>
          {/* Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {RUPEE_IMPACT.map(s => (
              <div key={s.symbol} className="card-hover" style={{
                display: 'grid', gridTemplateColumns: '90px 1fr 100px 90px', gap: 10,
                alignItems: 'center', borderRadius: 8, border: '1px solid var(--border-subtle)',
                background: 'var(--navy-900)', padding: '10px 10px', cursor: 'pointer',
              }}>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{s.symbol}</p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{s.name.split(' ').slice(0, 2).join(' ')}</p>
                </div>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{s.reason}</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: impactColor(s.impact), whiteSpace: 'nowrap' }}>
                  {s.impact === 'positive' ? '▲ Positive' : s.impact === 'negative' ? '▼ Negative' : '— Mixed'}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: effectColor(s.effect) }}>
                  {s.effect}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MacroDashboard() {
  return (
    <div className="space-y-10">
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Macro Dashboard</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pakistan macroeconomic indicators — monetary policy, inflation, energy and external accounts.</p>
      </div>

      <section>
        <SectionHeading title="Key Indicators" subtitle="Live macro data across monetary, fiscal and commodity sectors." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 10 }} className="macro-cards">
          {MACRO_CARDS.map(c => <MacroCard key={c.label} {...c} />)}
        </div>
      </section>

      <section>
        <SectionHeading title="IMF Program Tracker" subtitle="EFF Program — $7B total (2023–2027)" />
        <IMFTracker />
      </section>

      <section>
        <SectionHeading title="Policy Rate Decision Calendar" subtitle="Monetary Policy Committee (MPC) meetings — State Bank of Pakistan" />
        <MPCCalendar />
      </section>

      <section>
        <SectionHeading title="Foreign Reserves Monitor" subtitle="Weekly SBP data — USD billions" />
        <ReservesMonitor />
      </section>

      <section>
        <SectionHeading title="Rupee Impact Analysis" subtitle="How a 5% PKR depreciation affects these stocks" />
        <RupeeImpact />
      </section>

      <section>
        <SectionHeading
          title="How Each Driver Scores"
          subtitle="Five-year trends and monthly momentum for the six macro forces most relevant to PSX."
        />
        <MacroDrivers />
      </section>
    </div>
  )
}
