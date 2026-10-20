'use client'

import { useState, useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MdSearch, MdArrowUpward, MdArrowDownward, MdUnfoldMore, MdClose, MdKeyboardArrowDown } from 'react-icons/md'

// ─── Data ─────────────────────────────────────────────────────────────────────

const INDICES  = ['All Indices', 'KSE 100', 'KSE 30', 'KMI 30', 'KMI All Share', 'All Shares']
const SECTORS  = ['All Sectors', 'Banking', 'Cement', 'Energy', 'Fertilizer', 'Technology', 'Textile', 'Pharma', 'Auto', 'Food']

const STOCKS = [
  // Banking
  { symbol: 'HBL',    company: 'Habib Bank Limited',              price: 185.40, change: +2.25,  pct: +1.24, vol: '2.1M',  w52h: 198.60, w52l: 142.30, sector: 'Banking',    indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'MCB',    company: 'MCB Bank Limited',                price: 312.60, change: -1.19,  pct: -0.38, vol: '1.3M',  w52h: 340.00, w52l: 240.50, sector: 'Banking',    indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'UBL',    company: 'United Bank Limited',             price: 238.75, change: +2.06,  pct: +0.87, vol: '980K',  w52h: 260.80, w52l: 185.20, sector: 'Banking',    indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'BAFL',   company: 'Bank Alfalah Limited',            price: 56.20,  change: +0.30,  pct: +0.54, vol: '3.2M',  w52h: 65.40,  w52l: 40.10,  sector: 'Banking',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'ABL',    company: 'Allied Bank Limited',             price: 128.90, change: -1.46,  pct: -1.12, vol: '760K',  w52h: 148.00, w52l: 102.50, sector: 'Banking',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'BOP',    company: 'The Bank of Punjab',              price: 28.53,  change: +0.12,  pct: +0.42, vol: '1.9M',  w52h: 34.70,  w52l: 20.80,  sector: 'Banking',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'MEBL',   company: 'Meezan Bank Limited',             price: 198.30, change: +2.06,  pct: +1.05, vol: '1.5M',  w52h: 218.50, w52l: 155.40, sector: 'Banking',    indices: ['KSE 100', 'KSE 30', 'KMI 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'FABL',   company: 'Faysal Bank Limited',             price: 38.40,  change: +0.40,  pct: +1.05, vol: '2.4M',  w52h: 46.00,  w52l: 28.00,  sector: 'Banking',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'NBP',    company: 'National Bank of Pakistan',       price: 62.10,  change: -0.55,  pct: -0.88, vol: '1.1M',  w52h: 76.00,  w52l: 48.00,  sector: 'Banking',    indices: ['KSE 100', 'KSE 30', 'All Shares'] },
  { symbol: 'SNBL',   company: 'Soneri Bank Limited',             price: 22.30,  change: +0.18,  pct: +0.81, vol: '880K',  w52h: 28.00,  w52l: 16.50,  sector: 'Banking',    indices: ['KSE 100', 'All Shares'] },
  { symbol: 'AKBL',   company: 'Askari Bank Limited',             price: 35.80,  change: -0.30,  pct: -0.83, vol: '1.2M',  w52h: 44.00,  w52l: 26.00,  sector: 'Banking',    indices: ['KSE 100', 'All Shares'] },
  { symbol: 'BAHL',   company: 'Bank AL Habib Limited',           price: 92.30,  change: +1.10,  pct: +1.21, vol: '1.8M',  w52h: 108.50, w52l: 72.60,  sector: 'Banking',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'JSBL',   company: 'JS Bank Limited',                 price: 12.45,  change: +0.10,  pct: +0.81, vol: '6.1M',  w52h: 17.20,  w52l: 8.90,   sector: 'Banking',    indices: ['KSE 100', 'All Shares'] },
  // Cement
  { symbol: 'LUCK',   company: 'Lucky Cement',                    price: 710.00, change: +5.22,  pct: +0.74, vol: '420K',  w52h: 780.00, w52l: 580.00, sector: 'Cement',     indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'MLCF',   company: 'Maple Leaf Cement',               price: 41.20,  change: +0.49,  pct: +1.21, vol: '2.8M',  w52h: 52.80,  w52l: 28.40,  sector: 'Cement',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'CHCC',   company: 'Cherat Cement Company',           price: 267.49, change: +3.48,  pct: +1.32, vol: '310K',  w52h: 310.20, w52l: 200.00, sector: 'Cement',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'FCCL',   company: 'Fauji Cement Company',            price: 22.30,  change: -0.30,  pct: -1.33, vol: '1.2M',  w52h: 30.50,  w52l: 18.00,  sector: 'Cement',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'DGKC',   company: 'D.G. Khan Cement',                price: 89.70,  change: -0.51,  pct: -0.56, vol: '540K',  w52h: 112.00, w52l: 70.40,  sector: 'Cement',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'KOHC',   company: 'Kohat Cement Company',            price: 186.40, change: +0.59,  pct: +0.32, vol: '280K',  w52h: 218.00, w52l: 148.00, sector: 'Cement',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'PIOC',   company: 'Pioneer Cement Limited',          price: 118.60, change: -0.80,  pct: -0.67, vol: '320K',  w52h: 142.00, w52l: 88.00,  sector: 'Cement',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'ACPL',   company: 'Attock Cement Pakistan',          price: 248.00, change: +1.20,  pct: +0.49, vol: '190K',  w52h: 295.00, w52l: 188.00, sector: 'Cement',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  // Energy
  { symbol: 'PSO',    company: 'Pakistan State Oil',              price: 312.40, change: +3.04,  pct: +0.98, vol: '890K',  w52h: 360.00, w52l: 245.00, sector: 'Energy',     indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'OGDC',   company: 'Oil & Gas Dev. Company',          price: 148.60, change: +0.93,  pct: +0.63, vol: '2.4M',  w52h: 172.00, w52l: 118.50, sector: 'Energy',     indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'PPL',    company: 'Pakistan Petroleum Limited',      price: 112.30, change: -0.30,  pct: -0.27, vol: '1.1M',  w52h: 132.00, w52l: 88.00,  sector: 'Energy',     indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'HUBC',   company: 'Hub Power Company',               price: 138.75, change: +1.44,  pct: +1.05, vol: '1.7M',  w52h: 158.00, w52l: 108.00, sector: 'Energy',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'KEL',    company: 'K-Electric Limited',              price: 5.90,   change: -0.01,  pct: -0.17, vol: '9.7M',  w52h: 7.80,   w52l: 4.40,   sector: 'Energy',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'NCPL',   company: 'Nishat Chunian Power',            price: 48.58,  change: -0.69,  pct: -1.40, vol: '760K',  w52h: 62.00,  w52l: 36.00,  sector: 'Energy',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'HASCOL', company: 'Hascol Petroleum',                price: 18.75,  change: +0.25,  pct: +1.35, vol: '1.1M',  w52h: 24.00,  w52l: 13.00,  sector: 'Energy',     indices: ['KMI All Share', 'All Shares'] },
  // Fertilizer
  { symbol: 'ENGRO',  company: 'Engro Corporation',               price: 284.60, change: +2.44,  pct: +0.87, vol: '620K',  w52h: 318.00, w52l: 218.00, sector: 'Fertilizer', indices: ['KSE 100', 'KSE 30', 'KMI 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'EFERT',  company: 'Engro Fertilizers',               price: 92.50,  change: +0.60,  pct: +0.65, vol: '1.4M',  w52h: 108.00, w52l: 74.00,  sector: 'Fertilizer', indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'FFC',    company: 'Fauji Fertilizer Company',        price: 126.80, change: -0.60,  pct: -0.47, vol: '810K',  w52h: 148.00, w52l: 100.00, sector: 'Fertilizer', indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'FFBL',   company: 'Fauji Fertilizer Bin Qasim',     price: 25.40,  change: +0.30,  pct: +1.18, vol: '2.1M',  w52h: 32.00,  w52l: 18.00,  sector: 'Fertilizer', indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  // Technology
  { symbol: 'SYS',    company: 'Systems Limited',                 price: 548.20, change: +12.52, pct: +2.34, vol: '380K',  w52h: 610.00, w52l: 380.00, sector: 'Technology', indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'TRG',    company: 'TRG Pakistan',                    price: 184.70, change: +3.38,  pct: +1.87, vol: '450K',  w52h: 220.00, w52l: 130.00, sector: 'Technology', indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'NETSOL', company: 'NetSol Technologies',             price: 112.50, change: +1.09,  pct: +0.98, vol: '290K',  w52h: 138.00, w52l: 82.00,  sector: 'Technology', indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'AVN',    company: 'Avanceon Limited',                price: 47.80,  change: -0.20,  pct: -0.42, vol: '410K',  w52h: 60.00,  w52l: 36.00,  sector: 'Technology', indices: ['KMI All Share', 'All Shares'] },
  { symbol: 'PTC',    company: 'Pakistan Telecom Company',        price: 51.60,  change: +0.30,  pct: +0.58, vol: '2.6M',  w52h: 64.00,  w52l: 38.00,  sector: 'Technology', indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'WTL',    company: 'WorldCall Telecom Limited',       price: 1.82,   change: -0.02,  pct: -1.09, vol: '1.7M',  w52h: 2.80,   w52l: 1.20,   sector: 'Technology', indices: ['All Shares'] },
  // Textile
  { symbol: 'NCL',    company: 'Nishat (Chunian) Limited',        price: 62.40,  change: +0.40,  pct: +0.64, vol: '920K',  w52h: 75.00,  w52l: 48.00,  sector: 'Textile',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'NML',    company: 'Nishat Mills Limited',            price: 138.20, change: -0.40,  pct: -0.29, vol: '340K',  w52h: 162.00, w52l: 108.00, sector: 'Textile',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'THALL',  company: 'Thal Limited',                    price: 520.90, change: +10.82, pct: +2.12, vol: '180K',  w52h: 580.00, w52l: 390.00, sector: 'Textile',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'GADT',   company: 'Gadoon Textile Mills',            price: 289.95, change: +4.24,  pct: +1.48, vol: '210K',  w52h: 320.00, w52l: 218.00, sector: 'Textile',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'ILP',    company: 'Interloop Limited',               price: 78.40,  change: +0.60,  pct: +0.77, vol: '460K',  w52h: 95.00,  w52l: 58.00,  sector: 'Textile',    indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'COLG',   company: 'Colgate-Palmolive Pakistan',      price: 2840.0, change: +18.00, pct: +0.64, vol: '18K',   w52h: 3100.0, w52l: 2200.0, sector: 'Textile',    indices: ['KSE 100', 'All Shares'] },
  // Pharma
  { symbol: 'AGP',    company: 'AGP Limited',                     price: 156.01, change: -2.82,  pct: -1.78, vol: '560K',  w52h: 192.00, w52l: 118.00, sector: 'Pharma',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'SEARL',  company: 'Searle Company',                  price: 214.50, change: +0.92,  pct: +0.43, vol: '310K',  w52h: 248.00, w52l: 168.00, sector: 'Pharma',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'GLAXO',  company: 'GlaxoSmithKline Pakistan',        price: 1620.0, change: +13.14, pct: +0.82, vol: '42K',   w52h: 1820.0, w52l: 1280.0, sector: 'Pharma',     indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'ABOT',   company: 'Abbott Laboratories Pakistan',    price: 742.00, change: -3.50,  pct: -0.47, vol: '28K',   w52h: 820.00, w52l: 580.00, sector: 'Pharma',     indices: ['KSE 100', 'All Shares'] },
  { symbol: 'HINOON', company: 'Hinopak Motors',                  price: 1180.0, change: +8.00,  pct: +0.68, vol: '14K',   w52h: 1340.0, w52l: 920.00, sector: 'Pharma',     indices: ['All Shares'] },
  // Auto
  { symbol: 'PSMC',   company: 'Pak Suzuki Motor Co.',            price: 672.80, change: -4.13,  pct: -0.61, vol: '120K',  w52h: 780.00, w52l: 520.00, sector: 'Auto',       indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'HCAR',   company: 'Honda Atlas Cars',                price: 198.50, change: -2.15,  pct: -1.07, vol: '280K',  w52h: 245.00, w52l: 152.00, sector: 'Auto',       indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'INDU',   company: 'Indus Motor Company',             price: 1842.0, change: +9.88,  pct: +0.54, vol: '68K',   w52h: 2100.0, w52l: 1480.0, sector: 'Auto',       indices: ['KSE 100', 'KSE 30', 'KMI All Share', 'All Shares'] },
  { symbol: 'ATLH',   company: 'Atlas Honda Limited',             price: 580.00, change: +3.20,  pct: +0.55, vol: '52K',   w52h: 660.00, w52l: 440.00, sector: 'Auto',       indices: ['KSE 100', 'All Shares'] },
  // Food
  { symbol: 'UNITY',  company: 'Unity Foods Limited',             price: 28.45,  change: -0.27,  pct: -0.95, vol: '1.8M',  w52h: 38.00,  w52l: 20.00,  sector: 'Food',       indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'FFL',    company: 'Fauji Foods Limited',             price: 14.20,  change: +0.10,  pct: +0.71, vol: '2.3M',  w52h: 20.00,  w52l: 9.80,   sector: 'Food',       indices: ['KMI All Share', 'All Shares'] },
  { symbol: 'QUICE',  company: 'Quice Food Industries',           price: 22.80,  change: +0.10,  pct: +0.44, vol: '680K',  w52h: 28.00,  w52l: 16.00,  sector: 'Food',       indices: ['KMI All Share', 'All Shares'] },
  { symbol: 'NESTLE', company: 'Nestlé Pakistan Limited',         price: 6820.0, change: +42.00, pct: +0.62, vol: '8K',    w52h: 7400.0, w52l: 5600.0, sector: 'Food',       indices: ['KSE 100', 'KSE 30', 'All Shares'] },
  { symbol: 'MDTL',   company: 'Millat Tractors Limited',         price: 1248.0, change: -6.00,  pct: -0.48, vol: '32K',   w52h: 1420.0, w52l: 980.00, sector: 'Food',       indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
  { symbol: 'JDWS',   company: 'JDW Sugar Mills Limited',         price: 850.00, change: -21.50, pct: -2.49, vol: '44K',   w52h: 1020.0, w52l: 680.00, sector: 'Food',       indices: ['KSE 100', 'KMI All Share', 'All Shares'] },
]

// ─── Sector colours for logo backgrounds ─────────────────────────────────────

const SECTOR_COLOR: Record<string, string> = {
  Banking:    '1e40af', Cement:     'b45309', Energy:     '065f46',
  Fertilizer: '6b21a8', Technology: '0e7490', Textile:    '9f1239',
  Pharma:     '166534', Auto:       '92400e', Food:       '1d4ed8',
}

function logoUrl(company: string, sector: string) {
  const initials = company
    .split(' ')
    .filter(w => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
  const bg = SECTOR_COLOR[sector] ?? '334155'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=fff&size=64&bold=true&format=png`
}

// ─── Stock logo component ─────────────────────────────────────────────────────

function StockLogo({ company, sector, symbol }: { company: string; sector: string; symbol: string }) {
  const [err, setErr] = useState(false)
  const bg = SECTOR_COLOR[sector] ?? '334155'
  if (err) {
    return (
      <div style={{
        width: 28, height: 28, borderRadius: 6, flexShrink: 0,
        background: `#${bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em',
      }}>
        {symbol.slice(0, 2)}
      </div>
    )
  }
  return (
    <Image
      src={logoUrl(company, sector)}
      alt={symbol}
      width={28} height={28}
      onError={() => setErr(true)}
      style={{ borderRadius: 6, flexShrink: 0, objectFit: 'cover' }}
      unoptimized
    />
  )
}

type SortKey = 'symbol' | 'price' | 'change' | 'pct' | 'vol' | 'w52h' | 'w52l'
type SortDir = 'asc' | 'desc'

// ─── Dropdown ─────────────────────────────────────────────────────────────────

function Dropdown({ value, options, onChange, placeholder }: {
  value: string; options: string[]; onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          appearance: 'none', WebkitAppearance: 'none',
          paddingLeft: 12, paddingRight: 32, paddingTop: 8, paddingBottom: 8,
          borderRadius: 8, border: '1px solid var(--border-subtle)',
          background: 'var(--navy-900)', color: value === options[0] ? 'var(--text-muted)' : 'var(--text-primary)',
          fontSize: 13, outline: 'none', cursor: 'pointer', minWidth: 160,
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <MdKeyboardArrowDown size={16} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
    </div>
  )
}

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', gap: 1, opacity: 0.28, lineHeight: 1 }}>
      <MdArrowUpward size={10} />
      <MdArrowDownward size={10} style={{ marginTop: -4 }} />
    </span>
  )
  return dir === 'asc'
    ? <MdArrowUpward  size={13} style={{ color: 'var(--brand-gold)', flexShrink: 0 }} />
    : <MdArrowDownward size={13} style={{ color: 'var(--brand-gold)', flexShrink: 0 }} />
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StocksPage() {
  const router = useRouter()
  const [search,   setSearch]   = useState('')
  const [index,    setIndex]    = useState('All Indices')
  const [sector,   setSector]   = useState('All Sectors')
  const [sortKey,  setSortKey]  = useState<SortKey>('symbol')
  const [sortDir,  setSortDir]  = useState<SortDir>('asc')
  const [page,     setPage]     = useState(1)
  const PAGE_SIZE = 50

  const hasFilters = search.trim() !== '' || index !== 'All Indices' || sector !== 'All Sectors'

  function clearFilters() {
    setSearch('')
    setIndex('All Indices')
    setSector('All Sectors')
    setPage(1)
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
    setPage(1)
  }

  const filtered = useMemo(() => {
    let list = [...STOCKS]
    if (index !== 'All Indices')  list = list.filter(s => s.indices.includes(index))
    if (sector !== 'All Sectors') list = list.filter(s => s.sector === sector)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(s => s.symbol.toLowerCase().includes(q) || s.company.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      if (typeof av === 'string' && typeof bv === 'string')
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return list
  }, [search, index, sector, sortKey, sortDir])

  useEffect(() => { setPage(1) }, [search, index, sector])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage   = Math.min(page, totalPages)
  const pageRows   = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const gainers = filtered.filter(s => s.change > 0).length
  const losers  = filtered.filter(s => s.change < 0).length

  const SORTABLE_COLS: { key: SortKey; label: string; align: 'left' | 'right' }[] = [
    { key: 'price',  label: 'Price',    align: 'right' },
    { key: 'change', label: 'Change',   align: 'right' },
    { key: 'pct',    label: '% Chg',    align: 'right' },
    { key: 'vol',    label: 'Volume',   align: 'right' },
    { key: 'w52h',   label: '52W High', align: 'right' },
    { key: 'w52l',   label: '52W Low',  align: 'right' },
  ]
  const thStyle = (key?: SortKey): React.CSSProperties => ({
    padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
    textTransform: 'uppercase', whiteSpace: 'nowrap', userSelect: 'none',
    color: key && sortKey === key ? 'var(--brand-gold)' : 'var(--text-muted)',
    cursor: key ? 'pointer' : 'default',
    background: 'var(--navy-800)',
  })

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>Stocks</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{STOCKS.length} securities · Pakistan Stock Exchange</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-gain)', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.18)', borderRadius: 8, padding: '4px 12px' }}>
            ▲ {gainers} Up
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--red-loss)', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: 8, padding: '4px 12px' }}>
            ▼ {losers} Down
          </span>
        </div>
      </div>

      {/* ── Filters bar ── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 260px' }}>
          <MdSearch size={16} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search symbol or company…"
            style={{
              width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              borderRadius: 8, border: '1px solid var(--border-subtle)',
              background: 'var(--navy-900)', color: 'var(--text-primary)',
              fontSize: 13, outline: 'none',
            }}
          />
        </div>

        {/* Index dropdown */}
        <Dropdown value={index} options={INDICES} onChange={setIndex} placeholder="All Indices" />

        {/* Sector dropdown */}
        <Dropdown value={sector} options={SECTORS} onChange={setSector} placeholder="All Sectors" />

        {/* Clear button */}
        {hasFilters && (
          <button onClick={clearFilters} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', border: '1px solid var(--border-subtle)',
            background: 'var(--navy-900)', color: 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--red-loss)'; (e.currentTarget as HTMLElement).style.color = 'var(--red-loss)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
          >
            <MdClose size={15} />
            Clear filters
          </button>
        )}
      </div>

      {/* ── Table ── */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div className="table-scroll">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 760 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border-subtle)' }}>
              {/* # */}
              <th style={{ ...thStyle(), textAlign: 'center', width: 44 }}>#</th>
              {/* Symbol — sortable */}
              <th onClick={() => handleSort('symbol')} style={{ ...thStyle('symbol'), textAlign: 'left' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                  Symbol <SortIcon active={sortKey === 'symbol'} dir={sortDir} />
                </span>
              </th>
              {/* Company */}
              <th style={{ ...thStyle(), textAlign: 'left' }}>Company</th>
              {/* Sortable cols */}
              {SORTABLE_COLS.map(col => (
                <th key={col.key} onClick={() => handleSort(col.key)} style={{ ...thStyle(col.key), textAlign: col.align }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'flex-end', gap: 5 }}>
                    <SortIcon active={sortKey === col.key} dir={sortDir} /> {col.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                  No stocks match your filters.
                </td>
              </tr>
            )}
            {pageRows.map((s, idx) => {
              const up       = s.change >= 0
              const color    = up ? 'var(--green-gain)' : 'var(--red-loss)'
              const nearHigh = s.price >= s.w52h * 0.97
              const nearLow  = s.price <= s.w52l * 1.03
              const serial   = (safePage - 1) * PAGE_SIZE + idx + 1
              return (
                <tr key={s.symbol} className="tr-hover"
                    onClick={() => router.push(`/dashboard/stocks/${s.symbol}`)}
                    style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}>

                  {/* # */}
                  <td style={{ padding: '8px 14px', textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', width: 44 }}>
                    {serial}
                  </td>

                  {/* Symbol + Logo */}
                  <td style={{ padding: '8px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <StockLogo company={s.company} sector={s.sector} symbol={s.symbol} />
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                        {s.symbol}
                      </span>
                    </div>
                  </td>

                  {/* Company */}
                  <td style={{ padding: '8px 14px', fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {s.company}
                  </td>

                  {/* Price */}
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                      {s.price.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Change */}
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color }}>
                      {up ? '+' : ''}{s.change.toFixed(2)}
                    </span>
                  </td>

                  {/* %Chg */}
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color }}>
                      {up ? '+' : ''}{s.pct.toFixed(2)}%
                    </span>
                  </td>

                  {/* Volume */}
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>
                    {s.vol}
                  </td>

                  {/* 52W High */}
                  <td style={{ padding: '8px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: nearHigh ? 'var(--green-gain)' : 'var(--text-secondary)' }}>
                      {s.w52h.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {nearHigh && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--green-gain)', background: 'rgba(22,163,74,0.1)', borderRadius: 3, padding: '1px 5px', marginLeft: 4 }}>▲HI</span>}
                  </td>

                  {/* 52W Low */}
                  <td style={{ padding: '8px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: nearLow ? 'var(--red-loss)' : 'var(--text-secondary)' }}>
                      {s.w52l.toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {nearLow && <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--red-loss)', background: 'rgba(220,38,38,0.1)', borderRadius: 3, padding: '1px 5px', marginLeft: 4 }}>▼LO</span>}
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
        </div>

        {/* Footer + Pagination */}
        <div style={{ padding: '10px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filtered.length)} of {filtered.length} stocks
            {hasFilters && ' (filtered)'}
          </span>

          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {/* Prev */}
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: safePage === 1 ? 'not-allowed' : 'pointer',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--navy-900)',
                  color: safePage === 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
                  opacity: safePage === 1 ? 0.5 : 1,
                }}>
                ‹ Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                const isActive = p === safePage
                const showPage = p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
                if (!showPage) {
                  const prevShown = p - 1 === 1 || Math.abs(p - 1 - safePage) <= 1
                  if (!prevShown) return null
                  return <span key={p} style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
                }
                return (
                  <button key={p} onClick={() => setPage(p)} style={{
                    width: 32, height: 30, borderRadius: 8, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', border: isActive ? 'none' : '1px solid var(--border-subtle)',
                    background: isActive ? 'var(--brand-gold)' : 'var(--navy-900)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                  }}>
                    {p}
                  </button>
                )
              })}

              {/* Next */}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                style={{
                  padding: '5px 10px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                  cursor: safePage === totalPages ? 'not-allowed' : 'pointer',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--navy-900)',
                  color: safePage === totalPages ? 'var(--text-muted)' : 'var(--text-secondary)',
                  opacity: safePage === totalPages ? 0.5 : 1,
                }}>
                Next ›
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
