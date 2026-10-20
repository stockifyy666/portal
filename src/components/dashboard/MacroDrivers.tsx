'use client'

import { useState } from 'react'
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from 'recharts'

type Status = 'Supportive' | 'Balanced' | 'Drag'

interface Point { month: string; v: number }

interface DriverDef {
  name: string
  display: string
  unit: string
  changePct: string
  changeDir: 'up' | 'down' | 'flat'
  status: Status
  description: string
  trendNote: string
  color: string
  trend5y: Point[]
  monthly24: { v: number }[]
}

// ─── Month label generator ────────────────────────────────────────────────────

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function genMonths(startYear: number, startMonth: number, count: number): string[] {
  const out: string[] = []
  let y = startYear, m = startMonth
  for (let i = 0; i < count; i++) {
    out.push(`${MONTHS[m]} ${y}`)
    m++
    if (m > 11) { m = 0; y++ }
  }
  return out
}

function withMonths(values: number[], startYear: number, startMonth = 0): Point[] {
  const labels = genMonths(startYear, startMonth, values.length)
  return values.map((v, i) => ({ month: labels[i], v }))
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const DRIVERS: DriverDef[] = [
  {
    name: 'Brent Crude Oil',
    display: '$90',
    unit: 'USD/bbl',
    changePct: '-0.4%',
    changeDir: 'down',
    status: 'Balanced',
    description: 'Lower oil eases the import bill and inflation, freeing room for growth.',
    trendNote: 'Little changed',
    color: '#9ca3af',
    trend5y: withMonths([
      56,62,68,74,80,88,95,112,120,115,108,98,
      88,80,75,84,90,88,83,79,80,82,84,82,
      78,75,80,84,88,86,82,80,79,82,85,87,
      83,79,82,85,87,86,84,82,83,86,88,90,
      88,85,82,84,87,88,90,89,88,89,90,90,
    ], 2021, 0),
    monthly24: [
      { v: 80 },{ v: 78 },{ v: 82 },{ v: 86 },{ v: 90 },{ v: 88 },
      { v: 84 },{ v: 82 },{ v: 85 },{ v: 89 },{ v: 92 },{ v: 88 },
      { v: 84 },{ v: 83 },{ v: 86 },{ v: 88 },{ v: 91 },{ v: 87 },
      { v: 84 },{ v: 86 },{ v: 88 },{ v: 87 },{ v: 88 },{ v: 90 },
    ],
  },
  {
    name: 'CPI Inflation',
    display: '11.1%',
    unit: '%',
    changePct: '+20.6%',
    changeDir: 'up',
    status: 'Drag',
    description: 'Cooler inflation protects real returns and opens the door to rate cuts.',
    trendNote: 'Rising vs last month',
    color: '#f59e0b',
    trend5y: withMonths([
      8,9,10,12,13,16,18,20,22,25,28,30,
      32,35,36,38,41,40,38,36,32,28,25,22,
      20,18,16,15,14,13,12,12,12,12,12,11,
      11,11,11,11,11,11,11,11,11,11,11,11,
      11,11,11,11,11,11,11,11,11,11,11,11,
    ], 2021, 0),
    monthly24: [
      { v: 27 },{ v: 24 },{ v: 22 },{ v: 20 },{ v: 18 },{ v: 17 },
      { v: 16 },{ v: 15 },{ v: 14 },{ v: 13 },{ v: 13 },{ v: 12 },
      { v: 12 },{ v: 13 },{ v: 12 },{ v: 12 },{ v: 12 },{ v: 12 },
      { v: 12 },{ v: 12 },{ v: 12 },{ v: 11 },{ v: 11 },{ v: 11 },
    ],
  },
  {
    name: 'SBP Policy (Target) Rate',
    display: '11.5%',
    unit: '%',
    changePct: '0.0%',
    changeDir: 'flat',
    status: 'Balanced',
    description: 'Lower policy rates lift equity valuations and cut financing costs.',
    trendNote: 'Little changed',
    color: '#8b5cf6',
    trend5y: withMonths([
      5.8,6,7,8,9,10,12,14,16,18,20,22,
      22,22,22,22,23.2,22,22,22,22,22,22,21,
      20,19,18,17,16,15,14,13,13,13,13,13,
      13,13,13,13,13,13,13,12,12,12,12,12,
      12,12,12,12,12,12,12,12,11.5,11.5,11.5,11.5,
    ], 2021, 0),
    monthly24: [
      { v: 22 },{ v: 22 },{ v: 22 },{ v: 22 },{ v: 21 },{ v: 20 },
      { v: 19 },{ v: 18 },{ v: 17 },{ v: 16 },{ v: 15 },{ v: 14 },
      { v: 14 },{ v: 14 },{ v: 13 },{ v: 13 },{ v: 13 },{ v: 13 },
      { v: 12 },{ v: 12 },{ v: 12 },{ v: 12 },{ v: 11.5 },{ v: 11.5 },
    ],
  },
  {
    name: 'Current Account',
    display: '-$98M',
    unit: 'M USD',
    changePct: '+78.0%',
    changeDir: 'up',
    status: 'Supportive',
    description: 'A stronger external balance steadies the rupee and reserves.',
    trendNote: 'Rising vs last month',
    color: '#16a34a',
    trend5y: withMonths([
      -552,-600,-800,-1200,-1800,-2700,-2500,-2200,-1800,-1500,-1200,-900,
      -600,-400,-200,100,200,400,600,800,1000,1200,1400,1600,
      1500,1400,1300,1200,1000,800,600,400,200,100,-50,-80,
      -90,-95,-98,-100,-95,-90,-85,-80,-75,-70,-65,-60,
      -55,-50,-45,-40,-35,-30,-25,-20,-15,-10,-5,-98,
    ], 2021, 0),
    monthly24: [
      { v: -600 },{ v: -400 },{ v: -200 },{ v: 100 },{ v: 300 },{ v: 500 },
      { v: 700 },{ v: 900 },{ v: 1100 },{ v: 1300 },{ v: 1500 },{ v: 1600 },
      { v: 1400 },{ v: 1200 },{ v: 1000 },{ v: 800 },{ v: 600 },{ v: 400 },
      { v: 200 },{ v: 100 },{ v: -50 },{ v: -80 },{ v: -90 },{ v: -98 },
    ],
  },
  {
    name: 'FX Reserves',
    display: '$22.5B',
    unit: 'B USD',
    changePct: '+0.2%',
    changeDir: 'up',
    status: 'Balanced',
    description: 'Rising reserves cushion the rupee and lengthen import cover.',
    trendNote: 'Little changed',
    color: '#38bdf8',
    trend5y: withMonths([
      20,22,24,26,28.6,27,25,22,20,18,17.6,16,
      14,12,10,9,8,7.5,7,6.7,7,8,9,10,
      11,12,13,14,15,16,17,17.6,18,18.5,19,19.5,
      20,20.5,21,21,21.5,21.8,22,22,22.2,22.3,22.4,22.5,
      22.5,22.5,22.5,22.5,22.5,22.5,22.5,22.5,22.5,22.5,22.5,22.5,
    ], 2021, 0),
    monthly24: [
      { v: 10 },{ v: 11 },{ v: 12 },{ v: 13 },{ v: 14 },{ v: 15 },
      { v: 16 },{ v: 17 },{ v: 18 },{ v: 18.5 },{ v: 19 },{ v: 19.5 },
      { v: 20 },{ v: 20.5 },{ v: 21 },{ v: 21 },{ v: 21.5 },{ v: 22 },
      { v: 22 },{ v: 22.2 },{ v: 22.3 },{ v: 22.3 },{ v: 22.4 },{ v: 22.5 },
    ],
  },
  {
    name: 'USD / PKR',
    display: '277.46',
    unit: 'PKR',
    changePct: '-0.1%',
    changeDir: 'down',
    status: 'Balanced',
    description: 'A stable to stronger rupee protects returns for local and foreign investors.',
    trendNote: 'Little changed',
    color: '#f97316',
    trend5y: withMonths([
      155,160,165,170,175,180,190,200,210,220,230,240,
      245,250,255,260,265,270,275,280,285,290,295,300,
      310,317,315,310,305,300,295,290,288,286,284,282,
      280,279,278,278,278,278,278,278,278,278,278,278,
      278,278,278,278,278,278,278,278,277,277,277,277,
    ], 2021, 0),
    monthly24: [
      { v: 285 },{ v: 290 },{ v: 295 },{ v: 295 },{ v: 292 },{ v: 290 },
      { v: 288 },{ v: 286 },{ v: 284 },{ v: 282 },{ v: 281 },{ v: 280 },
      { v: 279 },{ v: 279 },{ v: 278 },{ v: 278 },{ v: 278 },{ v: 278 },
      { v: 278 },{ v: 278 },{ v: 278 },{ v: 278 },{ v: 277 },{ v: 277 },
    ],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<Status, { color: string; bg: string; border: string }> = {
  Supportive: { color: '#16a34a', bg: 'rgba(22,163,74,0.08)',  border: 'rgba(22,163,74,0.22)'  },
  Balanced:   { color: '#D97706', bg: 'rgba(217,119,6,0.08)',  border: 'rgba(217,119,6,0.22)'  },
  Drag:       { color: '#dc2626', bg: 'rgba(220,38,38,0.08)',  border: 'rgba(220,38,38,0.22)'  },
}

const uid = (n: string) => n.replace(/[\s/()/]/g, '')

function dirColor(dir: DriverDef['changeDir']) {
  return dir === 'flat' ? 'var(--text-muted)' : dir === 'up' ? 'var(--green-gain)' : 'var(--red-loss)'
}
function dirArrow(dir: DriverDef['changeDir']) {
  return dir === 'flat' ? '—' : dir === 'up' ? '↑' : '↓'
}

// ─── Driver Card ──────────────────────────────────────────────────────────────

function DriverCard({ d }: { d: DriverDef }) {
  const [hover5y, setHover5y]     = useState<{ month: string; v: number } | null>(null)
  const [sparkVal, setSparkVal]   = useState<number | null>(null)
  const sc  = STATUS_CFG[d.status]
  const id  = uid(d.name)
  const vals = d.trend5y.map(p => p.v)
  const yMin = Math.min(...vals)
  const yMax = Math.max(...vals)

  // x-axis: show only Jan of each year
  const xTicks = d.trend5y
    .map((p, i) => ({ i, label: p.month }))
    .filter(p => p.label.startsWith('Jan'))
    .map(p => p.label)

  return (
    <div style={{
      borderRadius: 8,
      border: '1px solid var(--border-subtle)',
      background: 'var(--navy-900)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>

      {/* ── Header ── */}
      <div style={{ padding: '14px 16px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
          <p style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{d.name}</p>
        </div>

        {/* Value + change */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
          <span style={{ fontSize: 20, fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1, color: 'var(--text-primary)' }}>
            {d.display}
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: dirColor(d.changeDir), display: 'flex', alignItems: 'center', gap: 4 }}>
            {dirArrow(d.changeDir)} {d.changePct}
            <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--text-muted)' }}>vs last month</span>
          </span>
        </div>

        <p style={{ fontSize: 11.5, color: 'var(--text-muted)', lineHeight: 1.55, marginBottom: 10 }}>{d.description}</p>
      </div>

      {/* ── Five-Year Trend chart ── */}
      <div>

        {/* Y-min/max + Chart */}
        <div style={{ display: 'flex', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '4px 6px 18px 16px', minWidth: 36 }}>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'right' }}>{Math.round(yMax)}</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', textAlign: 'right' }}>{Math.round(yMin)}</span>
          </div>
          <div style={{ flex: 1, height: 80 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={d.trend5y}
                margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                onMouseMove={(e: any) => {
                  if (e?.activePayload?.[0]) setHover5y(e.activePayload[0].payload)
                }}
                onMouseLeave={() => setHover5y(null)}
              >
                <defs>
                  <linearGradient id={`gMain-${id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={d.color} stopOpacity={0.28} />
                    <stop offset="100%" stopColor={d.color} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 9, fill: 'var(--text-muted)' }}
                  axisLine={false} tickLine={false}
                  ticks={xTicks}
                  height={18}
                  tickFormatter={v => v.split(' ')[1]}
                />
                <Tooltip content={() => null} />
                <Area type="monotone" dataKey="v" stroke={d.color} strokeWidth={1.5}
                  fill={`url(#gMain-${id})`} dot={false}
                  activeDot={{ r: 3, fill: d.color, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hover label below five-year chart */}
        <div style={{
          padding: '2px 16px 8px',
          minHeight: 18,
          opacity: hover5y ? 1 : 0,
          transition: 'opacity 0.12s',
          pointerEvents: 'none',
        }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {hover5y?.month}
            {hover5y && (
              <span style={{ fontWeight: 700, color: d.color, marginLeft: 6 }}>
                · {hover5y.v}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: 1, background: 'var(--border-subtle)', margin: '0 16px' }} />

      {/* ── Last 24 Months sparkline ── */}
      <div style={{ padding: '8px 16px 0' }}>
        {/* Label row — always visible; right side shows live value on hover, trendNote otherwise */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4, minHeight: 18 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Last 24 Months, The Move The Score Reads</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: d.color, transition: 'opacity 0.12s' }}>
            {sparkVal !== null ? sparkVal : d.trendNote}
          </span>
        </div>
        <div style={{ height: 32 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={d.monthly24}
              margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]) setSparkVal(e.activePayload[0].value)
              }}
              onMouseLeave={() => setSparkVal(null)}
            >
              <defs>
                <linearGradient id={`gSpark-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={d.color} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={d.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip content={() => null} />
              <Area type="monotone" dataKey="v" stroke={d.color} strokeWidth={1.2}
                fill={`url(#gSpark-${id})`} dot={false}
                activeDot={{ r: 2, fill: d.color, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ paddingBottom: 12 }} />
    </div>
  )
}

// ─── Export ───────────────────────────────────────────────────────────────────

export default function MacroDrivers() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }} className="macro-drivers-grid">
      {DRIVERS.map(d => <DriverCard key={d.name} d={d} />)}
    </div>
  )
}
