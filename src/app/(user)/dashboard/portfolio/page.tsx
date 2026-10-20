'use client'

import { useState, useMemo } from 'react'
import { MdAdd, MdClose, MdDelete, MdTrendingUp, MdTrendingDown } from 'react-icons/md'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area,
} from 'recharts'

// â"€â"€â"€ Types â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

interface Holding {
  id: number
  symbol: string
  qty: number
  buyPrice: number
  commission: number
  currentPrice: number
}

// â"€â"€â"€ Data â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

const MARKET_PRICES: Record<string, number> = {
  'ENGRO': 305.40, 'HBL': 188.75, 'LUCK': 915.00, 'MCB': 250.10,
  'OGDC': 161.30, 'PPL': 133.50, 'PSO': 362.20, 'SYS': 680.50,
  'MEBL': 190.80, 'UBL': 215.60, 'EFERT': 102.40, 'FFC': 140.20,
  'SEARL': 105.70, 'NESTLE': 6850.0, 'DGKC': 105.50, 'MLCF': 67.30,
  'KEL': 8.40, 'HUBC': 144.70, 'LOTCHEM': 38.20, 'PKGS': 680.00,
}

const SYMBOLS = Object.keys(MARKET_PRICES).sort()

const SEED: Holding[] = [
  { id: 1, symbol: 'ENGRO', qty: 500,  buyPrice: 285.00, commission: 0.15, currentPrice: MARKET_PRICES['ENGRO'] },
  { id: 2, symbol: 'HBL',   qty: 1000, buyPrice: 175.50, commission: 0.15, currentPrice: MARKET_PRICES['HBL']   },
  { id: 3, symbol: 'LUCK',  qty: 200,  buyPrice: 870.00, commission: 0.15, currentPrice: MARKET_PRICES['LUCK']  },
  { id: 4, symbol: 'OGDC',  qty: 2000, buyPrice: 155.00, commission: 0.15, currentPrice: MARKET_PRICES['OGDC']  },
]

const CHART_COLORS = ['#D97706', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4', '#84cc16']

// Simulated 30-day portfolio value history
const HISTORY = [
  820000, 815000, 830000, 828000, 840000, 835000, 845000, 842000, 855000,
  860000, 858000, 870000, 865000, 878000, 880000, 875000, 885000, 890000,
  888000, 895000, 900000, 897000, 910000, 908000, 920000, 918000, 930000,
  935000, 940000, 847050,
].map((v, i) => ({ day: `Day ${i + 1}`, value: v }))

// â"€â"€â"€ Helpers â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function invested(h: Holding)  { return h.qty * h.buyPrice * (1 + h.commission / 100) }
function marketVal(h: Holding) { return h.qty * h.currentPrice }
function pnl(h: Holding)       { return marketVal(h) - invested(h) }
function pnlPct(h: Holding)    { return (pnl(h) / invested(h)) * 100 }
function fmt(n: number, dec = 2) {
  return n.toLocaleString('en-PK', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

// â"€â"€â"€ Summary card â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function SummaryCard({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean | null }) {
  const isNeutral = up === null || up === undefined
  const color  = isNeutral ? 'var(--text-secondary)'    : up ? 'var(--green-gain)' : 'var(--red-loss)'
  const bg     = isNeutral ? 'var(--navy-900)'           : up ? 'rgba(22,163,74,0.05)' : 'rgba(220,38,38,0.05)'
  const border = isNeutral ? 'var(--border-subtle)'      : up ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'
  return (
    <div style={{ borderRadius: 8, background: bg, border: `1px solid ${border}`, padding: '14px 16px', minWidth: 0 }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color, lineHeight: 1, marginBottom: 4 }}>{value}</p>
      {sub && (
        <p style={{ fontSize: 12, fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 3 }}>
          {up ? <MdTrendingUp size={13} /> : <MdTrendingDown size={13} />} {sub}
        </p>
      )}
    </div>
  )
}

// â"€â"€â"€ Custom tooltip â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--navy-900)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 12px', fontSize: 12 }}>
      {label && <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color || 'var(--text-primary)', fontWeight: 600 }}>
          {p.name}: {typeof p.value === 'number' && p.value > 1000 ? `PKR ${fmt(p.value, 0)}` : p.value}
        </p>
      ))}
    </div>
  )
}

// â"€â"€â"€ Add-stock modal â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

function AddStockModal({ onAdd, onClose }: { onAdd: (h: Omit<Holding, 'id' | 'currentPrice'>) => void; onClose: () => void }) {
  const [symbol, setSymbol] = useState('')
  const [customSym, setCustomSym] = useState('')
  const [qty, setQty] = useState('')
  const [buyPrice, setBuyPrice] = useState('')
  const [commission, setCommission] = useState('0.15')
  const [error, setError] = useState('')

  const finalSym = symbol === '__custom__' ? customSym.trim().toUpperCase() : symbol

  function handleAdd() {
    if (!finalSym)         return setError('Please select or enter a stock symbol.')
    if (!qty || +qty <= 0) return setError('Quantity must be greater than 0.')
    if (!buyPrice || +buyPrice <= 0) return setError('Buy price must be greater than 0.')
    onAdd({ symbol: finalSym, qty: +qty, buyPrice: +buyPrice, commission: +commission || 0 })
    onClose()
  }

  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 13, outline: 'none' }
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, display: 'block' as const }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 40 }} />
      <div className="modal-box" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 420, background: 'var(--navy-900)', borderRadius: 8, border: '1px solid var(--border-subtle)', padding: '24px 24px 20px', zIndex: 50, boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700 }}>Add Stock to Portfolio</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}><MdClose size={20} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>Stock Symbol</label>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} style={inputStyle}>
              <option value="">-- Select symbol --</option>
              {SYMBOLS.map(s => <option key={s} value={s}>{s}</option>)}
              <option value="__custom__">Other (type manually)</option>
            </select>
          </div>
          {symbol === '__custom__' && (
            <div><label style={labelStyle}>Enter Symbol</label><input value={customSym} onChange={e => setCustomSym(e.target.value)} placeholder="e.g. BAFL" style={inputStyle} /></div>
          )}
          <div><label style={labelStyle}>Quantity (shares)</label><input type="number" min="1" value={qty} onChange={e => setQty(e.target.value)} placeholder="e.g. 500" style={inputStyle} /></div>
          <div><label style={labelStyle}>Buy Price (PKR per share)</label><input type="number" min="0" step="0.01" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder="e.g. 285.00" style={inputStyle} /></div>
          <div>
            <label style={labelStyle}>Commission / Brokerage (%)</label>
            <input type="number" min="0" step="0.01" value={commission} onChange={e => setCommission(e.target.value)} style={inputStyle} />
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Default 0.15% "" includes brokerage + CDC charges</p>
          </div>
          {error && <p style={{ fontSize: 12, color: 'var(--red-loss)', fontWeight: 600 }}>{error}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{ flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-secondary)' }}>Cancel</button>
            <button onClick={handleAdd} style={{ flex: 2, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: 'var(--brand-gold)', color: '#fff' }}>Add Stock</button>
          </div>
        </div>
      </div>
    </>
  )
}

// â"€â"€â"€ Page â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€â"€

let _id = SEED.length + 1

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>(SEED)
  const [showModal, setShowModal] = useState(false)

  function addHolding(h: Omit<Holding, 'id' | 'currentPrice'>) {
    const price = MARKET_PRICES[h.symbol] ?? h.buyPrice
    setHoldings(prev => [...prev, { ...h, id: _id++, currentPrice: price }])
  }

  function removeHolding(id: number) {
    setHoldings(prev => prev.filter(h => h.id !== id))
  }

  const totalInvested = useMemo(() => holdings.reduce((s, h) => s + invested(h), 0), [holdings])
  const totalMarket   = useMemo(() => holdings.reduce((s, h) => s + marketVal(h), 0), [holdings])
  const totalPnl      = totalMarket - totalInvested
  const totalPnlPct   = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0
  const grossPayouts  = useMemo(() => holdings.reduce((s, h) => s + h.qty * h.buyPrice * (h.commission / 100), 0), [holdings])
  const todayPnl      = useMemo(() => holdings.reduce((s, h) => s + marketVal(h) * 0.0031, 0), [holdings])
  const upTotal       = totalPnl >= 0
  const upToday       = todayPnl >= 0

  // Chart data
  const allocationData = useMemo(() => holdings.map(h => ({
    name: h.symbol,
    value: Math.round(marketVal(h)),
  })), [holdings])

  const pnlBarData = useMemo(() => holdings.map(h => ({
    symbol: h.symbol,
    pnl: Math.round(pnl(h)),
    pct: +pnlPct(h).toFixed(2),
    up: pnl(h) >= 0,
  })), [holdings])

  const investedVsMarket = useMemo(() => holdings.map(h => ({
    symbol: h.symbol,
    Invested: Math.round(invested(h)),
    'Market Value': Math.round(marketVal(h)),
  })), [holdings])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Portfolio</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{holdings.length} holding{holdings.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', background: 'var(--brand-gold)', color: '#fff' }}>
          <MdAdd size={18} /> Add Stock
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 10 }} className="portfolio-cards">
        <SummaryCard label="Invested"     value={`PKR ${fmt(totalInvested, 0)}`} up={null} />
        <SummaryCard label="Market Value" value={`PKR ${fmt(totalMarket, 0)}`}   up={null} />
        <SummaryCard label="Total P&L"    value={`PKR ${fmt(Math.abs(totalPnl), 0)}`} sub={`${upTotal ? '+' : '-'}${Math.abs(totalPnlPct).toFixed(2)}%`} up={upTotal} />
        <SummaryCard label="Commission"   value={`PKR ${fmt(grossPayouts, 0)}`}  up={null} />
        <SummaryCard label="Today P&L"    value={`PKR ${fmt(Math.abs(todayPnl), 0)}`} sub={`${upToday ? '+' : '-'}${((Math.abs(todayPnl) / totalMarket) * 100).toFixed(2)}%`} up={upToday} />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }} className="reports-featured">

        {/* Allocation donut */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Allocation</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {allocationData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip content={<ChartTooltip />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* P&L per stock bar chart */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>P&L per Stock (PKR)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pnlBarData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="symbol" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={50} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="pnl" name="P&L" radius={[4,4,0,0]}>
                {pnlBarData.map((d, i) => <Cell key={i} fill={d.up ? '#16A34A' : '#DC2626'} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio value history */}
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>30-Day Value</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={HISTORY}>
              <defs>
                <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D97706" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="day" tick={false} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={55} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="#D97706" strokeWidth={2} fill="url(#portfolioGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Invested vs Market Value chart */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px' }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Invested vs Market Value</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={investedVsMarket} barSize={28} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
            <XAxis dataKey="symbol" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} width={60} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<ChartTooltip />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Invested"     fill="#94A3B8" radius={[4,4,0,0]} />
            <Bar dataKey="Market Value" fill="#D97706" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Holdings table */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Holdings</span>
        </div>
        <div className="table-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 750 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Symbol', 'Qty', 'Buy Price', 'Curr. Price', 'Invested', 'Mkt Value', 'P&L', '% P&L', 'Commission', ''].map((col, i) => (
                  <th key={i} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: i === 0 ? 'left' : 'right', whiteSpace: 'nowrap' }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.length === 0 && (
                <tr><td colSpan={10} style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>No holdings yet "" click Add Stock to get started.</td></tr>
              )}
              {holdings.map((h, idx) => {
                const inv   = invested(h)
                const mv    = marketVal(h)
                const pl    = pnl(h)
                const plp   = pnlPct(h)
                const up    = pl >= 0
                const color = up ? 'var(--green-gain)' : 'var(--red-loss)'
                const comm  = h.qty * h.buyPrice * (h.commission / 100)
                return (
                  <tr key={h.id} className="tr-hover" style={{ borderBottom: idx < holdings.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <td style={{ padding: '10px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: CHART_COLORS[idx % CHART_COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{h.symbol}</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{h.qty.toLocaleString()}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{fmt(h.buyPrice)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{fmt(h.currentPrice)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{fmt(inv, 0)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{fmt(mv, 0)}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color }}>{up ? '+' : '-'}PKR {fmt(Math.abs(pl), 0)}</span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color, background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)', borderRadius: 4, padding: '2px 7px' }}>
                        {up ? '+' : ''}{plp.toFixed(2)}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontSize: 13, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{fmt(comm, 0)}</td>
                    <td style={{ padding: '10px 10px', textAlign: 'right' }}>
                      <button onClick={() => removeHolding(h.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 4, transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--red-loss)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                        <MdDelete size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <AddStockModal onAdd={addHolding} onClose={() => setShowModal(false)} />}
    </div>
  )
}


