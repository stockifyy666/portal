'use client'

import { useState, useMemo } from 'react'
import { MdSearch, MdFilterList, MdArrowUpward, MdArrowDownward } from 'react-icons/md'

// ─── Data ─────────────────────────────────────────────────────────────────────

interface Stock {
  symbol: string; name: string; sector: string
  price: number; change: number; pct: number
  volume: number; mktCap: number; pe: number | null
  pbv: number; roe: number; divYield: number
}

const STOCKS: Stock[] = [
  { symbol:'ENGRO',  name:'Engro Corp',       sector:'Fertilizer', price:305.40, change:+4.20,  pct:+1.39, volume:5200000,  mktCap:48900, pe:8.2,  pbv:1.2, roe:14.8, divYield:5.2 },
  { symbol:'HBL',    name:'Habib Bank',        sector:'Banking',    price:188.75, change:+2.35,  pct:+1.26, volume:8400000,  mktCap:144000,pe:7.1,  pbv:1.0, roe:13.2, divYield:6.8 },
  { symbol:'LUCK',   name:'Lucky Cement',      sector:'Cement',     price:915.00, change:+15.0,  pct:+1.67, volume:900000,   mktCap:63500, pe:12.4, pbv:2.1, roe:17.5, divYield:2.1 },
  { symbol:'OGDC',   name:'OGDC',              sector:'Oil & Gas',  price:161.30, change:+1.80,  pct:+1.13, volume:12100000, mktCap:246000,pe:5.8,  pbv:0.8, roe:13.6, divYield:7.4 },
  { symbol:'MEBL',   name:'Meezan Bank',       sector:'Banking',    price:190.80, change:+3.10,  pct:+1.65, volume:8400000,  mktCap:176000,pe:6.4,  pbv:1.8, roe:31.4, divYield:4.2 },
  { symbol:'SYS',    name:'Systems Limited',   sector:'Technology', price:680.50, change:+12.5,  pct:+1.87, volume:2100000,  mktCap:74900, pe:22.1, pbv:8.4, roe:38.2, divYield:1.8 },
  { symbol:'PPL',    name:'Pakistan Petrol',   sector:'Oil & Gas',  price:133.50, change:-0.80,  pct:-0.60, volume:6800000,  mktCap:114000,pe:5.2,  pbv:0.7, roe:12.1, divYield:8.2 },
  { symbol:'PSO',    name:'Pakistan State Oil',sector:'Oil & Gas',  price:362.20, change:-3.20,  pct:-0.88, volume:4100000,  mktCap:56400, pe:4.1,  pbv:0.6, roe:14.9, divYield:14.2},
  { symbol:'MCB',    name:'MCB Bank',          sector:'Banking',    price:250.10, change:+1.60,  pct:+0.64, volume:3200000,  mktCap:105000,pe:6.8,  pbv:1.3, roe:19.4, divYield:7.6 },
  { symbol:'FFC',    name:'Fauji Fertilizer',  sector:'Fertilizer', price:140.20, change:-0.40,  pct:-0.28, volume:4600000,  mktCap:54900, pe:6.9,  pbv:3.8, roe:55.2, divYield:12.4},
  { symbol:'EFERT',  name:'Engro Fertilizer',  sector:'Fertilizer', price:102.40, change:+0.90,  pct:+0.89, volume:3100000,  mktCap:38400, pe:7.4,  pbv:2.1, roe:28.4, divYield:9.8 },
  { symbol:'UBL',    name:'United Bank',       sector:'Banking',    price:215.60, change:+2.10,  pct:+0.98, volume:2800000,  mktCap:92800, pe:6.2,  pbv:1.1, roe:17.8, divYield:8.4 },
  { symbol:'DGKC',   name:'DG Khan Cement',    sector:'Cement',     price:105.50, change:-1.90,  pct:-1.77, volume:3200000,  mktCap:24100, pe:null, pbv:0.7, roe:-2.1, divYield:0   },
  { symbol:'KEL',    name:'K-Electric',        sector:'Power',      price:8.40,   change:-0.18,  pct:-2.10, volume:42300000, mktCap:28100, pe:null, pbv:0.8, roe:-1.4, divYield:0   },
  { symbol:'HUBC',   name:'Hub Power',         sector:'Power',      price:144.70, change:+0.80,  pct:+0.56, volume:5400000,  mktCap:64400, pe:8.9,  pbv:2.4, roe:27.1, divYield:8.6 },
  { symbol:'SEARL',  name:'Searle Pakistan',   sector:'Pharma',     price:105.70, change:+2.10,  pct:+2.03, volume:1200000,  mktCap:14800, pe:14.2, pbv:3.1, roe:22.4, divYield:3.2 },
  { symbol:'NESTLE', name:'Nestle Pakistan',   sector:'FMCG',       price:6850.0, change:+85.0,  pct:+1.26, volume:120000,   mktCap:161000,pe:28.4, pbv:14.2,roe:50.1, divYield:2.4 },
  { symbol:'MLCF',   name:'Maple Leaf Cement', sector:'Cement',     price:67.30,  change:+0.70,  pct:+1.05, volume:8900000,  mktCap:17400, pe:null, pbv:0.5, roe:-3.2, divYield:0   },
]

const SECTORS = ['All', ...Array.from(new Set(STOCKS.map(s => s.sector))).sort()]

type SortKey = keyof Stock
type SortDir = 'asc' | 'desc'

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScreenerPage() {
  const [sector,   setSector]   = useState('All')
  const [search,   setSearch]   = useState('')
  const [minPct,   setMinPct]   = useState('')
  const [maxPe,    setMaxPe]    = useState('')
  const [minDiv,   setMinDiv]   = useState('')
  const [sortKey,  setSortKey]  = useState<SortKey>('mktCap')
  const [sortDir,  setSortDir]  = useState<SortDir>('desc')

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let list = STOCKS.filter(s => {
      if (sector !== 'All' && s.sector !== sector) return false
      if (search && !s.symbol.toLowerCase().includes(search.toLowerCase()) && !s.name.toLowerCase().includes(search.toLowerCase())) return false
      if (minPct  && s.pct < +minPct)               return false
      if (maxPe   && (s.pe === null || s.pe > +maxPe)) return false
      if (minDiv  && s.divYield < +minDiv)           return false
      return true
    })
    list = [...list].sort((a, b) => {
      const av = a[sortKey] ?? -Infinity
      const bv = b[sortKey] ?? -Infinity
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [sector, search, minPct, maxPe, minDiv, sortKey, sortDir])

  const cols: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
    { key: 'symbol',   label: 'Symbol',     align: 'left'  },
    { key: 'price',    label: 'Price',      align: 'right' },
    { key: 'pct',      label: '% Change',   align: 'right' },
    { key: 'volume',   label: 'Volume',     align: 'right' },
    { key: 'mktCap',   label: 'Mkt Cap (M)',align: 'right' },
    { key: 'pe',       label: 'P/E',        align: 'right' },
    { key: 'roe',      label: 'ROE %',      align: 'right' },
    { key: 'divYield', label: 'Div Yield',  align: 'right' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom: 4 }}>Stock Screener</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Filter and rank PSX stocks by fundamentals, price action and dividends</p>
      </div>

      {/* Filters */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <MdFilterList size={15} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Filters</span>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {/* Search */}
          <div style={{ position: 'relative', width: 200 }}>
            <MdSearch size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search symbol or name…"
              style={{ width: '100%', paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7, borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none' }} />
          </div>
          {/* Sector */}
          <select value={sector} onChange={e => setSector(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none', cursor: 'pointer' }}>
            {SECTORS.map(s => <option key={s}>{s}</option>)}
          </select>
          {/* Min % change */}
          <input type="number" value={minPct} onChange={e => setMinPct(e.target.value)} placeholder="Min % change"
            style={{ width: 130, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none' }} />
          {/* Max PE */}
          <input type="number" value={maxPe} onChange={e => setMaxPe(e.target.value)} placeholder="Max P/E"
            style={{ width: 110, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none' }} />
          {/* Min Div */}
          <input type="number" value={minDiv} onChange={e => setMinDiv(e.target.value)} placeholder="Min Div Yield %"
            style={{ width: 150, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none' }} />
          {/* Reset */}
          <button onClick={() => { setSector('All'); setSearch(''); setMinPct(''); setMaxPe(''); setMinDiv('') }}
            style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-muted)' }}>
            Reset
          </button>
        </div>
      </div>

      {/* Results count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showing <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong> of {STOCKS.length} stocks</span>
      </div>

      {/* Table */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div className="table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {cols.map(c => (
                  <th key={c.key} onClick={() => toggleSort(c.key)}
                    style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: sortKey === c.key ? 'var(--brand-gold)' : 'var(--text-muted)', textAlign: c.align, cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                      {c.label}
                      {sortKey === c.key && (sortDir === 'asc' ? <MdArrowUpward size={11} /> : <MdArrowDownward size={11} />)}
                    </span>
                  </th>
                ))}
                <th style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left' }}>Sector</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No stocks match your filters.</td></tr>
              )}
              {filtered.map((s, i) => (
                <tr key={s.symbol} className="tr-hover" style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.symbol}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>
                    {s.price.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: s.pct >= 0 ? 'var(--green-gain)' : 'var(--red-loss)', background: s.pct >= 0 ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', borderRadius: 4, padding: '2px 7px' }}>
                      {s.pct >= 0 ? '+' : ''}{s.pct.toFixed(2)}%
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>{(s.volume / 1_000_000).toFixed(1)}M</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>{(s.mktCap / 1000).toFixed(1)}B</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>{s.pe ?? '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: s.roe >= 0 ? 'var(--green-gain)' : 'var(--red-loss)', fontWeight: 600 }}>{s.roe.toFixed(1)}%</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>{s.divYield > 0 ? `${s.divYield}%` : '—'}</td>
                  <td style={{ padding: '10px 14px', textAlign: 'left' }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', background: 'var(--navy-800)', borderRadius: 4, padding: '2px 8px' }}>{s.sector}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}
