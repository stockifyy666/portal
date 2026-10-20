'use client'

import { useState, useMemo } from 'react'
import { MdAdd, MdClose, MdDelete, MdTableRows, MdGridView } from 'react-icons/md'

// ─── Stock universe ───────────────────────────────────────────────────────────

interface StockMeta {
  symbol: string
  company: string
  sector: string
  price: number
  change: number
  pct: number
  volume: string
}

const UNIVERSE: StockMeta[] = [
  { symbol: 'ENGRO',   company: 'Engro Corporation',               sector: 'Fertilizers',      price: 305.40, change:  1.80, pct:  0.59, volume: '1.2M' },
  { symbol: 'EFERT',   company: 'Engro Fertilizers Ltd',           sector: 'Fertilizers',      price: 102.40, change:  0.65, pct:  0.64, volume: '980K' },
  { symbol: 'FFC',     company: 'Fauji Fertilizer Company',        sector: 'Fertilizers',      price: 140.20, change: -0.90, pct: -0.64, volume: '540K' },
  { symbol: 'HBL',     company: 'Habib Bank Limited',              sector: 'Banking',          price: 188.75, change:  1.25, pct:  0.67, volume: '2.1M' },
  { symbol: 'MCB',     company: 'MCB Bank Limited',                sector: 'Banking',          price: 250.10, change: -1.40, pct: -0.56, volume: '890K' },
  { symbol: 'MEBL',    company: 'Meezan Bank Limited',             sector: 'Banking',          price: 190.80, change:  2.10, pct:  1.11, volume: '3.4M' },
  { symbol: 'UBL',     company: 'United Bank Limited',             sector: 'Banking',          price: 215.60, change:  0.80, pct:  0.37, volume: '760K' },
  { symbol: 'OGDC',    company: 'Oil & Gas Dev. Company',          sector: 'Oil & Gas',        price: 161.30, change: -0.70, pct: -0.43, volume: '4.2M' },
  { symbol: 'PPL',     company: 'Pakistan Petroleum Ltd',          sector: 'Oil & Gas',        price: 133.50, change:  0.50, pct:  0.38, volume: '1.8M' },
  { symbol: 'PSO',     company: 'Pakistan State Oil',              sector: 'Oil & Gas',        price: 362.20, change: -2.30, pct: -0.63, volume: '620K' },
  { symbol: 'LUCK',    company: 'Lucky Cement Ltd',                sector: 'Cement',           price: 915.00, change:  5.50, pct:  0.60, volume: '310K' },
  { symbol: 'DGKC',    company: 'D.G. Khan Cement',               sector: 'Cement',           price: 105.50, change: -1.20, pct: -1.13, volume: '420K' },
  { symbol: 'MLCF',    company: 'Maple Leaf Cement',              sector: 'Cement',           price:  67.30, change:  0.30, pct:  0.45, volume: '880K' },
  { symbol: 'SYS',     company: 'Systems Limited',                 sector: 'Technology',       price: 680.50, change:  4.20, pct:  0.62, volume: '190K' },
  { symbol: 'NESTLE',  company: 'Nestlé Pakistan Ltd',             sector: 'Food & Beverages', price: 6850.0, change: 25.00, pct:  0.37, volume: '12K'  },
  { symbol: 'SEARL',   company: 'The Searle Company',              sector: 'Pharma',           price: 105.70, change: -0.80, pct: -0.75, volume: '230K' },
  { symbol: 'HUBC',    company: 'Hub Power Company',               sector: 'Power',            price: 144.70, change:  1.10, pct:  0.77, volume: '1.4M' },
  { symbol: 'KEL',     company: 'K-Electric Limited',              sector: 'Power',            price:   8.40, change: -0.15, pct: -1.75, volume: '6.8M' },
  { symbol: 'PKGS',    company: 'Packages Limited',                sector: 'Paper & Board',    price: 680.00, change:  3.50, pct:  0.52, volume: '45K'  },
  { symbol: 'LOTCHEM', company: 'Lotte Chemical Pakistan',         sector: 'Chemicals',        price:  38.20, change: -0.40, pct: -1.04, volume: '570K' },
]

const SYMBOL_MAP = Object.fromEntries(UNIVERSE.map(s => [s.symbol, s]))
const SYMBOLS    = UNIVERSE.map(s => s.symbol).sort()

// ─── Seed watchlist ───────────────────────────────────────────────────────────

interface WatchItem extends StockMeta { id: number; addedPrice: number }

const SEED: WatchItem[] = [
  { id: 1, ...SYMBOL_MAP['HBL'],   addedPrice: 182.50 },
  { id: 2, ...SYMBOL_MAP['OGDC'],  addedPrice: 158.00 },
  { id: 3, ...SYMBOL_MAP['LUCK'],  addedPrice: 890.00 },
  { id: 4, ...SYMBOL_MAP['MEBL'],  addedPrice: 185.00 },
  { id: 5, ...SYMBOL_MAP['SYS'],   addedPrice: 660.00 },
]

let _id = SEED.length + 1

// ─── Add modal ────────────────────────────────────────────────────────────────

function AddModal({ existing, onAdd, onClose }: {
  existing: Set<string>
  onAdd: (item: WatchItem) => void
  onClose: () => void
}) {
  const [symbol, setSymbol] = useState('')
  const [error,  setError]  = useState('')

  const available = SYMBOLS.filter(s => !existing.has(s))

  function handleAdd() {
    if (!symbol) return setError('Please select a stock.')
    const meta = SYMBOL_MAP[symbol]
    if (!meta) return setError('Stock not found.')
    onAdd({ id: _id++, ...meta, addedPrice: meta.price })
    onClose()
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid var(--border-subtle)', background: 'var(--navy-800)',
    color: 'var(--text-primary)', fontSize: 13, outline: 'none',
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 40 }} />
      <div className="modal-box" style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 380, background: 'var(--navy-900)', borderRadius: 8,
        border: '1px solid var(--border-subtle)', padding: '24px 24px 20px',
        zIndex: 50, boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Add to Watchlist</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
            <MdClose size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 5, display: 'block' }}>Stock Symbol</label>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} style={inputStyle}>
              <option value="">— Select symbol —</option>
              {available.map(s => (
                <option key={s} value={s}>{s} — {SYMBOL_MAP[s].company}</option>
              ))}
            </select>
            {symbol && SYMBOL_MAP[symbol] && (
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                Sector: {SYMBOL_MAP[symbol].sector} &nbsp;·&nbsp; Current price: PKR {SYMBOL_MAP[symbol].price.toFixed(2)}
              </p>
            )}
          </div>

          {error && <p style={{ fontSize: 12, color: 'var(--red-loss)', fontWeight: 600 }}>{error}</p>}

          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: '1px solid var(--border-subtle)',
              background: 'var(--navy-800)', color: 'var(--text-secondary)',
            }}>Cancel</button>
            <button onClick={handleAdd} style={{
              flex: 2, padding: '9px 0', borderRadius: 8, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', border: 'none',
              background: 'var(--brand-gold)', color: '#fff',
            }}>Add to Watchlist</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Table ────────────────────────────────────────────────────────────────────

function WatchTable({ rows, onDelete }: { rows: WatchItem[]; onDelete: (id: number) => void }) {
  return (
    <div className="table-scroll">
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 680, tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: 100 }} />
          <col />
          <col style={{ width: 120 }} />
          <col style={{ width: 100 }} />
          <col style={{ width: 90 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 80 }} />
          <col style={{ width: 44 }} />
        </colgroup>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {['Symbol', 'Company', 'Added Price', 'Price', 'Change', '% CHG', 'Volume', ''].map((col, i) => (
              <th key={i} style={{
                padding: '8px 14px', fontSize: 11, fontWeight: 700,
                letterSpacing: '0.05em', textTransform: 'uppercase',
                color: 'var(--text-muted)', textAlign: i <= 1 ? 'left' : 'right',
                whiteSpace: 'nowrap', background: 'var(--navy-900)',
              }}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((item, idx) => {
            const up    = item.change >= 0
            const color = up ? 'var(--green-gain)' : 'var(--red-loss)'
            return (
              <tr key={item.id} style={{ borderBottom: idx < rows.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ padding: '7px 14px' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>{item.symbol}</span>
                </td>
                <td style={{ padding: '7px 14px', fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {item.company}
                </td>
                <td style={{ padding: '7px 14px', textAlign: 'right', fontSize: 13, color: 'var(--text-muted)' }}>
                  {item.addedPrice.toFixed(2)}
                </td>
                <td style={{ padding: '7px 14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {item.price.toFixed(2)}
                </td>
                <td style={{ padding: '7px 14px', textAlign: 'right', fontSize: 13, fontWeight: 600, color }}>
                  {up ? '+' : ''}{item.change.toFixed(2)}
                </td>
                <td style={{ padding: '7px 14px', textAlign: 'right' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>
                    {up ? '+' : ''}{item.pct.toFixed(2)}%
                  </span>
                </td>
                <td style={{ padding: '7px 14px', textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>
                  {item.volume}
                </td>
                <td style={{ padding: '7px 10px', textAlign: 'right' }}>
                  <button onClick={() => onDelete(item.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 4 }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--red-loss)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                  >
                    <MdDelete size={15} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type ViewMode = 'list' | 'sector'

export default function WatchlistPage() {
  const [items,     setItems]     = useState<WatchItem[]>(SEED)
  const [view,      setView]      = useState<ViewMode>('list')
  const [showModal, setShowModal] = useState(false)

  function addItem(item: WatchItem) { setItems(prev => [...prev, item]) }
  function deleteItem(id: number)   { setItems(prev => prev.filter(i => i.id !== id)) }

  const existing   = useMemo(() => new Set(items.map(i => i.symbol)), [items])
  const gaining    = items.filter(i => i.change >= 0).length
  const losing     = items.filter(i => i.change < 0).length
  const sectors    = useMemo(() => [...new Set(items.map(i => i.sector))], [items])

  const grouped = useMemo(() => {
    const map: Record<string, WatchItem[]> = {}
    items.forEach(item => {
      if (!map[item.sector]) map[item.sector] = []
      map[item.sector].push(item)
    })
    return map
  }, [items])

  const iconBtnStyle = (active: boolean) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 34, height: 34, borderRadius: 8, border: 'none', cursor: 'pointer',
    background: active ? 'var(--brand-gold)' : 'var(--navy-800)',
    color: active ? '#fff' : 'var(--text-muted)',
  })

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 2 }}>Watchlist</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Stocks you are tracking</p>
      </div>

      {/* ── Row 1: Stats pills ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {[
          { label: 'Total',   val: items.length,  color: 'var(--text-primary)', bg: 'var(--navy-800)' },
          { label: 'Gaining', val: gaining,        color: 'var(--green-gain)',   bg: 'rgba(22,163,74,0.08)' },
          { label: 'Losing',  val: losing,         color: 'var(--red-loss)',     bg: 'rgba(220,38,38,0.08)' },
          { label: 'Sectors', val: sectors.length, color: 'var(--text-primary)', bg: 'var(--navy-800)' },
        ].map(({ label, val, color, bg }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 12px', borderRadius: 8, background: bg, border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{val}</span>
          </div>
        ))}
      </div>

      {/* ── Row 2: View toggles (left) + Add Stock (right) ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={iconBtnStyle(view === 'list')} onClick={() => setView('list')} title="List view">
            <MdTableRows size={17} />
          </button>
          <button style={iconBtnStyle(view === 'sector')} onClick={() => setView('sector')} title="Sector view">
            <MdGridView size={17} />
          </button>
        </div>
        <button onClick={() => setShowModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
          cursor: 'pointer', border: 'none',
          background: 'var(--brand-gold)', color: '#fff', whiteSpace: 'nowrap',
        }}>
          <MdAdd size={18} /> Add Stock
        </button>
      </div>

      {/* ── Empty state ── */}
      {items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          No stocks in your watchlist — click Add Stock to get started.
        </div>
      )}

      {/* ── List view ── */}
      {view === 'list' && items.length > 0 && (
        <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
          <WatchTable rows={items} onDelete={deleteItem} />
        </div>
      )}

      {/* ── Sector view ── */}
      {view === 'sector' && items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(grouped).map(([sector, rows]) => {
            const sectorGaining = rows.filter(r => r.change >= 0).length
            const sectorLosing  = rows.filter(r => r.change < 0).length
            return (
              <div key={sector} style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
                {/* Sector header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--navy-900)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{sector}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--navy-700)', borderRadius: 8, padding: '1px 8px', fontWeight: 600 }}>
                      {rows.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {sectorGaining > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-gain)' }}>▲ {sectorGaining}</span>
                    )}
                    {sectorLosing > 0 && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--red-loss)' }}>▼ {sectorLosing}</span>
                    )}
                  </div>
                </div>
                <WatchTable rows={rows} onDelete={deleteItem} />
              </div>
            )
          })}
        </div>
      )}

      {/* ── Modal ── */}
      {showModal && <AddModal existing={existing} onAdd={addItem} onClose={() => setShowModal(false)} />}

    </div>
  )
}
