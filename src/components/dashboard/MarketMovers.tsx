'use client'

import { useState, useMemo } from 'react'

const HEIGHTS = [240,200,160,120,104,96,88,80,64,56,52,48,44,40,36,32,28,24,20,16]

type Stock = { symbol: string; name: string; price: number; change: number; volume?: number }
type SortMode = 'change' | 'volume'

function GainersChart({ data, sort }: { data: Stock[]; sort: SortMode }) {
  const sorted = useMemo(() => {
    const list = [...data]
    if (sort === 'volume') list.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
    else list.sort((a, b) => b.change - a.change)
    return list
  }, [data, sort])

  const BAR_MAX_H = 240

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Bars + % labels */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: BAR_MAX_H + 28 }}>
        {sorted.map((s, i) => {
          const h = HEIGHTS[i] ?? 16
          return (
            <div key={s.symbol} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green-gain)', marginBottom: 4, whiteSpace: 'nowrap' }}>
                {sort === 'volume' && s.volume
                  ? `${(s.volume / 1_000_000).toFixed(1)}M`
                  : `+${s.change.toFixed(2)}%`}
              </span>
              <div style={{
                width: '100%', height: h, borderRadius: '4px 4px 0 0',
                background: 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: '0 0 8px rgba(34,197,94,0.2)',
                minWidth: 18,
              }} />
            </div>
          )
        })}
      </div>
      {/* Baseline */}
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      {/* Symbols */}
      <div style={{ display: 'flex', gap: 6, padding: '6px 0 14px' }}>
        {sorted.map(s => (
          <div key={s.symbol} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.02em', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {s.symbol}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function LosersChart({ data, sort }: { data: Stock[]; sort: SortMode }) {
  const sorted = useMemo(() => {
    const list = [...data]
    if (sort === 'volume') list.sort((a, b) => (b.volume ?? 0) - (a.volume ?? 0))
    else list.sort((a, b) => Math.abs(b.change) - Math.abs(a.change))
    return list
  }, [data, sort])

  const BAR_MAX_H = 240

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Symbols */}
      <div style={{ display: 'flex', gap: 6, padding: '14px 0 6px' }}>
        {sorted.map(s => (
          <div key={s.symbol} style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--text-secondary)', letterSpacing: '0.02em', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {s.symbol}
            </span>
          </div>
        ))}
      </div>
      {/* Baseline */}
      <div style={{ height: 1, background: 'var(--border-subtle)' }} />
      {/* Bars hanging downward + labels */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, height: BAR_MAX_H + 28 }}>
        {sorted.map((s, i) => {
          const h = HEIGHTS[i] ?? 16
          return (
            <div key={s.symbol} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', height: '100%' }}>
              <div style={{
                width: '100%', height: h, borderRadius: '0 0 4px 4px',
                background: 'linear-gradient(180deg, #dc2626 0%, #b91c1c 100%)',
                boxShadow: '0 0 8px rgba(220,38,38,0.2)',
                minWidth: 18,
              }} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--red-loss)', marginTop: 4, whiteSpace: 'nowrap' }}>
                {sort === 'volume' && s.volume
                  ? `${(s.volume / 1_000_000).toFixed(1)}M`
                  : `-${Math.abs(s.change).toFixed(2)}%`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SortToggle({ value, onChange }: { value: SortMode; onChange: (v: SortMode) => void }) {
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {(['change', 'volume'] as SortMode[]).map(opt => (
        <button key={opt} onClick={() => onChange(opt)} style={{
          padding: '6px 14px', fontSize: 12.5, fontWeight: value === opt ? 700 : 500,
          cursor: 'pointer', border: 'none', background: 'none',
          color: value === opt ? 'var(--brand-gold)' : 'var(--text-muted)',
          borderBottom: `2px solid ${value === opt ? 'var(--brand-gold)' : 'transparent'}`,
          transition: 'all 0.15s',
        }}>
          {opt === 'change' ? '% Change' : 'Volume'}
        </button>
      ))}
    </div>
  )
}

interface Props {
  gainers: Stock[]
  losers: Stock[]
}

export default function MarketMovers({ gainers, losers }: Props) {
  const [gainSort, setGainSort] = useState<SortMode>('change')
  const [lossSort, setLossSort] = useState<SortMode>('change')

  return (
    <>
      {/* Top Gainers */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green-gain)', display: 'inline-block' }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Top Gainers</span>
          </div>
          <SortToggle value={gainSort} onChange={setGainSort} />
        </div>
        <div style={{ background: 'var(--navy-900)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '20px 20px 0' }}>
          <GainersChart data={gainers} sort={gainSort} />
        </div>
      </div>

      {/* Top Losers */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red-loss)', display: 'inline-block' }} />
            <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Top Losers</span>
          </div>
          <SortToggle value={lossSort} onChange={setLossSort} />
        </div>
        <div style={{ background: 'var(--navy-900)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0 20px 20px' }}>
          <LosersChart data={losers} sort={lossSort} />
        </div>
      </div>
    </>
  )
}
