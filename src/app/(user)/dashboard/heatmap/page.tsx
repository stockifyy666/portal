'use client'

import { useState } from 'react'
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md'

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface HeatStock {
  symbol: string; name: string; sector: string
  pct: number; mktCap: number
}

const STOCKS: HeatStock[] = [
  // Banking
  { symbol:'HBL',    name:'Habib Bank',         sector:'Banking',    pct:+1.26, mktCap:144 },
  { symbol:'MEBL',   name:'Meezan Bank',         sector:'Banking',    pct:+1.65, mktCap:176 },
  { symbol:'MCB',    name:'MCB Bank',            sector:'Banking',    pct:+0.64, mktCap:105 },
  { symbol:'UBL',    name:'United Bank',         sector:'Banking',    pct:+0.98, mktCap:93  },
  { symbol:'NBP',    name:'Nat Bank Pakistan',   sector:'Banking',    pct:-0.42, mktCap:88  },
  { symbol:'ABL',    name:'Allied Bank',         sector:'Banking',    pct:+0.31, mktCap:74  },
  // Oil & Gas
  { symbol:'OGDC',   name:'OGDC',                sector:'Oil & Gas',  pct:+1.13, mktCap:246 },
  { symbol:'PPL',    name:'Pakistan Petroleum',  sector:'Oil & Gas',  pct:-0.60, mktCap:114 },
  { symbol:'PSO',    name:'Pak State Oil',       sector:'Oil & Gas',  pct:-0.88, mktCap:56  },
  { symbol:'MARI',   name:'Mari Petroleum',      sector:'Oil & Gas',  pct:+0.74, mktCap:48  },
  // Cement
  { symbol:'LUCK',   name:'Lucky Cement',        sector:'Cement',     pct:+1.67, mktCap:63  },
  { symbol:'DGKC',   name:'DG Khan Cement',      sector:'Cement',     pct:-1.77, mktCap:24  },
  { symbol:'MLCF',   name:'Maple Leaf',          sector:'Cement',     pct:+1.05, mktCap:17  },
  { symbol:'PIOC',   name:'Pioneer Cement',      sector:'Cement',     pct:+0.88, mktCap:14  },
  // Fertilizer
  { symbol:'ENGRO',  name:'Engro Corp',          sector:'Fertilizer', pct:+1.39, mktCap:49  },
  { symbol:'FFC',    name:'Fauji Fertilizer',    sector:'Fertilizer', pct:-0.28, mktCap:55  },
  { symbol:'EFERT',  name:'Engro Fertilizer',    sector:'Fertilizer', pct:+0.89, mktCap:38  },
  // Technology
  { symbol:'SYS',    name:'Systems Limited',     sector:'Technology', pct:+1.87, mktCap:75  },
  { symbol:'TRG',    name:'TRG Pakistan',        sector:'Technology', pct:+2.41, mktCap:44  },
  { symbol:'NETSOL', name:'NetSol Tech',         sector:'Technology', pct:+1.12, mktCap:12  },
  // Power
  { symbol:'HUBC',   name:'Hub Power',           sector:'Power',      pct:+0.56, mktCap:64  },
  { symbol:'KEL',    name:'K-Electric',          sector:'Power',      pct:-2.10, mktCap:28  },
  { symbol:'NCPL',   name:'Nishat Chunian Power',sector:'Power',      pct:-0.34, mktCap:18  },
  // Pharma
  { symbol:'SEARL',  name:'Searle Pakistan',     sector:'Pharma',     pct:+2.03, mktCap:15  },
  { symbol:'HINOON', name:'Highnoon Lab',         sector:'Pharma',     pct:+1.44, mktCap:11  },
  // FMCG
  { symbol:'NESTLE', name:'NestlÃ© Pakistan',      sector:'FMCG',       pct:+1.26, mktCap:161 },
  { symbol:'UNILEVER',name:'Unilever Pak',        sector:'FMCG',       pct:+0.48, mktCap:72  },
]

const SECTORS = Array.from(new Set(STOCKS.map(s => s.sector)))

function getColor(pct: number): string {
  if (pct >=  3) return '#15803d'
  if (pct >=  2) return '#16a34a'
  if (pct >=  1) return '#22c55e'
  if (pct >=  0.5) return '#4ade80'
  if (pct >=  0) return '#86efac'
  if (pct >= -0.5) return '#fca5a5'
  if (pct >= -1) return '#f87171'
  if (pct >= -2) return '#ef4444'
  return '#dc2626'
}

function getTextColor(pct: number): string {
  return Math.abs(pct) >= 0.5 ? '#fff' : '#111'
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function HeatmapPage() {
  const [view, setView] = useState<'sector' | 'all'>('sector')

  const tabs = [
    { key: 'sector' as const, label: 'By Sector' },
    { key: 'all'    as const, label: 'All Stocks' },
  ]

  const advancers = STOCKS.filter(s => s.pct > 0).length
  const decliners = STOCKS.filter(s => s.pct < 0).length
  const unchanged = STOCKS.filter(s => s.pct === 0).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{
            padding: '8px 18px', fontSize: 13, fontWeight: view === t.key ? 700 : 500,
            cursor: 'pointer', border: 'none', background: 'none',
            color: view === t.key ? 'var(--brand-gold)' : 'var(--text-muted)',
            borderBottom: `2px solid ${view === t.key ? 'var(--brand-gold)' : 'transparent'}`,
            marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Market Heatmap</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Visual market overview "” tile size reflects market cap, color reflects % change</p>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { label: '> +2%',  color: '#16a34a' },
            { label: '+1~2%',  color: '#22c55e' },
            { label: '0~+1%',  color: '#86efac' },
            { label: '0~âˆ’1%',  color: '#fca5a5' },
            { label: 'âˆ’1~âˆ’2%', color: '#ef4444' },
            { label: '< âˆ’2%',  color: '#dc2626' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 12 }}>
        {[
          { label: 'Advancing', value: advancers, color: 'var(--green-gain)' },
          { label: 'Declining', value: decliners, color: 'var(--red-loss)'   },
          { label: 'Unchanged', value: unchanged, color: 'var(--text-muted)'  },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '10px 16px', minWidth: 100 }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</p>
            <p style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      {view === 'sector' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {SECTORS.map(sector => {
            const stocks = STOCKS.filter(s => s.sector === sector)
            const avgPct = stocks.reduce((a, s) => a + s.pct, 0) / stocks.length
            return (
              <div key={sector} style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)' }}>{sector}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: avgPct >= 0 ? 'var(--green-gain)' : 'var(--red-loss)' }}>
                    {avgPct >= 0 ? <MdTrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /> : <MdTrendingDown size={12} style={{ display: 'inline', verticalAlign: 'middle' }} />}
                    {' '}{avgPct >= 0 ? '+' : ''}{avgPct.toFixed(2)}% avg
                  </span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: 10 }}>
                  {stocks.sort((a, b) => b.mktCap - a.mktCap).map(s => {
                    const size = Math.max(64, Math.min(140, s.mktCap * 0.6))
                    return (
                      <div key={s.symbol} style={{
                        width: size, height: size * 0.7,
                        borderRadius: 8, background: getColor(s.pct),
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'opacity 0.15s', padding: 4,
                      }}
                        title={`${s.name}: ${s.pct >= 0 ? '+' : ''}${s.pct.toFixed(2)}%`}
                        onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                        onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                      >
                        <span style={{ fontSize: Math.max(10, size * 0.1), fontWeight: 800, color: getTextColor(s.pct), lineHeight: 1.1 }}>{s.symbol}</span>
                        <span style={{ fontSize: Math.max(9, size * 0.09), fontWeight: 600, color: getTextColor(s.pct), opacity: 0.9 }}>{s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {STOCKS.sort((a, b) => b.mktCap - a.mktCap).map(s => {
              const size = Math.max(64, Math.min(150, s.mktCap * 0.55))
              return (
                <div key={s.symbol} style={{
                  width: size, height: size * 0.7,
                  borderRadius: 8, background: getColor(s.pct),
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'opacity 0.15s', padding: 4,
                }}
                  title={`${s.name} (${s.sector}): ${s.pct >= 0 ? '+' : ''}${s.pct.toFixed(2)}%`}
                  onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                  onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                >
                  <span style={{ fontSize: Math.max(10, size * 0.1), fontWeight: 800, color: getTextColor(s.pct), lineHeight: 1.1 }}>{s.symbol}</span>
                  <span style={{ fontSize: Math.max(9, size * 0.09), fontWeight: 600, color: getTextColor(s.pct), opacity: 0.9 }}>{s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}

