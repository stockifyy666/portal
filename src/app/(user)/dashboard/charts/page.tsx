'use client'

import { useState, useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts'

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const STOCKS: Record<string, { price: number; change: number; pct: number; high52: number; low52: number; vol: string; mktCap: string; pe: string; sector: string }> = {
  'KSE-100': { price: 166315, change: 897.8,  pct: 0.54,  high52: 170200, low52: 130400, vol: '—',    mktCap: '—',     pe: '—',   sector: 'Index'      },
  'ENGRO':   { price: 305.40, change: 4.20,   pct: 1.39,  high52: 350.00, low52: 240.50, vol: '5.2M', mktCap: '48.9B', pe: '8.2', sector: 'Fertilizer' },
  'HBL':     { price: 188.75, change: 2.35,   pct: 1.26,  high52: 210.00, low52: 155.20, vol: '8.4M', mktCap: '144B',  pe: '7.1', sector: 'Banking'    },
  'LUCK':    { price: 915.00, change: 15.00,  pct: 1.67,  high52: 980.00, low52: 720.00, vol: '0.9M', mktCap: '63.5B', pe: '12.4',sector: 'Cement'     },
  'OGDC':    { price: 161.30, change: 1.80,   pct: 1.13,  high52: 185.50, low52: 140.00, vol: '12.1M',mktCap: '246B',  pe: '5.8', sector: 'Oil & Gas'  },
  'MEBL':    { price: 190.80, change: 3.10,   pct: 1.65,  high52: 210.00, low52: 155.00, vol: '8.4M', mktCap: '176B',  pe: '6.4', sector: 'Banking'    },
  'SYS':     { price: 680.50, change: 12.50,  pct: 1.87,  high52: 750.00, low52: 510.00, vol: '2.1M', mktCap: '74.9B', pe: '22.1',sector: 'Technology' },
  'PPL':     { price: 133.50, change: -0.80,  pct: -0.60, high52: 158.00, low52: 115.00, vol: '6.8M', mktCap: '114B',  pe: '5.2', sector: 'Oil & Gas'  },
}

const TIMEFRAMES = ['1D', '1W', '1M', '3M', '6M', '1Y']

function genOHLC(base: number, days: number) {
  const data = []
  let close = base * 0.93
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.47) * base * 0.012
    const open = close
    close = Math.max(base * 0.7, close + change)
    const high = Math.max(open, close) * (1 + Math.random() * 0.008)
    const low  = Math.min(open, close) * (1 - Math.random() * 0.008)
    const vol  = Math.round(200000 + Math.random() * 800000)
    data.push({ i: i + 1, close: +close.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), volume: vol })
  }
  data[days - 1].close = base
  return data
}

const DAYS_MAP: Record<string, number> = { '1D': 24, '1W': 7, '1M': 30, '3M': 90, '6M': 180, '1Y': 365 }

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--navy-900)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>PKR {payload[0].value?.toLocaleString()}</p>
    </div>
  )
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ChartsPage() {
  const [symbol,    setSymbol]    = useState('KSE-100')
  const [timeframe, setTimeframe] = useState('1M')

  const stock = STOCKS[symbol]
  const up = stock.change >= 0
  const data = useMemo(() => genOHLC(stock.price, DAYS_MAP[timeframe]), [symbol, timeframe])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Charts</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Interactive price charts for PSX stocks and indices</p>
        </div>
        <select value={symbol} onChange={e => setSymbol(e.target.value)} style={{
          padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)',
          background: 'var(--navy-900)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer',
        }}>
          {Object.keys(STOCKS).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Symbol header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {stock.price.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 8 }}>PKR</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: up ? 'var(--green-gain)' : 'var(--red-loss)', background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', borderRadius: 6, padding: '4px 10px' }}>
          {up ? '+' : ''}{stock.change.toFixed(2)} ({up ? '+' : ''}{stock.pct.toFixed(2)}%)
        </span>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{stock.sector}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 16 }}>

        {/* Chart */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Timeframe */}
          <div style={{ display: 'flex', gap: 0 }}>
            {TIMEFRAMES.map(tf => (
              <button key={tf} onClick={() => setTimeframe(tf)} style={{
                padding: '6px 14px', fontSize: 12.5, fontWeight: timeframe === tf ? 700 : 500,
                cursor: 'pointer', border: 'none', background: 'none',
                color: timeframe === tf ? 'var(--brand-gold)' : 'var(--text-muted)',
                borderBottom: `2px solid ${timeframe === tf ? 'var(--brand-gold)' : 'transparent'}`,
                marginBottom: -2, transition: 'all 0.15s',
              }}>{tf}</button>
            ))}
          </div>

          {/* Area chart */}
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={up ? '#16A34A' : '#DC2626'} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={up ? '#16A34A' : '#DC2626'} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="i" tick={false} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={60} domain={['auto', 'auto']} tickFormatter={v => v.toLocaleString()} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="close" name="Price" stroke={up ? '#16A34A' : '#DC2626'} strokeWidth={2} fill="url(#priceGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>

          {/* Volume */}
          <ResponsiveContainer width="100%" height={70}>
            <BarChart data={data} barSize={3}>
              <XAxis dataKey="i" tick={false} axisLine={false} tickLine={false} />
              <YAxis tick={false} axisLine={false} tickLine={false} width={60} />
              <Bar dataKey="volume" fill="var(--navy-700)" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: -8 }}>Volume</p>
        </div>

        {/* Stats panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Key Stats</p>
            {[
              { label: '52W High',    value: stock.high52.toLocaleString() },
              { label: '52W Low',     value: stock.low52.toLocaleString()  },
              { label: 'Volume',      value: stock.vol     },
              { label: 'Market Cap',  value: stock.mktCap !== '—' ? `PKR ${stock.mktCap}` : '—' },
              { label: 'P/E Ratio',   value: stock.pe      },
              { label: 'Sector',      value: stock.sector  },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* 52W range */}
          <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>52-Week Range</p>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--navy-800)', overflow: 'hidden', marginBottom: 6 }}>
              <div style={{
                height: '100%',
                marginLeft: `${((stock.price - stock.low52) / (stock.high52 - stock.low52)) * 85}%`,
                width: '15%', borderRadius: 3,
                background: up ? 'var(--green-gain)' : 'var(--red-loss)',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)' }}>
              <span>{stock.low52.toLocaleString()}</span>
              <span>{stock.high52.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

