'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell,
} from 'recharts'

// ─── Indices ──────────────────────────────────────────────────────────────────

const INDICES = [
  { key: 'KSE100', label: 'KSE-100',  value: 166315, change: +897.8,  pct: +0.54, color: '#D97706' },
  { key: 'KSE30',  label: 'KSE-30',   value: 49312,  change: +273.9,  pct: +0.56, color: '#3b82f6' },
  { key: 'KMI30',  label: 'KMI-30',   value: 240099, change: +1301.2, pct: +0.54, color: '#10b981' },
  { key: 'ALLSHR', label: 'All Share', value: 114882, change: +612.4,  pct: +0.54, color: '#8b5cf6' },
]

// ─── Deterministic history generator ─────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function seededRand(seed: number) {
  let s = seed
  return () => { s = (s * 16807 + 7) % 2147483647; return s / 2147483647 }
}

function genHistory(base: number, days: number, seed: number) {
  const rand = seededRand(seed)
  const data: { label: string; value: number; volume: number }[] = []
  let v = base * (1 - days * 0.0008)
  const now = new Date(2026, 9, 15)
  for (let i = days; i >= 0; i--) {
    v += (rand() - 0.46) * base * 0.005
    v = Math.max(v, base * 0.88)
    const d = new Date(now); d.setDate(now.getDate() - i)
    const label = days <= 5
      ? `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
      : days <= 30
      ? `${d.getDate()} ${MONTHS[d.getMonth()]}`
      : `${MONTHS[d.getMonth()]}${days > 200 ? ` ${d.getFullYear()}` : ''}`
    data.push({ label, value: Math.round(v), volume: Math.round((rand() * 0.5 + 0.5) * 4e8) })
  }
  data[data.length - 1].value = base
  return data
}

type Frame = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y'
const FRAME_DAYS: Record<Frame, number> = { '1D': 1, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }

const CACHE: Record<string, Record<Frame, ReturnType<typeof genHistory>>> = {}
INDICES.forEach((idx, ii) => {
  CACHE[idx.key] = {} as Record<Frame, ReturnType<typeof genHistory>>;
  (Object.keys(FRAME_DAYS) as Frame[]).forEach((f, fi) => {
    CACHE[idx.key][f] = genHistory(idx.value, FRAME_DAYS[f], idx.value + ii * 37 + fi * 19)
  })
})

// ─── Sectors ──────────────────────────────────────────────────────────────────

const SECTORS = [
  { name: 'Technology',  change: +2.15 },
  { name: 'Banking',     change: +1.42 },
  { name: 'Pharma',      change: +0.98 },
  { name: 'Cement',      change: +0.87 },
  { name: 'Oil & Gas',   change: +0.34 },
  { name: 'Textile',     change: +0.12 },
  { name: 'Fertilizer',  change: -0.21 },
  { name: 'Power',       change: -0.56 },
]

const BREADTH = { advances: 312, declines: 178, unchanged: 47 }
const BREADTH_TOTAL = BREADTH.advances + BREADTH.declines + BREADTH.unchanged

const TOP_MOVERS = [
  { symbol: 'LUCK',  name: 'Lucky Cement',      price: 915.00, pct: +1.67, vol: '0.9M',  up: true  },
  { symbol: 'OGDC',  name: 'Oil & Gas Dev Co',  price: 152.40, pct: +1.74, vol: '4.3M',  up: true  },
  { symbol: 'MEBL',  name: 'Meezan Bank',       price: 190.80, pct: +1.65, vol: '8.4M',  up: true  },
  { symbol: 'ENGRO', name: 'Engro Corp',         price: 342.10, pct: +1.57, vol: '1.8M',  up: true  },
  { symbol: 'SYS',   name: 'Systems Ltd',        price: 680.50, pct: +0.71, vol: '2.1M',  up: true  },
  { symbol: 'KEL',   name: 'K-Electric',         price: 8.40,   pct: -2.10, vol: '42.3M', up: false },
  { symbol: 'DGKC',  name: 'D.G. Khan Cement',   price: 105.50, pct: -1.77, vol: '3.2M',  up: false },
  { symbol: 'PIOC',  name: 'Pioneer Cement',     price: 88.30,  pct: -1.56, vol: '2.7M',  up: false },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString('en-PK')
const volFmt = (v: number) => v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` : `${(v / 1e6).toFixed(0)}M`

function xInterval(frame: Frame) {
  return { '1D': 3, '1W': 0, '1M': 4, '3M': 14, '6M': 29, '1Y': 59 }[frame]
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function PriceTip({ active, payload, color }: { active?: boolean; payload?: { value: number; payload: { label: string; volume: number } }[]; color: string }) {
  if (!active || !payload?.length) return null
  const p = payload[0]
  return (
    <div style={{ background: 'var(--navy-800)', border: `1px solid ${color}44`, borderRadius: 8, padding: '8px 12px', fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 10, marginBottom: 3 }}>{p.payload.label}</p>
      <p style={{ fontWeight: 700, color, fontSize: 14 }}>{fmt(p.value)}</p>
      <p style={{ color: 'var(--text-muted)', fontSize: 10, marginTop: 2 }}>Vol {volFmt(p.payload.volume)}</p>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IndicesPage() {
  const [active, setActive] = useState('KSE100')
  const [frame, setFrame]   = useState<Frame>('1M')

  const idx     = INDICES.find(i => i.key === active)!
  const history = CACHE[active][frame]

  const priceMin = Math.min(...history.map(d => d.value))
  const priceMax = Math.max(...history.map(d => d.value))
  const pad      = (priceMax - priceMin) * 0.12

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom: 4 }}>Market Indices</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pakistan stock exchange benchmarks — live performance overview</p>
      </div>

      {/* ── Index selector cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: 10 }} className="market-cards">
        {INDICES.map(i => {
          const up       = i.change >= 0
          const color    = up ? 'var(--green-gain)' : 'var(--red-loss)'
          const bg       = up ? 'rgba(22,163,74,0.06)'  : 'rgba(220,38,38,0.06)'
          const border   = up ? 'rgba(22,163,74,0.18)'  : 'rgba(220,38,38,0.18)'
          const isActive = active === i.key
          return (
            <button key={i.key} onClick={() => setActive(i.key)} className="market-card" style={{
              borderRadius: 8, padding: '12px 14px', cursor: 'pointer', textAlign: 'left',
              border: `${isActive ? '2px' : '1px'} solid ${isActive ? i.color : border}`,
              background: isActive ? `${i.color}12` : bg,
              transition: 'all 0.15s',
            }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color, marginBottom: 4 }}>{i.label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color, lineHeight: 1, marginBottom: 6 }}>{fmt(i.value)}</p>
              <p style={{ fontSize: 12, fontWeight: 600, color }}>
                {up ? '▲' : '▼'} {i.pct >= 0 ? '+' : ''}{i.pct.toFixed(2)}%
                <span style={{ fontWeight: 400, opacity: 0.7 }}> {i.change >= 0 ? '+' : ''}{i.change.toFixed(1)} pts</span>
              </p>
            </button>
          )
        })}
      </div>

      {/* ── Main chart + Breadth ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 236px', gap: 16 }} className="indices-chart-row">

        {/* Chart card */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>

          {/* Chart header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{idx.label} Index</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>{fmt(idx.value)}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: idx.pct >= 0 ? 'var(--green-gain)' : 'var(--red-loss)' }}>
                  {idx.pct >= 0 ? '▲' : '▼'} {idx.pct >= 0 ? '+' : ''}{idx.pct.toFixed(2)}% ({idx.pct >= 0 ? '+' : ''}{idx.change.toFixed(1)} pts)
                </span>
              </div>
            </div>
            {/* Timeframe tabs */}
            <div className="tab-bar" style={{ display: 'flex', gap: 0, alignSelf: 'flex-end', overflowX: 'auto' }}>
              {(['1D','1W','1M','3M','6M','1Y'] as Frame[]).map(f => (
                <button key={f} onClick={() => setFrame(f)} style={{
                  padding: '5px 11px', fontSize: 12, fontWeight: frame === f ? 700 : 500,
                  cursor: 'pointer', border: 'none', background: 'none',
                  color: frame === f ? 'var(--brand-gold)' : 'var(--text-muted)',
                  borderBottom: `2px solid ${frame === f ? 'var(--brand-gold)' : 'transparent'}`,
                  transition: 'all 0.15s',
                }}>{f}</button>
              ))}
            </div>
          </div>

          {/* Price chart */}
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={history} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="idxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={idx.color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={idx.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false}
                tickLine={false} interval={xInterval(frame)} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                width={64} tickFormatter={v => fmt(v)} domain={[priceMin - pad, priceMax + pad]} />
              <Tooltip content={<PriceTip color={idx.color} />} />
              <Area type="monotone" dataKey="value" stroke={idx.color} strokeWidth={2}
                fill="url(#idxGrad)" dot={false} activeDot={{ r: 4, fill: idx.color, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Volume */}
          <div style={{ marginTop: 8 }}>
            <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Volume</p>
            <ResponsiveContainer width="100%" height={48}>
              <BarChart data={history} margin={{ top: 0, right: 4, left: 0, bottom: 0 }}
                barSize={frame === '1Y' ? 2 : frame === '6M' ? 3 : 5}>
                <XAxis hide />
                <YAxis hide />
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div style={{ background: 'var(--navy-800)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '5px 9px', fontSize: 11, color: idx.color, fontWeight: 600 }}>
                    {volFmt(payload[0].value as number)}
                  </div>
                ) : null} />
                <Bar dataKey="volume" radius={[2,2,0,0]}>
                  {history.map((_, i) => <Cell key={i} fill={`${idx.color}50`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market breadth */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Market Breadth</p>

          {/* Stacked pill */}
          <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: `${(BREADTH.advances / BREADTH_TOTAL) * 100}%`, background: 'var(--green-gain)' }} />
            <div style={{ width: `${(BREADTH.unchanged / BREADTH_TOTAL) * 100}%`, background: 'var(--text-muted)' }} />
            <div style={{ width: `${(BREADTH.declines / BREADTH_TOTAL) * 100}%`, background: 'var(--red-loss)' }} />
          </div>

          {/* Bars */}
          {[
            { label: 'Advances',  value: BREADTH.advances,  color: 'var(--green-gain)' },
            { label: 'Declines',  value: BREADTH.declines,  color: 'var(--red-loss)'   },
            { label: 'Unchanged', value: BREADTH.unchanged, color: 'var(--text-muted)'  },
          ].map(b => (
            <div key={b.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11.5, color: 'var(--text-secondary)' }}>{b.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.value}</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: 'var(--navy-800)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(b.value / BREADTH_TOTAL) * 100}%`, borderRadius: 3, background: b.color }} />
              </div>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'A/D Ratio',     value: (BREADTH.advances / BREADTH.declines).toFixed(2), color: 'var(--green-gain)' },
              { label: 'Advancing %',   value: `${((BREADTH.advances / BREADTH_TOTAL) * 100).toFixed(1)}%`, color: 'var(--green-gain)' },
              { label: 'Total Symbols', value: String(BREADTH_TOTAL), color: 'var(--text-primary)' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: r.color }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sector + Top movers ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="indices-bottom-row">

        {/* Sector bar chart */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Sector Performance</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SECTORS} layout="vertical" barSize={14} margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${v > 0 ? '+' : ''}${v}%`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                axisLine={false} tickLine={false} width={76} />
              <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                <div style={{ background: 'var(--navy-800)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '7px 12px', fontSize: 12 }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: 2, fontSize: 10 }}>{label}</p>
                  <p style={{ color: (payload[0].value as number) >= 0 ? 'var(--green-gain)' : 'var(--red-loss)', fontWeight: 700 }}>
                    {(payload[0].value as number) > 0 ? '+' : ''}{payload[0].value}%
                  </p>
                </div>
              ) : null} />
              <Bar dataKey="change" radius={[0,4,4,0]}>
                {SECTORS.map((s, i) => (
                  <Cell key={i} fill={s.change >= 0 ? '#16A34A' : '#DC2626'}
                    fillOpacity={0.45 + (Math.abs(s.change) / 2.15) * 0.55} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top movers */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Top Movers</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--green-gain)', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.2)', borderRadius: 4, padding: '2px 7px' }}>
                {TOP_MOVERS.filter(m => m.up).length} Up
              </span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--red-loss)', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 4, padding: '2px 7px' }}>
                {TOP_MOVERS.filter(m => !m.up).length} Down
              </span>
            </div>
          </div>
          <div className="table-scroll"><table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 320 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Symbol', 'Price', '% Chg', 'Volume'].map((h, i) => (
                  <th key={h} style={{ padding: '8px 14px', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_MOVERS.map((m, i) => (
                <tr key={m.symbol} className="tr-hover" style={{ borderBottom: i < TOP_MOVERS.length - 1 ? '1px solid var(--border-subtle)' : 'none', cursor: 'pointer' }}>
                  <td style={{ padding: '9px 14px' }}>
                    <p style={{ fontWeight: 700, fontSize: 12, color: 'var(--text-primary)' }}>{m.symbol}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>{m.name}</p>
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600 }}>{m.price.toFixed(2)}</td>
                  <td style={{ padding: '9px 14px', textAlign: 'right' }}>
                    <span style={{
                      fontSize: 11.5, fontWeight: 700,
                      color: m.up ? 'var(--green-gain)' : 'var(--red-loss)',
                      background: m.up ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                      border: `1px solid ${m.up ? 'rgba(22,163,74,0.18)' : 'rgba(220,38,38,0.18)'}`,
                      borderRadius: 4, padding: '2px 6px',
                    }}>
                      {m.up ? '+' : ''}{m.pct.toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 11, color: 'var(--text-muted)' }}>{m.vol}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        </div>
      </div>

    </div>
  )
}
