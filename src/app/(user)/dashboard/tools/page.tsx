'use client'

import { useState } from 'react'
import {
  MdCalculate, MdPercent, MdSavings, MdCurrencyExchange,
  MdTrendingUp, MdAccountBalance, MdStarRate, MdAutoGraph,
  MdKeyboardArrowDown, MdKeyboardArrowUp,
} from 'react-icons/md'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, dec = 2) {
  return n.toLocaleString('en-PK', { minimumFractionDigits: dec, maximumFractionDigits: dec })
}

const inputStyle = {
  width: '100%', padding: '8px 12px', borderRadius: 8,
  border: '1px solid var(--border-subtle)', background: 'var(--navy-800)',
  color: 'var(--text-primary)', fontSize: 13, outline: 'none',
}
const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
  marginBottom: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em',
}
const resultRow = (label: string, value: string, highlight = false) => (
  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
    <span style={{ fontSize: 13, fontWeight: highlight ? 700 : 600, color: highlight ? 'var(--brand-gold)' : 'var(--text-primary)' }}>{value}</span>
  </div>
)
const calcBtn = (onClick: () => void) => (
  <button onClick={onClick} style={{
    width: '100%', padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 700,
    cursor: 'pointer', border: 'none', background: 'var(--brand-gold)', color: '#fff', marginTop: 4,
  }}>Calculate</button>
)

// ─── Individual calculators ───────────────────────────────────────────────────

function BrokerageCalc() {
  const [shares,  setShares]  = useState('')
  const [price,   setPrice]   = useState('')
  const [broker,  setBroker]  = useState('0.15')
  const [result,  setResult]  = useState<null | Record<string, string>>(null)

  function calc() {
    const qty = +shares, px = +price, br = +broker / 100
    if (!qty || !px) return
    const value      = qty * px
    const brokerage  = value * br
    const cdc        = value * 0.001   // 0.10% CDC charges
    const secp       = value * 0.0001  // 0.01% SECP fee
    const total      = brokerage + cdc + secp
    setResult({
      'Trade Value':   `PKR ${fmt(value, 0)}`,
      'Brokerage':     `PKR ${fmt(brokerage)}`,
      'CDC Charges':   `PKR ${fmt(cdc)}`,
      'SECP Fee':      `PKR ${fmt(secp)}`,
      'Total Cost':    `PKR ${fmt(total)}`,
      'Net Payable':   `PKR ${fmt(value + total, 0)}`,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Shares</label><input type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="e.g. 1000" style={inputStyle} /></div>
        <div><label style={labelStyle}>Price (PKR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 200" style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>Brokerage Rate (%)</label><input type="number" step="0.01" value={broker} onChange={e => setBroker(e.target.value)} style={inputStyle} /></div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v, k === 'Net Payable'))}</div>}
    </div>
  )
}

function ReturnCalc() {
  const [invested, setInvested] = useState('')
  const [current,  setCurrent]  = useState('')
  const [months,   setMonths]   = useState('')
  const [result,   setResult]   = useState<null | Record<string, string>>(null)

  function calc() {
    const inv = +invested, cur = +current, mo = +months || 1
    if (!inv || !cur) return
    const gain    = cur - inv
    const pct     = (gain / inv) * 100
    const annPct  = (Math.pow(cur / inv, 12 / mo) - 1) * 100
    setResult({
      'Gain / Loss':          `PKR ${fmt(gain, 0)}`,
      'Return':               `${pct >= 0 ? '+' : ''}${fmt(pct)}%`,
      'Annualised Return':    `${annPct >= 0 ? '+' : ''}${fmt(annPct)}%`,
      'Holding Period':       `${mo} month${mo !== 1 ? 's' : ''}`,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Invested (PKR)</label><input type="number" value={invested} onChange={e => setInvested(e.target.value)} placeholder="e.g. 100000" style={inputStyle} /></div>
        <div><label style={labelStyle}>Current Value (PKR)</label><input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="e.g. 125000" style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>Holding Period (months)</label><input type="number" value={months} onChange={e => setMonths(e.target.value)} placeholder="e.g. 12" style={inputStyle} /></div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v, k === 'Return'))}</div>}
    </div>
  )
}

function ZakatCalc() {
  const [shares,   setShares]   = useState('')
  const [price,    setPrice]    = useState('')
  const [cash,     setCash]     = useState('')
  const [result,   setResult]   = useState<null | Record<string, string>>(null)
  const NISAB_PKR = 122000   // approximate nisab in PKR (85g gold @ ~1435/g)

  function calc() {
    const equity = (+shares || 0) * (+price || 0)
    const total  = equity + (+cash || 0)
    const zakat  = total >= NISAB_PKR ? total * 0.025 : 0
    setResult({
      'Equity Value':    `PKR ${fmt(equity, 0)}`,
      'Cash & Other':    `PKR ${fmt(+cash || 0, 0)}`,
      'Total Assets':    `PKR ${fmt(total, 0)}`,
      'Nisab Threshold': `PKR ${fmt(NISAB_PKR, 0)}`,
      'Zakat Due (2.5%)': total >= NISAB_PKR ? `PKR ${fmt(zakat, 0)}` : 'Below Nisab — not due',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Shares Held</label><input type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="e.g. 500" style={inputStyle} /></div>
        <div><label style={labelStyle}>Market Price (PKR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 200" style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>Cash & Other Assets (PKR)</label><input type="number" value={cash} onChange={e => setCash(e.target.value)} placeholder="e.g. 50000" style={inputStyle} /></div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v, k === 'Zakat Due (2.5%)'))}</div>}
    </div>
  )
}

function DividendCalc() {
  const [shares,   setShares]   = useState('')
  const [dps,      setDps]      = useState('')
  const [price,    setPrice]    = useState('')
  const [wht,      setWht]      = useState('15')
  const [result,   setResult]   = useState<null | Record<string, string>>(null)

  function calc() {
    const q = +shares, d = +dps, p = +price, w = +wht / 100
    if (!q || !d) return
    const gross  = q * d
    const tax    = gross * w
    const net    = gross - tax
    const yield_ = p > 0 ? (d / p) * 100 : 0
    setResult({
      'Gross Dividend':  `PKR ${fmt(gross, 0)}`,
      'WHT Deducted':    `PKR ${fmt(tax, 0)}`,
      'Net Dividend':    `PKR ${fmt(net, 0)}`,
      'Dividend Yield':  p > 0 ? `${fmt(yield_)}%` : '—',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Shares</label><input type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="e.g. 1000" style={inputStyle} /></div>
        <div><label style={labelStyle}>DPS (PKR)</label><input type="number" step="0.01" value={dps} onChange={e => setDps(e.target.value)} placeholder="e.g. 5.00" style={inputStyle} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Market Price (PKR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 200" style={inputStyle} /></div>
        <div><label style={labelStyle}>WHT (%)</label><input type="number" step="0.5" value={wht} onChange={e => setWht(e.target.value)} style={inputStyle} /></div>
      </div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v, k === 'Net Dividend'))}</div>}
    </div>
  )
}

function CompoundCalc() {
  const [principal, setPrincipal] = useState('')
  const [rate,      setRate]      = useState('')
  const [years,     setYears]     = useState('')
  const [freq,      setFreq]      = useState('12')
  const [result,    setResult]    = useState<null | Record<string, string>>(null)

  function calc() {
    const p = +principal, r = +rate / 100, n = +freq, t = +years
    if (!p || !r || !t) return
    const amount  = p * Math.pow(1 + r / n, n * t)
    const interest = amount - p
    setResult({
      'Principal':         `PKR ${fmt(p, 0)}`,
      'Total Interest':    `PKR ${fmt(interest, 0)}`,
      'Final Amount':      `PKR ${fmt(amount, 0)}`,
      'Effective Rate':    `${fmt((Math.pow(1 + r / n, n) - 1) * 100)}% p.a.`,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Principal (PKR)</label><input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} placeholder="e.g. 100000" style={inputStyle} /></div>
        <div><label style={labelStyle}>Annual Rate (%)</label><input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. 17.5" style={inputStyle} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Years</label><input type="number" value={years} onChange={e => setYears(e.target.value)} placeholder="e.g. 3" style={inputStyle} /></div>
        <div>
          <label style={labelStyle}>Compounding</label>
          <select value={freq} onChange={e => setFreq(e.target.value)} style={inputStyle}>
            <option value="1">Annually</option>
            <option value="2">Semi-annually</option>
            <option value="4">Quarterly</option>
            <option value="12">Monthly</option>
          </select>
        </div>
      </div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v, k === 'Final Amount'))}</div>}
    </div>
  )
}

function CurrencyCalc() {
  const [amount,  setAmount]  = useState('')
  const [from,    setFrom]    = useState('USD')
  const [result,  setResult]  = useState<null | Record<string, string>>(null)
  const RATES: Record<string, number> = { USD: 278.50, EUR: 305.20, GBP: 355.80, AED: 75.85, SAR: 74.20, GBP2: 355.8 }

  function calc() {
    if (!amount || !+amount) return
    const res: Record<string, string> = {}
    if (from === 'PKR') {
      Object.entries(RATES).forEach(([cur, rate]) => {
        if (cur !== 'GBP2') res[`PKR → ${cur}`] = `${(+amount / rate).toFixed(4)} ${cur}`
      })
    } else {
      const pkr = +amount * (RATES[from] ?? 1)
      res[`${from} → PKR`] = `PKR ${fmt(pkr, 2)}`
      Object.entries(RATES).forEach(([cur, rate]) => {
        if (cur !== from && cur !== 'GBP2') res[`${from} → ${cur}`] = `${((pkr) / rate).toFixed(4)} ${cur}`
      })
    }
    setResult(res)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Amount</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="e.g. 1000" style={inputStyle} /></div>
        <div>
          <label style={labelStyle}>From Currency</label>
          <select value={from} onChange={e => setFrom(e.target.value)} style={inputStyle}>
            <option value="PKR">PKR — Pakistani Rupee</option>
            <option value="USD">USD — US Dollar</option>
            <option value="EUR">EUR — Euro</option>
            <option value="GBP">GBP — British Pound</option>
            <option value="AED">AED — UAE Dirham</option>
            <option value="SAR">SAR — Saudi Riyal</option>
          </select>
        </div>
      </div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v))}</div>}
    </div>
  )
}

function PositionCalc() {
  const [capital,  setCapital]  = useState('')
  const [risk,     setRisk]     = useState('2')
  const [entry,    setEntry]    = useState('')
  const [stop,     setStop]     = useState('')
  const [result,   setResult]   = useState<null | Record<string, string>>(null)

  function calc() {
    const cap = +capital, r = +risk / 100, en = +entry, sl = +stop
    if (!cap || !en || !sl || en <= sl) return
    const riskAmt  = cap * r
    const perShare = en - sl
    const shares   = Math.floor(riskAmt / perShare)
    const position = shares * en
    setResult({
      'Risk Amount':       `PKR ${fmt(riskAmt, 0)}`,
      'Risk per Share':    `PKR ${fmt(perShare)}`,
      'Shares to Buy':     `${shares.toLocaleString()} shares`,
      'Position Size':     `PKR ${fmt(position, 0)}`,
      '% of Capital':      `${fmt((position / cap) * 100)}%`,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Total Capital (PKR)</label><input type="number" value={capital} onChange={e => setCapital(e.target.value)} placeholder="e.g. 500000" style={inputStyle} /></div>
        <div><label style={labelStyle}>Risk per Trade (%)</label><input type="number" step="0.5" value={risk} onChange={e => setRisk(e.target.value)} style={inputStyle} /></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Entry Price (PKR)</label><input type="number" value={entry} onChange={e => setEntry(e.target.value)} placeholder="e.g. 200" style={inputStyle} /></div>
        <div><label style={labelStyle}>Stop-Loss Price (PKR)</label><input type="number" value={stop} onChange={e => setStop(e.target.value)} placeholder="e.g. 185" style={inputStyle} /></div>
      </div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v, k === 'Shares to Buy'))}</div>}
    </div>
  )
}

function PECalc() {
  const [price,  setPrice]  = useState('')
  const [eps,    setEps]    = useState('')
  const [growth, setGrowth] = useState('')
  const [result, setResult] = useState<null | Record<string, string>>(null)

  function calc() {
    const p = +price, e = +eps, g = +growth
    if (!p || !e) return
    const pe       = p / e
    const peg      = g > 0 ? pe / g : null
    const fair     = g > 0 ? e * g : null
    setResult({
      'P/E Ratio':       `${fmt(pe)}x`,
      'EPS':             `PKR ${fmt(e)}`,
      'PEG Ratio':       peg ? `${fmt(peg)}` : '—',
      'PEG Fair Value':  fair ? `PKR ${fmt(fair)}` : '—',
      'Premium/Discount': fair ? `${fmt(((p - fair) / fair) * 100)}%` : '—',
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <div><label style={labelStyle}>Market Price (PKR)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 200" style={inputStyle} /></div>
        <div><label style={labelStyle}>EPS (PKR)</label><input type="number" step="0.01" value={eps} onChange={e => setEps(e.target.value)} placeholder="e.g. 15" style={inputStyle} /></div>
      </div>
      <div><label style={labelStyle}>EPS Growth Rate (% p.a.)</label><input type="number" value={growth} onChange={e => setGrowth(e.target.value)} placeholder="e.g. 20 (optional)" style={inputStyle} /></div>
      {calcBtn(calc)}
      {result && <div style={{ marginTop: 4 }}>{Object.entries(result).map(([k, v]) => resultRow(k, v, k === 'P/E Ratio'))}</div>}
    </div>
  )
}

// ─── Tool definitions ─────────────────────────────────────────────────────────

interface Tool {
  id: string
  icon: React.ReactNode
  title: string
  desc: string
  component: (resetKey: number) => React.ReactNode
}

const TOOLS: Tool[] = [
  { id: 'brokerage', icon: <MdCalculate size={22} />,       title: 'Brokerage Calculator',      desc: 'Calculate brokerage, CDC and SECP charges on a trade',      component: (k) => <BrokerageCalc key={k} /> },
  { id: 'return',    icon: <MdTrendingUp size={22} />,       title: 'Return Calculator',         desc: 'Calculate absolute and annualised return on investment',     component: (k) => <ReturnCalc key={k} /> },
  { id: 'zakat',     icon: <MdStarRate size={22} />,         title: 'Zakat Calculator',          desc: 'Calculate Zakat due on equity holdings and cash assets',     component: (k) => <ZakatCalc key={k} /> },
  { id: 'dividend',  icon: <MdSavings size={22} />,          title: 'Dividend Calculator',       desc: 'Compute gross and net dividend income after WHT',            component: (k) => <DividendCalc key={k} /> },
  { id: 'compound',  icon: <MdAutoGraph size={22} />,        title: 'Compound Interest',         desc: 'Project growth of capital with compound interest over time', component: (k) => <CompoundCalc key={k} /> },
  { id: 'currency',  icon: <MdCurrencyExchange size={22} />, title: 'Currency Converter',        desc: 'Convert between PKR, USD, EUR, GBP, AED and SAR',           component: (k) => <CurrencyCalc key={k} /> },
  { id: 'position',  icon: <MdPercent size={22} />,          title: 'Position Size Calculator',  desc: 'Calculate optimal trade size based on risk % and stop-loss', component: (k) => <PositionCalc key={k} /> },
  { id: 'pe',        icon: <MdAccountBalance size={22} />,   title: 'P/E & PEG Calculator',      desc: 'Evaluate valuation and fair value using P/E and PEG ratios', component: (k) => <PECalc key={k} /> },
]

// ─── Tool card ────────────────────────────────────────────────────────────────

interface ToolCardProps {
  tool: Tool
  isOpen: boolean
  onToggle: () => void
  resetKey: number
  onReset: () => void
}

function ToolCard({ tool, isOpen, onToggle, resetKey, onReset }: ToolCardProps) {
  return (
    <div style={{
      borderRadius: 8,
      border: `1px solid ${isOpen ? 'rgba(217,119,6,0.35)' : 'var(--border-subtle)'}`,
      background: 'var(--navy-900)', overflow: 'hidden',
      transition: 'border-color 0.2s',
    }}>
      {/* Header */}
      <button onClick={onToggle} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 8, flexShrink: 0,
          background: isOpen ? 'rgba(217,119,6,0.14)' : 'rgba(217,119,6,0.08)',
          border: `1px solid ${isOpen ? 'rgba(217,119,6,0.35)' : 'rgba(217,119,6,0.15)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--brand-gold)', transition: 'all 0.2s',
        }}>
          {tool.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{tool.title}</p>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{tool.desc}</p>
        </div>
        <span style={{
          color: 'var(--text-muted)', flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
        }}>
          <MdKeyboardArrowDown size={20} />
        </span>
      </button>

      {/* Expanded body — max-height transition for smooth open/close */}
      <div style={{
        maxHeight: isOpen ? 800 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid var(--border-subtle)' }}>
          {/* Reset button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, marginBottom: 4 }}>
            <button onClick={onReset} style={{
              padding: '4px 12px', borderRadius: 8, fontSize: 11.5, fontWeight: 600,
              cursor: 'pointer', border: '1px solid var(--border-subtle)',
              background: 'var(--navy-800)', color: 'var(--text-muted)',
            }}>
              Reset
            </button>
          </div>
          {tool.component(resetKey)}
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ToolsPage() {
  const [openId,    setOpenId]    = useState<string | null>(null)
  const [resetKeys, setResetKeys] = useState<Record<string, number>>({})

  function toggle(id: string) {
    setOpenId(prev => prev === id ? null : id)
  }

  function reset(id: string) {
    setResetKeys(prev => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }))
  }

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Tools</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Financial calculators for PSX investors</p>
      </div>

      {/* ── Two independent columns ── */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[TOOLS.filter((_, i) => i % 2 === 0), TOOLS.filter((_, i) => i % 2 === 1)].map((col, ci) => (
          <div key={ci} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {col.map(t => (
              <ToolCard
                key={t.id}
                tool={t}
                isOpen={openId === t.id}
                onToggle={() => toggle(t.id)}
                resetKey={resetKeys[t.id] ?? 0}
                onReset={() => reset(t.id)}
              />
            ))}
          </div>
        ))}
      </div>

    </div>
  )
}
