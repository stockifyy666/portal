'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'

const INDICES = ['KSE 100', 'KSE 30', 'KMI 30', 'KMI All Share', 'All Shares']

const RANGES = ['1D', '1W', '1M', '3M', '6M', '1Y']

function generateData(points: number, base: number, volatility: number, isIntraday: boolean) {
  const data = []
  let val = base
  const step = isIntraday ? 5 * 60 * 1000 : 24 * 60 * 60 * 1000
  const startMs = isIntraday
    ? (() => { const d = new Date(); d.setHours(9, 0, 0, 0); return d.getTime() })()
    : Date.now() - points * step
  for (let i = 0; i <= points; i++) {
    val = val + (Math.random() - 0.49) * volatility
    const t = new Date(startMs + i * step)
    data.push({
      time: isIntraday
        ? t.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        : t.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(val),
    })
  }
  return data
}

const BASE: Record<string, number> = {
  'KSE 100': 165320, 'KSE 30': 58412, 'KMI 30': 94807,
  'KMI All Share': 44215, 'All Shares': 51630,
}
const VOL: Record<string, number> = {
  'KSE 100': 800, 'KSE 30': 300, 'KMI 30': 500,
  'KMI All Share': 200, 'All Shares': 250,
}
const POINTS: Record<string, number> = { '1D': 78, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 252 }

interface TooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--navy-900)', border: '1px solid var(--border-subtle)',
      borderRadius: 8, padding: '8px 12px', fontSize: 12,
    }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
      <p style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
        {payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export default function MarketChart() {
  const [activeIndex, setActiveIndex] = useState('KSE 100')
  const [activeRange, setActiveRange] = useState('1M')
  const [data, setData] = useState<{ time: string; value: number }[]>([])

  useEffect(() => {
    setData(generateData(POINTS[activeRange], BASE[activeIndex], VOL[activeIndex], activeRange === '1D'))
  }, [activeIndex, activeRange])
  const first = data[0]?.value ?? 0
  const last  = data[data.length - 1]?.value ?? 0
  const up    = last >= first
  const color = up ? 'var(--green-gain)' : 'var(--red-loss)'
  const fillId = up ? 'areaGreen' : 'areaRed'

  return (
    <div className="card-hover" style={{
      background: 'var(--navy-900)', border: '1px solid var(--border-subtle)',
      borderRadius: 8, padding: '16px 16px', cursor: 'default',
    }}>
      {/* Index tabs — scrollable row */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', marginBottom: 10, paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 8, width: 'max-content' }}>
          {INDICES.map(idx => (
            <button key={idx} onClick={() => setActiveIndex(idx)} style={{
              padding: '5px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap',
              background: activeIndex === idx ? 'var(--brand-gold)' : 'var(--navy-800)',
              color: activeIndex === idx ? '#fff' : 'var(--text-secondary)',
            }}>
              {idx}
            </button>
          ))}
        </div>
      </div>

      {/* Value + change + range tabs on same row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            {last.toLocaleString()}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color }}>
            {up ? '▲' : '▼'} {Math.abs(((last - first) / first) * 100).toFixed(2)}%
          </span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {up ? '+' : ''}{(last - first).toLocaleString()} pts
          </span>
        </div>

        {/* Range tabs */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          {RANGES.map(r => (
            <button key={r} onClick={() => setActiveRange(r)} style={{
              padding: '4px 9px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: 'none', transition: 'all 0.15s',
              background: activeRange === r ? color : 'transparent',
              color: activeRange === r ? '#fff' : 'var(--text-muted)',
            }}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="areaGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#16A34A" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#16A34A" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="areaRed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#DC2626" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#DC2626" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--border-subtle)" />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                 tickLine={false} axisLine={false}
                 interval="preserveStartEnd"
                 minTickGap={40} />
          <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
                 tickLine={false} axisLine={false} width={58}
                 tickFormatter={(v: number) => v.toLocaleString()} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '4 2' }} />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2}
                fill={`url(#${fillId})`} dot={false} activeDot={{ r: 4, fill: color, strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
