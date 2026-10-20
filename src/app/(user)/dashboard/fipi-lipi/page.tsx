'use client'

import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, ReferenceLine,
} from 'recharts'
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md'

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TABS = ['1W', '1M', '3M', '6M', '1Y']

function seededRand(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

// Net buy (positive) / net sell (negative) in PKR millions
function genFipiData(days: number, seed = 42) {
  const rand = seededRand(seed)
  const data = []
  // Use fixed anchor dates (days before 2026-10-15) to avoid server/client mismatch
  const anchor = new Date('2026-10-15')
  for (let i = days; i >= 0; i--) {
    const d = new Date(anchor)
    d.setDate(d.getDate() - i)
    const day = d.toISOString().slice(5, 10)
    const fipi = +((rand() * 3000 - 1200)).toFixed(0)
    const lipi = +((rand() * 4000 - 1800)).toFixed(0)
    data.push({ day, fipi, lipi, net: fipi + lipi })
  }
  return data
}

const DATA_MAP: Record<string, ReturnType<typeof genFipiData>> = {
  '1W': genFipiData(7,   101),
  '1M': genFipiData(30,  202),
  '3M': genFipiData(90,  303),
  '6M': genFipiData(180, 404),
  '1Y': genFipiData(365, 505),
}

const SECTOR_FLOW = [
  { sector: 'Banking',    fipi:+1240, lipi:+880  },
  { sector: 'Oil & Gas',  fipi:+620,  lipi:+340  },
  { sector: 'Technology', fipi:+480,  lipi:+210  },
  { sector: 'Cement',     fipi:-120,  lipi:+150  },
  { sector: 'Fertilizer', fipi:-340,  lipi:-180  },
  { sector: 'Power',      fipi:-180,  lipi:-290  },
  { sector: 'FMCG',       fipi:+90,   lipi:-60   },
  { sector: 'Pharma',     fipi:+55,   lipi:+120  },
]

const TABLE_DATA = [
  { symbol:'HBL',    name:'Habib Bank',    fipi:+840, lipi:+620,  net:+1460, pct:+1.26 },
  { symbol:'MEBL',   name:'Meezan Bank',   fipi:+560, lipi:+310,  net:+870,  pct:+1.65 },
  { symbol:'OGDC',   name:'OGDC',          fipi:+480, lipi:+180,  net:+660,  pct:+1.13 },
  { symbol:'SYS',    name:'Systems Ltd',   fipi:+420, lipi:+190,  net:+610,  pct:+1.87 },
  { symbol:'MCB',    name:'MCB Bank',      fipi:+310, lipi:+240,  net:+550,  pct:+0.64 },
  { symbol:'FFC',    name:'Fauji Fert.',   fipi:-290, lipi:-150,  net:-440,  pct:-0.28 },
  { symbol:'KEL',    name:'K-Electric',    fipi:-360, lipi:-280,  net:-640,  pct:-2.10 },
  { symbol:'DGKC',   name:'DG Khan',       fipi:-410, lipi:-320,  net:-730,  pct:-1.77 },
]

function fmt(v: number) {
  const abs = Math.abs(v)
  if (abs >= 1000) return `${(v / 1000).toFixed(1)}B`
  return `${v}M`
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function FipiLipiPage() {
  const [tab, setTab] = useState('1M')

  const data = DATA_MAP[tab]
  const fipiNet = data.reduce((s, d) => s + d.fipi, 0)
  const lipiNet = data.reduce((s, d) => s + d.lipi, 0)
  const totalNet = fipiNet + lipiNet

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 18px', fontSize: 13, fontWeight: tab === t ? 700 : 500,
            cursor: 'pointer', border: 'none', background: 'none',
            color: tab === t ? 'var(--brand-gold)' : 'var(--text-muted)',
            borderBottom: `2px solid ${tab === t ? 'var(--brand-gold)' : 'transparent'}`,
            marginBottom: -2,
          }}>{t}</button>
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom: 4 }}>FIPI / LIPI Flow</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Foreign (FIPI) and local (LIPI) institutional investor net flows "” PKR millions</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {[
          { label: 'FIPI Net Flow', value: fipiNet, desc: 'Foreign Institutional' },
          { label: 'LIPI Net Flow', value: lipiNet, desc: 'Local Institutional'   },
          { label: 'Total Net Flow',value: totalNet,desc: 'Combined FIPI + LIPI'  },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', color: s.value >= 0 ? 'var(--green-gain)' : 'var(--red-loss)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
              {s.value >= 0 ? <MdTrendingUp size={18} /> : <MdTrendingDown size={18} />}
              {s.value >= 0 ? '+' : ''}{fmt(s.value)}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Net Flow Trend Chart */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Net Flow Trend</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fipiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#D97706" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#D97706" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} interval={Math.floor(data.length / 6)} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={52} tickFormatter={v => `${v > 0 ? '+' : ''}${(v / 1000).toFixed(1)}B`} />
            <Tooltip content={({ active, payload }) => active && payload?.length ? (
              <div style={{ background: 'var(--navy-900)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{payload[0].payload.day}</p>
                <p style={{ color: '#D97706', fontWeight: 600 }}>FIPI: {fmt(payload[0].payload.fipi)}</p>
                <p style={{ color: '#3b82f6', fontWeight: 600 }}>LIPI: {fmt(payload[0].payload.lipi)}</p>
              </div>
            ) : null} />
            <ReferenceLine y={0} stroke="var(--border-subtle)" />
            <Area type="monotone" dataKey="fipi" stroke="#D97706" strokeWidth={1.5} fill="url(#fipiGrad)" dot={false} name="FIPI" />
            <Area type="monotone" dataKey="lipi" stroke="#3b82f6" strokeWidth={1.5} fill="none" dot={false} name="LIPI" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
          {[{ color: '#D97706', label: 'FIPI (Foreign)' }, { color: '#3b82f6', label: 'LIPI (Local)' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 3, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sector Flow + Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Sector bar */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 14 }}>Sector Breakdown</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={SECTOR_FLOW} layout="vertical" barSize={10} barCategoryGap={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v > 0 ? '+' : ''}${v}M`} />
              <YAxis type="category" dataKey="sector" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={75} />
              <Tooltip content={({ active, payload }) => active && payload?.length ? (
                <div style={{ background: 'var(--navy-900)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '7px 12px', fontSize: 12 }}>
                  <p style={{ color: '#D97706', fontWeight: 600 }}>FIPI: {payload[0]?.value as number > 0 ? '+' : ''}{payload[0]?.value}M</p>
                  <p style={{ color: '#3b82f6', fontWeight: 600 }}>LIPI: {payload[1]?.value as number > 0 ? '+' : ''}{payload[1]?.value}M</p>
                </div>
              ) : null} />
              <ReferenceLine x={0} stroke="var(--border-subtle)" />
              <Bar dataKey="fipi" name="FIPI" radius={[0,4,4,0]}>
                {SECTOR_FLOW.map((s, i) => <Cell key={i} fill={s.fipi >= 0 ? '#D97706' : '#DC2626'} />)}
              </Bar>
              <Bar dataKey="lipi" name="LIPI" radius={[0,4,4,0]}>
                {SECTOR_FLOW.map((s, i) => <Cell key={i} fill={s.lipi >= 0 ? '#3b82f6' : '#ef4444'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Stock table */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Stock-Level Flow</p>
          </div>
          <div className="table-scroll">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Symbol', 'FIPI', 'LIPI', 'Net', '% Chg'].map((h, i) => (
                    <th key={h} style={{ padding: '8px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: i === 0 ? 'left' : 'right' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TABLE_DATA.map((r, i) => (
                  <tr key={r.symbol} className="tr-hover" style={{ borderBottom: i < TABLE_DATA.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <td style={{ padding: '9px 12px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)' }}>{r.symbol}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.name}</div>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: r.fipi >= 0 ? 'var(--green-gain)' : 'var(--red-loss)' }}>{r.fipi >= 0 ? '+' : ''}{r.fipi}M</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: r.lipi >= 0 ? 'var(--green-gain)' : 'var(--red-loss)' }}>{r.lipi >= 0 ? '+' : ''}{r.lipi}M</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontSize: 12, fontWeight: 700, color: r.net >= 0 ? 'var(--green-gain)' : 'var(--red-loss)' }}>{r.net >= 0 ? '+' : ''}{r.net}M</td>
                    <td style={{ padding: '9px 12px', textAlign: 'right' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: r.pct >= 0 ? 'var(--green-gain)' : 'var(--red-loss)', background: r.pct >= 0 ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', borderRadius: 4, padding: '2px 6px' }}>
                        {r.pct >= 0 ? '+' : ''}{r.pct.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}



