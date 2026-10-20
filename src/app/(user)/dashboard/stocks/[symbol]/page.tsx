'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend,
  ComposedChart, ReferenceLine, Customized,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'
import { MdArrowBack, MdTrendingUp, MdTrendingDown, MdOpenInNew, MdKeyboardArrowDown, MdKeyboardArrowUp, MdPictureAsPdf, MdDownload } from 'react-icons/md'

// ─── Stock universe (mirrors stocks/page.tsx) ─────────────────────────────────

const UNIVERSE: Record<string, {
  symbol: string; company: string; sector: string; price: number;
  change: number; pct: number; vol: string; w52h: number; w52l: number;
}> = {
  HBL:    { symbol: 'HBL',    company: 'Habib Bank Limited',         sector: 'Banking',    price: 185.40, change: +2.25,  pct: +1.24, vol: '2.1M',  w52h: 198.60, w52l: 142.30 },
  MCB:    { symbol: 'MCB',    company: 'MCB Bank Limited',           sector: 'Banking',    price: 312.60, change: -1.19,  pct: -0.38, vol: '1.3M',  w52h: 340.00, w52l: 240.50 },
  UBL:    { symbol: 'UBL',    company: 'United Bank Limited',        sector: 'Banking',    price: 238.75, change: +2.06,  pct: +0.87, vol: '980K',  w52h: 260.80, w52l: 185.20 },
  MEBL:   { symbol: 'MEBL',   company: 'Meezan Bank Limited',        sector: 'Banking',    price: 198.30, change: +2.06,  pct: +1.05, vol: '1.5M',  w52h: 218.50, w52l: 155.40 },
  BAFL:   { symbol: 'BAFL',   company: 'Bank Alfalah Limited',       sector: 'Banking',    price: 56.20,  change: +0.30,  pct: +0.54, vol: '3.2M',  w52h: 65.40,  w52l: 40.10  },
  NBP:    { symbol: 'NBP',    company: 'National Bank of Pakistan',  sector: 'Banking',    price: 62.10,  change: -0.55,  pct: -0.88, vol: '1.1M',  w52h: 76.00,  w52l: 48.00  },
  ABL:    { symbol: 'ABL',    company: 'Allied Bank Limited',        sector: 'Banking',    price: 128.90, change: -1.46,  pct: -1.12, vol: '760K',  w52h: 148.00, w52l: 102.50 },
  BAHL:   { symbol: 'BAHL',   company: 'Bank AL Habib Limited',      sector: 'Banking',    price: 92.30,  change: +1.10,  pct: +1.21, vol: '1.8M',  w52h: 108.50, w52l: 72.60  },
  FABL:   { symbol: 'FABL',   company: 'Faysal Bank Limited',        sector: 'Banking',    price: 38.40,  change: +0.40,  pct: +1.05, vol: '2.4M',  w52h: 46.00,  w52l: 28.00  },
  AKBL:   { symbol: 'AKBL',   company: 'Askari Bank Limited',        sector: 'Banking',    price: 35.80,  change: -0.30,  pct: -0.83, vol: '1.2M',  w52h: 44.00,  w52l: 26.00  },
  BOP:    { symbol: 'BOP',    company: 'The Bank of Punjab',         sector: 'Banking',    price: 28.53,  change: +0.12,  pct: +0.42, vol: '1.9M',  w52h: 34.70,  w52l: 20.80  },
  SNBL:   { symbol: 'SNBL',   company: 'Soneri Bank Limited',        sector: 'Banking',    price: 22.30,  change: +0.18,  pct: +0.81, vol: '880K',  w52h: 28.00,  w52l: 16.50  },
  JSBL:   { symbol: 'JSBL',   company: 'JS Bank Limited',            sector: 'Banking',    price: 12.45,  change: +0.10,  pct: +0.81, vol: '6.1M',  w52h: 17.20,  w52l: 8.90   },
  LUCK:   { symbol: 'LUCK',   company: 'Lucky Cement',               sector: 'Cement',     price: 710.00, change: +5.22,  pct: +0.74, vol: '420K',  w52h: 780.00, w52l: 580.00 },
  MLCF:   { symbol: 'MLCF',   company: 'Maple Leaf Cement',          sector: 'Cement',     price: 41.20,  change: +0.49,  pct: +1.21, vol: '2.8M',  w52h: 52.80,  w52l: 28.40  },
  DGKC:   { symbol: 'DGKC',   company: 'D.G. Khan Cement',           sector: 'Cement',     price: 89.70,  change: -0.51,  pct: -0.56, vol: '540K',  w52h: 112.00, w52l: 70.40  },
  PSO:    { symbol: 'PSO',    company: 'Pakistan State Oil',         sector: 'Energy',     price: 312.40, change: +3.04,  pct: +0.98, vol: '890K',  w52h: 360.00, w52l: 245.00 },
  OGDC:   { symbol: 'OGDC',   company: 'Oil & Gas Dev. Company',     sector: 'Energy',     price: 148.60, change: +0.93,  pct: +0.63, vol: '2.4M',  w52h: 172.00, w52l: 118.50 },
  PPL:    { symbol: 'PPL',    company: 'Pakistan Petroleum Limited', sector: 'Energy',     price: 112.30, change: -0.30,  pct: -0.27, vol: '1.1M',  w52h: 132.00, w52l: 88.00  },
  ENGRO:  { symbol: 'ENGRO',  company: 'Engro Corporation',          sector: 'Fertilizer', price: 284.60, change: +2.44,  pct: +0.87, vol: '620K',  w52h: 318.00, w52l: 218.00 },
  FFC:    { symbol: 'FFC',    company: 'Fauji Fertilizer Company',   sector: 'Fertilizer', price: 126.80, change: -0.60,  pct: -0.47, vol: '810K',  w52h: 148.00, w52l: 100.00 },
  SYS:    { symbol: 'SYS',    company: 'Systems Limited',            sector: 'Technology', price: 548.20, change: +12.52, pct: +2.34, vol: '380K',  w52h: 610.00, w52l: 380.00 },
  TRG:    { symbol: 'TRG',    company: 'TRG Pakistan',               sector: 'Technology', price: 184.70, change: +3.38,  pct: +1.87, vol: '450K',  w52h: 220.00, w52l: 130.00 },
}

// ─── Seeded data generator ────────────────────────────────────────────────────

function seededRand(seed: number) {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function genPrice(base: number, points: number, seed: number) {
  const rand = seededRand(seed)
  let v = base * 0.82
  return Array.from({ length: points }, (_, i) => {
    v += (rand() - 0.47) * base * 0.008
    v = Math.max(base * 0.75, Math.min(base * 1.25, v))
    return { i, v: +v.toFixed(2) }
  })
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function genQuarterly(base: number, seed: number) {
  const rand = seededRand(seed)
  return ['Q1 FY24','Q2 FY24','Q3 FY24','Q4 FY24','Q1 FY25','Q2 FY25','Q3 FY25','Q4 FY25'].map(q => ({
    q,
    revenue: +(base * (0.8 + rand() * 0.5)).toFixed(1),
    netIncome: +(base * (0.08 + rand() * 0.12)).toFixed(1),
    eps: +(2 + rand() * 8).toFixed(2),
  }))
}

function genAnnual(base: number, seed: number) {
  const rand = seededRand(seed)
  return ['FY21','FY22','FY23','FY24','FY25'].map(y => ({
    y,
    revenue: +(base * (0.6 + rand() * 0.7) * 4).toFixed(1),
    netIncome: +(base * (0.06 + rand() * 0.14) * 4).toFixed(1),
    eps: +(8 + rand() * 30).toFixed(2),
    dividend: +(rand() * 12).toFixed(2),
  }))
}

function genOHLC(base: number, points: number, seed: number) {
  const rand = seededRand(seed)
  let close = base * 0.85
  return Array.from({ length: points }, (_, i) => {
    const open = close
    const change = (rand() - 0.47) * base * 0.018
    close = Math.max(base * 0.72, Math.min(base * 1.28, open + change))
    const highExtra = rand() * base * 0.009
    const lowExtra  = rand() * base * 0.009
    return {
      i,
      open:  +open.toFixed(2),
      high:  +(Math.max(open, close) + highExtra).toFixed(2),
      low:   +(Math.min(open, close) - lowExtra).toFixed(2),
      close: +close.toFixed(2),
    }
  })
}

// ─── Sector color map ─────────────────────────────────────────────────────────

const SECTOR_COLOR: Record<string, string> = {
  Banking: '1e40af', Cement: 'b45309', Energy: '065f46',
  Fertilizer: '6b21a8', Technology: '0e7490',
}

function logoUrl(company: string, sector: string) {
  const initials = company.split(' ').filter(w => /^[A-Za-z]/.test(w)).slice(0, 2).map(w => w[0].toUpperCase()).join('')
  const bg = SECTOR_COLOR[sector] ?? '334155'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${bg}&color=fff&size=64&bold=true&format=png`
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = ['Overview','Charts','Sector Peers','Compare Sector','Financials','Fundamentals','Shareholders','News','Announcements','Company Report'] as const
type Tab = typeof TABS[number]

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)' }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--navy-800)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '8px 12px', fontSize: 12 }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 2 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? 'var(--text-primary)', fontWeight: 700 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── Tab panels ───────────────────────────────────────────────────────────────

function GaugeMeter({ score, color, leftLabel = 'Overvalued', rightLabel = 'Undervalued' }: { score: number; color: string; leftLabel?: string; rightLabel?: string }) {
  const cx = 100, cy = 100
  const rO = 72, rI = 50, nLen = 60

  const xy = (deg: number, r: number) => ({
    x: +(cx + r * Math.cos(deg * Math.PI / 180)).toFixed(2),
    y: +(cy - r * Math.sin(deg * Math.PI / 180)).toFixed(2),
  })

  const seg = (fromDeg: number, toDeg: number, fill: string) => {
    const o1 = xy(fromDeg, rO), o2 = xy(toDeg, rO)
    const i2 = xy(toDeg, rI), i1 = xy(fromDeg, rI)
    return (
      <path d={`M${o1.x},${o1.y} A${rO},${rO} 0 0 0 ${o2.x},${o2.y} L${i2.x},${i2.y} A${rI},${rI} 0 0 1 ${i1.x},${i1.y}Z`}
        fill={fill} />
    )
  }

  // needleDeg: 180=score 0 (far left), 0=score 100 (far right)
  const needleDeg = 180 - (Math.min(99.9, Math.max(0.1, score)) / 100) * 180

  return (
    <svg viewBox="0 0 220 118" style={{ width: '100%', maxWidth: 220 }}>
      {seg(180, 144, '#dc2626')}
      {seg(144, 108, '#f97316')}
      {seg(108,  72, '#eab308')}
      {seg( 72,  36, '#84cc16')}
      {seg( 36,   0, '#16a34a')}
      {/* Tick marks between segments */}
      {[180, 144, 108, 72, 36, 0].map(deg => {
        const a = xy(deg, rI - 2), b = xy(deg, rO + 3)
        return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--navy-900)" strokeWidth="2" />
      })}
      {/* Needle: drawn pointing right (0°), rotated into position via group transform */}
      <g transform={`rotate(${-needleDeg} ${cx} ${cy})`}>
        <animateTransform
          attributeName="transform"
          type="rotate"
          from={`-180 ${cx} ${cy}`}
          to={`${-needleDeg} ${cx} ${cy}`}
          dur="1.2s"
          begin="0s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.25 0.1 0.25 1"
        />
        {/* Canonical needle pointing right along x-axis */}
        <polygon points={`${cx},${cy - 5} ${cx + nLen},${cy} ${cx},${cy + 5}`} fill="#1e293b" opacity={0.85} />
        <circle cx={cx} cy={cy} r={7} fill="#1e293b" />
        <circle cx={cx} cy={cy} r={3} fill="white" />
      </g>
      {/* End labels */}
      <text x="22"  y="116" textAnchor="middle" fontSize="7.5" fill="#dc2626" fontWeight="700">{leftLabel}</text>
      <text x="198" y="116" textAnchor="middle" fontSize="7.5" fill="#16a34a" fontWeight="700">{rightLabel}</text>
    </svg>
  )
}

function OverviewTab({ s }: { s: typeof UNIVERSE[string] }) {
  const up = s.change >= 0
  const lineColor = up ? '#16a34a' : '#dc2626'

  const r1 = seededRand(s.price * 11)
  const openPrice  = +(s.price - s.change + (r1() - 0.5) * s.price * 0.003).toFixed(2)
  const highPrice  = +(Math.max(s.price, openPrice) + r1() * s.price * 0.005).toFixed(2)
  const lowPrice   = +(Math.min(s.price, openPrice) - r1() * s.price * 0.005).toFixed(2)

  const r2 = seededRand(s.price * 23)
  const intrinsicScore = Math.round(30 + r2() * 50)
  const intrinsicValue = +(s.price * (1 + r2() * 0.4 - 0.1)).toFixed(2)
  const mos            = +((intrinsicValue - s.price) / intrinsicValue * 100).toFixed(1)
  const stockifyyScore = Math.round(45 + r2() * 40)
  const valueScore     = Math.round(50 + r2() * 40)
  const growthScore    = Math.round(38 + r2() * 52)
  const safetyScore    = Math.round(55 + r2() * 35)
  const incomeScore    = Math.round(45 + r2() * 45)

  // Financial snapshot metrics
  const r3 = seededRand(s.price * 37)
  const sharesM       = Math.round(200 + r3() * 800)
  const mktCapB       = +(s.price * sharesM / 1000).toFixed(1)
  const freeFloatPct  = +(25 + r3() * 50).toFixed(1)
  const freeFloatM    = Math.round(sharesM * Number(freeFloatPct) / 100)
  const weeklyVolM    = +(r3() * 15 + 1).toFixed(2)
  const dividendYield = +(1.5 + r3() * 7).toFixed(2)
  const eps           = +(s.price / (6 + r3() * 14)).toFixed(2)
  const netMarginPct  = +(8 + r3() * 22).toFixed(1)
  const pbRatio       = +(0.9 + r3() * 2.8).toFixed(2)
  const peRatio       = +(s.price / Number(eps)).toFixed(1)
  const pegRatio      = +(Number(peRatio) / (8 + r3() * 18)).toFixed(2)

  const stockLine  = genPrice(100, 252, s.price * 31)
  const indexLine  = genPrice(100, 252, 42)
  const compareData = stockLine.map((d, i) => ({ i, stock: d.v, kse: indexLine[i].v }))

  const INFO: Record<string, {
    ceo: string; founded: string; hq: string; employees: string; industry: string; fy: string;
    about: string; brands: string[];
    auditors: string; registeredOffice: string;
    board: { name: string; title: string }[];
    strengths: string[]; concerns: string[];
  }> = {
    HBL: { ceo: 'Muhammad Aurangzeb', founded: '1941', hq: 'Karachi', employees: '14,000+', industry: 'Commercial Banking', fy: 'December', about: "Habib Bank Limited is Pakistan's largest commercial bank with over 1,700 branches nationwide and international presence across 25 countries. It is the country's leading provider of financial services across retail, commercial, Islamic, and corporate banking segments.", brands: ['HBL MicroFinance', 'HBL Asset Management', 'HBL Pay', 'HBL Islamic'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'Habib Bank Plaza, I.I. Chundrigar Road, Karachi', board: [{ name: 'Sultan Ali Allana', title: 'Chairman' }, { name: 'Muhammad Aurangzeb', title: 'President & CEO' }, { name: 'Nauman K. Dar', title: 'Independent Director' }, { name: 'Moez Ahamed Jamal', title: 'Non-Executive Director' }], strengths: ["Pakistan's largest branch network (1,700+) and presence in 25 countries", "Leading digital banking platform with 10M+ registered mobile users", "Consistent dividend payer with capital adequacy above regulatory minimums"], concerns: ["Heavy concentration in government securities amplifies interest rate risk", "Rising NPL ratio in agriculture and SME segments", "Currency volatility impacts foreign subsidiary earnings"] },
    MCB: { ceo: 'Imran Maqbool', founded: '1947', hq: 'Lahore', employees: '8,500+', industry: 'Commercial Banking', fy: 'December', about: "MCB Bank Limited is one of Pakistan's premier commercial banks with a network of 1,500+ branches and ATMs. It provides retail, corporate, consumer, and Islamic banking services and is known for strong capital adequacy and asset quality.", brands: ['MCB Islamic Bank', 'MCB Arif Habib Savings', 'Adamjee Insurance'], auditors: 'KPMG Taseer Hadi & Co.', registeredOffice: 'MCB House, 15 Shahrah-e-Quaid-e-Azam, Lahore', board: [{ name: 'Mian Mohammad Mansha', title: 'Chairman' }, { name: 'Imran Maqbool', title: 'President & CEO' }, { name: 'Shahzad Saleem', title: 'Non-Executive Director' }, { name: 'Tariq Rafi', title: 'Independent Director' }], strengths: ["Highest ROE among large banks, consistently above 20%", "Low cost-to-income ratio from technology investment and branch optimization", "Adamjee Insurance stake provides diversified non-banking income"], concerns: ["Concentrated loan book exposure to select corporate groups", "Limited digital banking penetration vs larger peers", "Slower branch expansion constrains deposit market share growth"] },
    UBL: { ceo: 'Sima Kamil', founded: '1959', hq: 'Karachi', employees: '12,000+', industry: 'Commercial Banking', fy: 'December', about: "United Bank Limited operates one of Pakistan's largest banking networks with international operations across 12 countries. UBL is known for innovation in digital banking with its UBL Digital platform and serves millions of customers.", brands: ['UBL Digital', 'UBL Insurers', 'UBL Fund Managers'], auditors: 'EY Ford Rhodes', registeredOffice: 'UBL Building, Jinnah Avenue, Blue Area, Islamabad', board: [{ name: 'Anwar Pervez', title: 'Chairman' }, { name: 'Sima Kamil', title: 'President & CEO' }, { name: 'Zameer Choudrey', title: 'Director' }, { name: 'Farrukh Hussain', title: 'Independent Director' }], strengths: ["Strong Gulf/Middle East presence providing remittance income", "UBL Digital App among Pakistan's most downloaded banking apps", "Well-diversified loan book across corporate, commercial, and consumer segments"], concerns: ["International operations expose bank to geopolitical and currency risks", "Asset quality pressure in trade finance and SME lending", "Regulatory compliance costs rising with stricter SBP requirements"] },
    MEBL: { ceo: 'Irfan Siddiqui', founded: '1997', hq: 'Karachi', employees: '8,000+', industry: 'Islamic Banking', fy: 'December', about: "Meezan Bank is Pakistan's first and largest dedicated Islamic bank with 1,000+ branches. It operates on Shariah-compliant principles and offers a full range of Islamic financial products for retail, commercial, and corporate clients.", brands: ['Meezan Islamic Finance', 'Meezan Asset Management', 'Meezan Digital'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'PNSC Building, M.T. Khan Road, Karachi', board: [{ name: 'Riyadh S.A.A. Edrees', title: 'Chairman' }, { name: 'Irfan Siddiqui', title: 'President & CEO' }, { name: 'Muhammad Raza', title: 'CFO & Director' }, { name: 'Dr. Muhammad Imran Usmani', title: 'Shariah Supervisor' }], strengths: ["Fastest growing large bank with 25%+ Islamic banking market share", "Strong brand loyalty from Muslim-preference customer base", "No conventional interest exposure provides unique regulatory risk profile"], concerns: ["Islamic sukuk market depth limits investment options vs conventional peers", "Rapid branch expansion increases operating cost pressure short-term", "Regulatory changes to Islamic finance frameworks could impact product range"] },
    BAFL: { ceo: 'Atif Bajwa', founded: '1992', hq: 'Karachi', employees: '11,000+', industry: 'Commercial Banking', fy: 'December', about: "Bank Alfalah is one of Pakistan's largest private banks with 900+ branches. A subsidiary of the Abu Dhabi Group, it offers retail, corporate, investment, and digital banking services.", brands: ['Alfalah Islamic', 'Alfalah Insurance', 'Alfalah Remit'], auditors: 'KPMG Taseer Hadi & Co.', registeredOffice: 'B.A. Building, I.I. Chundrigar Road, Karachi', board: [{ name: 'H.H. Sheikh Hamdan Bin Mubarak Al Nahyan', title: 'Chairman' }, { name: 'Atif Bajwa', title: 'President & CEO' }, { name: 'Khalid Mana Saeed Al Otaiba', title: 'Non-Executive Director' }, { name: 'Farid Ahmed Khan', title: 'Independent Director' }], strengths: ["Abu Dhabi Group backing provides strong capital and strategic support", "Alfalah Remit connects Pakistan's large overseas diaspora with domestic banking", "Rapid digital transformation with Alfalah app gaining strong traction"], concerns: ["Higher cost-to-income ratio relative to larger private peers", "Consumer lending book vulnerable to rising inflation and unemployment", "International parent strategy shifts can affect local investment decisions"] },
    NBP: { ceo: 'Rehmat Ali Hasnie', founded: '1949', hq: 'Karachi', employees: '16,000+', industry: 'Commercial Banking', fy: 'December', about: "National Bank of Pakistan is the country's largest state-owned bank with 1,500+ branches nationwide. As the government's banker and agent, NBP handles federal and provincial treasury operations, pension disbursements, and plays a central role in Pakistan's financial system.", brands: ['NBP Karobar', 'NBP Islamic', 'NBP Advance Salary'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'NBP Head Office, I.I. Chundrigar Road, Karachi', board: [{ name: 'Zubyr Soomro', title: 'Chairman' }, { name: 'Rehmat Ali Hasnie', title: 'President & CEO' }, { name: 'Shahzad Hussain', title: 'CFO' }, { name: 'Sadia Khan', title: 'Independent Director' }], strengths: ["Largest branch network in Pakistan with unmatched rural and semi-urban reach", "Government banker status provides captive fee income and stable deposit base", "Pension and salary disbursement mandate locks in a large retail customer base"], concerns: ["Legacy NPL book remains elevated due to historical directed lending", "State ownership limits governance agility and management decision-making speed", "Capital adequacy under pressure from provisioning requirements on old loan book"] },
    ABL: { ceo: 'Tahir Hassan Qureshi', founded: '1942', hq: 'Lahore', employees: '9,000+', industry: 'Commercial Banking', fy: 'December', about: "Allied Bank Limited is one of Pakistan's oldest and most established banks, with a nationwide network of 1,400+ branches. It provides comprehensive retail, commercial, and corporate banking services and is known for strong asset quality.", brands: ['ABL Islamic', 'ABL Asset Management', 'ABL Remit'], auditors: 'Deloitte Yousuf Adil', registeredOffice: 'Allied Bank House, Abdullah Haroon Road, Karachi', board: [{ name: 'Sheikh Mukhtar Ahmed', title: 'Chairman' }, { name: 'Tahir Hassan Qureshi', title: 'President & CEO' }, { name: 'Muhammad Younus', title: 'CFO' }, { name: 'Nazrat Bashir', title: 'Independent Director' }], strengths: ["Strong capital adequacy ratio consistently above SBP minimum requirements", "High-quality loan book with one of the lowest NPL ratios in the sector", "Ibrahim Group ownership provides stability and strategic long-term commitment"], concerns: ["Below-average digital banking adoption vs HBL and UBL peers", "Conservative growth strategy may constrain earnings expansion", "Limited international presence restricts remittance and FX income"] },
    BAHL: { ceo: 'Muhammad Jawaid Iqbal', founded: '1991', hq: 'Karachi', employees: '7,500+', industry: 'Commercial Banking', fy: 'December', about: "Bank AL Habib is a prominent private commercial bank with 1,000+ branches across Pakistan. Known for its conservative and disciplined banking approach, BAHL consistently maintains strong capital buffers and asset quality.", brands: ['BAHL Islamic', 'BAHL Remittance', 'BAHL Connect'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'Habib Bank AG Zurich Building, I.I. Chundrigar Road, Karachi', board: [{ name: 'Abbas D. Habib', title: 'Chairman' }, { name: 'Muhammad Jawaid Iqbal', title: 'President & CEO' }, { name: 'Syed Mazhar Hussain', title: 'Director' }, { name: 'Mudassir Khan', title: 'Independent Director' }], strengths: ["Habib family backing provides strong institutional governance and capital support", "Conservative provisioning policy builds balance sheet resilience in downturns", "Consistent dividend track record with low payout volatility"], concerns: ["Growth rate trails more aggressive peers due to conservative expansion policy", "Digital transformation investment lags top-tier banking peers", "Concentrated business in traditional corporate and commercial segments"] },
    FABL: { ceo: 'Yousaf Hussain', founded: '1994', hq: 'Karachi', employees: '6,200+', industry: 'Islamic Banking', fy: 'December', about: "Faysal Bank is a full-service Islamic bank having completed its conversion to Shariah-compliant banking. With 700+ branches, it offers a comprehensive range of Islamic retail, consumer, and corporate banking products.", brands: ['Faysal Islamic', 'Faysal Islami', 'Faysal DigiBank'], auditors: 'EY Ford Rhodes', registeredOffice: 'Faysal House, St-02, Shahrah-e-Faisal, Karachi', board: [{ name: 'Farooq Rahmatullah', title: 'Chairman' }, { name: 'Yousaf Hussain', title: 'President & CEO' }, { name: 'Khalid Imran', title: 'CFO' }, { name: 'Dr. Imran Usmani', title: 'Shariah Advisor' }], strengths: ["Full Islamic conversion differentiates Faysal from hybrid competitors", "Ithmaar Holding backing provides Gulf investor confidence and capital", "Growing SME Islamic finance franchise in underserved market"], concerns: ["Conversion costs and IT overhaul impact near-term profitability", "Transition risk from conventional to Islamic balance sheet still ongoing", "Competition from Meezan Bank in Islamic space is intense"] },
    AKBL: { ceo: 'Muhammad Saleem Akhtar', founded: '1991', hq: 'Rawalpindi', employees: '5,800+', industry: 'Commercial Banking', fy: 'December', about: "Askari Bank is a leading commercial bank with Army Welfare Trust as its major shareholder. With 700+ branches, AKBL serves retail, consumer, and corporate customers with a focus on the defence and government services community.", brands: ['Askari Islamic', 'Askari Investment', 'Askari Digital'], auditors: 'KPMG Taseer Hadi & Co.', registeredOffice: 'AWT Plaza, The Mall, Rawalpindi', board: [{ name: 'Lt Gen Muhammad Naeem Lodhi', title: 'Chairman' }, { name: 'Muhammad Saleem Akhtar', title: 'President & CEO' }, { name: 'Tariq Mahmood', title: 'CFO' }, { name: 'Roshan Ali Shaikh', title: 'Independent Director' }], strengths: ["Army Welfare Trust backing ensures capital stability and institutional confidence", "Strong market position in defence, cantonments, and government salary accounts", "Well-capitalised with consistent dividend history"], concerns: ["Limited brand differentiation vs large private sector peers", "Higher reliance on term deposits increases cost of funds vs CASA-heavy peers", "Branch network growth constrained to garrison towns and cantonment areas"] },
    BOP: { ceo: 'Zafar Masud', founded: '1989', hq: 'Lahore', employees: '7,200+', industry: 'Commercial Banking', fy: 'December', about: "The Bank of Punjab is a provincial government-backed bank primarily operating in Punjab, Pakistan's most populous province. BOP provides retail, agricultural, and SME banking and serves as a key financial conduit for Punjab government salary and development fund disbursements.", brands: ['BOP Islamic', 'BOP Kissan Dost', 'BOP DigiPay'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'BOP Tower, 10-B, Block E-II, Main Boulevard Gulberg, Lahore', board: [{ name: 'Kamran Ali Agha', title: 'Chairman' }, { name: 'Zafar Masud', title: 'President & CEO' }, { name: 'Imran Shaukat', title: 'CFO' }, { name: 'Rukhsana Aftab', title: 'Independent Director' }], strengths: ["Punjab government support provides captive deposit base and salary disbursement mandate", "Strong agricultural and rural banking franchise across Punjab", "Post-restructuring capital adequacy now meets SBP requirements"], concerns: ["Provincial government ownership exposes bank to political influence on lending", "Large NPL legacy from directed agricultural and SME loans", "Competition from private banks intensifying in Punjab urban markets"] },
    SNBL: { ceo: 'Aamir Sarwar', founded: '1991', hq: 'Karachi', employees: '3,800+', industry: 'Commercial Banking', fy: 'December', about: "Soneri Bank Limited is a growing private commercial bank with 350+ branches across Pakistan. It offers retail, commercial, Islamic, and SME banking services and has been progressively expanding its digital channels.", brands: ['Soneri Islamic', 'Soneri Remittance', 'Soneri Digital'], auditors: 'KPMG Taseer Hadi & Co.', registeredOffice: 'Rupali House, 241-243, Abdul Hasan Ispahani Road, Karachi', board: [{ name: 'Alauddin Feerasta', title: 'Chairman' }, { name: 'Aamir Sarwar', title: 'President & CEO' }, { name: 'Saad Feerasta', title: 'Director' }, { name: 'Shaheen Iqbal', title: 'Independent Director' }], strengths: ["Feerasta family backing provides stability and long-term capital commitment", "Strong SME focus in key commercial cities taps underserved lending segment", "Conservative balance sheet with manageable NPL ratio"], concerns: ["Smaller scale limits ability to compete on rates and technology investments", "Limited international footprint restricts remittance income opportunity", "Brand awareness below larger peer banks constrains deposit mobilisation"] },
    JSBL: { ceo: 'Basir Shamsie', founded: '2006', hq: 'Karachi', employees: '4,500+', industry: 'Commercial Banking', fy: 'December', about: "JS Bank is a fast-growing commercial bank backed by the JS Group, one of Pakistan's leading financial conglomerates. With 400+ branches, JSBL focuses on consumer banking, SME finance, and digital banking innovation.", brands: ['JS Islamic', 'JS Digital', 'JS Remit'], auditors: 'EY Ford Rhodes', registeredOffice: 'Shaheen Commercial Complex, Dr. Ziauddin Ahmed Road, Karachi', board: [{ name: 'Jahangir Siddiqui', title: 'Chairman' }, { name: 'Basir Shamsie', title: 'President & CEO' }, { name: 'Farrukh Tashkentov', title: 'CFO' }, { name: 'Suleman Lalani', title: 'Independent Director' }], strengths: ["JS Group ecosystem provides cross-selling opportunities across capital markets and insurance", "Aggressive digital banking push with JSBL app growing rapidly", "SME banking focus targets an underserved high-growth segment"], concerns: ["Smaller scale limits cost efficiency vs top-tier peers", "Higher risk appetite in consumer and SME lending may increase NPLs in downturns", "Capital adequacy ratio has historically been tight relative to large banks"] },
    LUCK: { ceo: 'Muhammad Ali Tabba', founded: '1993', hq: 'Karachi', employees: '3,200+', industry: 'Cement Manufacturing', fy: 'June', about: "Lucky Cement is Pakistan's largest cement producer with combined capacity of 15.45 million tons per annum. The company runs state-of-the-art plants in Pezu and Karachi and exports to Afghanistan, Iraq, and East Africa.", brands: ['ICI Pakistan', 'Lucky Core Industries', 'Yunus Textile', 'Lucky Electric Power'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'Lucky One Mall Complex, Rashid Minhas Road, Karachi', board: [{ name: 'Bashir Ali Mohammad', title: 'Chairman' }, { name: 'Muhammad Ali Tabba', title: 'CEO' }, { name: 'Javed Iqbal', title: 'CFO' }, { name: 'Shazad Dada', title: 'Independent Director' }], strengths: ["Largest cement capacity in Pakistan with significant economies of scale", "Diversified conglomerate via ICI Pakistan, polyester, and power subsidiaries", "Export revenues provide a natural hedge against PKR devaluation"], concerns: ["Cement sector overcapacity with multiple players expanding simultaneously", "High energy costs (coal, gas) directly impact production margins", "Real estate slowdown reduces domestic off-take in peak construction season"] },
    MLCF: { ceo: 'Sayeed Tariq Saigol', founded: '1956', hq: 'Lahore', employees: '1,500+', industry: 'Cement Manufacturing', fy: 'June', about: "Maple Leaf Cement Factory is one of Pakistan's leading cement producers with integrated manufacturing facilities in Iskanderabad, producing Ordinary Portland Cement and specialty products for domestic and export markets.", brands: ['Maple Leaf Cement', 'Maple Leaf Pakfan'], auditors: 'EY Ford Rhodes', registeredOffice: '42-Lawrence Road, Lahore', board: [{ name: 'Tariq Sayeed Saigol', title: 'Chairman' }, { name: 'Sayeed Tariq Saigol', title: 'CEO' }, { name: 'Muhammad Siddique Khatri', title: 'CFO & Director' }, { name: 'Aamir Iqbal', title: 'Independent Director' }], strengths: ["Integrated plant with captive power reduces energy dependency", "Strong brand recognition in North and Central Pakistan markets", "Experienced Saigol Group management with multi-decade industry expertise"], concerns: ["Smaller scale vs LUCK and DGKC limits pricing power and cost efficiency", "Significant debt load from expansion pressures interest coverage", "Low liquidity stock with concentrated Saigol family ownership"] },
    DGKC: { ceo: 'Nasir Saeed', founded: '1978', hq: 'Lahore', employees: '2,200+', industry: 'Cement Manufacturing', fy: 'June', about: "D.G. Khan Cement Company manufactures Ordinary Portland Cement and Sulphate Resistant Cement in Pakistan. DGKC operates large-scale integrated plants serving domestic construction and export markets.", brands: ['DG Khan Cement', 'DGKC Chanda'], auditors: 'Deloitte Yousuf Adil', registeredOffice: '17-Abuzar Block, New Garden Town, Lahore', board: [{ name: 'Mian Raza Mansha', title: 'Chairman' }, { name: 'Nasir Saeed', title: 'CEO' }, { name: 'Usman Munir', title: 'CFO' }, { name: 'Wajid Aziz', title: 'Independent Director' }], strengths: ["Nishat Group backing provides financial resilience and cross-sector synergies", "Strong balance sheet with significant investment portfolio in Nishat group companies", "Chanda plant provides cost-efficient access to Sindh markets"], concerns: ["Earnings highly correlated with construction cycles and government PSDP", "Cement pricing pressure from new capacity entrants in South Pakistan", "Rising working capital requirements as government project receivables grow"] },
    PSO: { ceo: 'Dr. Syed Mehdi Shah', founded: '1974', hq: 'Karachi', employees: '4,500+', industry: 'Oil Marketing', fy: 'June', about: "Pakistan State Oil is the country's largest oil marketing company controlling over 50% of the petroleum market. PSO manages a vast network of fuel retail outlets and plays a critical role in energy security, supplying aviation fuel, furnace oil, and LNG.", brands: ['PSO Fuel Stations', 'PSO Lubricants', 'PSO Hi-Octane'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'PSO House, Khayaban-e-Iqbal, Clifton, Karachi', board: [{ name: 'Khalid Mansoor', title: 'Chairman' }, { name: 'Dr. Syed Mehdi Shah', title: 'MD & CEO' }, { name: 'Syed Ather Hussain', title: 'CFO' }, { name: 'Humayun Murad', title: 'Independent Director' }], strengths: ["Market leader with 50%+ petroleum products market share and widest retail network", "Government backing ensures supply chain continuity and strategic importance", "Growing LNG and aviation fuel segments provide higher-margin revenue diversification"], concerns: ["Massive circular debt owed by power sector clients strains working capital", "Thin retail margins subject to government-mandated price regulation", "Rising EV adoption globally creates long-term structural demand risk"] },
    OGDC: { ceo: 'Masood Nabi Abbasi', founded: '1961', hq: 'Islamabad', employees: '8,200+', industry: 'Oil & Gas E&P', fy: 'June', about: "Oil & Gas Development Company is Pakistan's largest E&P company responsible for approximately 44% of domestic natural gas and 46% of crude oil production. OGDC operates across the major sedimentary basins of Pakistan.", brands: ['OGDCL Exploration', 'Uch Power', 'OGDCL Infrastructure'], auditors: 'KPMG Taseer Hadi & Co.', registeredOffice: 'OGDCL House, Plot 3-A, F-6/G-6, Blue Area, Islamabad', board: [{ name: 'Dr. Kaiser Bengali', title: 'Chairman' }, { name: 'Masood Nabi Abbasi', title: 'MD & CEO' }, { name: 'Khalid Anees', title: 'CFO' }, { name: 'Shoaib Haider', title: 'Independent Director' }], strengths: ["Dominant E&P position with Pakistan's largest reserves and production portfolio", "Government ownership (70%) provides policy support and regulatory preference", "Low production costs from mature fields generate substantial free cash flow"], concerns: ["Circular debt receivables from SNGPL reduce effective cash flow", "Mature fields face natural decline requiring ongoing capex to sustain output", "Government ownership limits agility in investment decisions and dividend policy"] },
    PPL: { ceo: 'Sajid Zahid', founded: '1950', hq: 'Karachi', employees: '3,800+', industry: 'Oil & Gas E&P', fy: 'June', about: "Pakistan Petroleum Limited is the second largest E&P company in Pakistan and operates major gas fields including Sui, Adhi, Chachar, and Kandhkot. PPL is a key contributor to Pakistan's energy sector.", brands: ['PPL Sui', 'PPL Adhi', 'PPL Energy'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'PIDC House, Dr. Ziauddin Ahmed Road, Karachi', board: [{ name: 'Aamir Jameel', title: 'Chairman' }, { name: 'Sajid Zahid', title: 'MD & CEO' }, { name: 'Muhammad Asim Jamali', title: 'CFO' }, { name: 'Dr. Anis ul Haque', title: 'Independent Director' }], strengths: ["Sui field is Pakistan's largest gas field providing stable base production", "Strong balance sheet with minimal debt and significant cash reserves", "Ongoing exploration program could yield material reserve additions"], concerns: ["Sui field production in natural decline requires replacement from exploration", "Circular debt exposure from SNGPL receivables creates cash flow uncertainty", "Exploration risk elevated given geological complexity of new acreage"] },
    ENGRO: { ceo: 'Ghias Khan', founded: '1965', hq: 'Karachi', employees: '5,000+', industry: 'Diversified Conglomerate', fy: 'December', about: "Engro Corporation is one of Pakistan's largest conglomerates. From fertilizer manufacturing, it has grown into a multi-business entity with interests in energy, food, petrochemicals, digital infrastructure, and LNG terminal operations.", brands: ['Engro Fertilizers', 'Engro Foods', 'Engro Elengy Terminal', 'Engro Polymer', 'Engro Powergen'], auditors: 'A.F. Ferguson & Co. (PwC)', registeredOffice: 'The Harbour Front, HC-3, Marine Drive, Block-4, Clifton, Karachi', board: [{ name: 'Hussain Dawood', title: 'Chairman' }, { name: 'Ghias Khan', title: 'President & CEO' }, { name: 'Naz Khan', title: 'CFO & ED' }, { name: 'Khalid S. Subhani', title: 'Non-Executive Director' }], strengths: ["Highly diversified portfolio across fertilizers, LNG, power, food, and chemicals", "LNG terminal is a national strategic asset providing stable toll revenue", "Dawood Group ownership ensures long-term strategic stability and capital support"], concerns: ["Complex holding structure makes consolidated earnings analysis challenging", "Fertilizer business exposed to gas supply availability and subsidy changes", "Engro Foods faces intense competition from Nestlé and Unilever in dairy segment"] },
    FFC: { ceo: 'Lt Gen Tariq Khan', founded: '1978', hq: 'Rawalpindi', employees: '2,700+', industry: 'Fertilizer Manufacturing', fy: 'December', about: "Fauji Fertilizer Company is Pakistan's largest urea manufacturer, producing over 2 million metric tons annually across its Goth Machhi and Mirpur Mathelo plants. FFC serves millions of farmers across Pakistan.", brands: ['Fauji Urea', 'Fauji DAP', 'FFC Energy'], auditors: 'KPMG Taseer Hadi & Co.', registeredOffice: 'FFC House, 93-Harley Street, Rawalpindi', board: [{ name: 'Lt Gen Muhammad Saeed Aleem', title: 'Chairman' }, { name: 'Lt Gen Tariq Khan', title: 'CEO' }, { name: 'Brig. Shoaib Khalid', title: 'CFO & Director' }, { name: 'Qaiser Javed', title: 'Independent Director' }], strengths: ["Pakistan's largest urea producer with dominant 50%+ domestic market share", "High and consistent dividend yield — one of PSX's top income stocks", "Fauji Foundation backing provides institutional distribution and capital support"], concerns: ["Urea demand tied to agricultural cycle making earnings seasonally volatile", "Gas feedstock supply curtailment by SNGPL disrupts production plans", "Government-regulated urea prices limit ability to pass on cost increases"] },
    SYS: { ceo: 'Asif Peer', founded: '1977', hq: 'Lahore', employees: '15,000+', industry: 'IT Services & BPO', fy: 'December', about: "Systems Limited is Pakistan's largest IT company and leading software exporter. Listed on PSX, it serves Fortune 500 clients with digital transformation, AI, cloud engineering, and enterprise technology solutions.", brands: ['Tintash', 'CareCloud', 'Systems Arabia', 'SYS Connect'], auditors: 'EY Ford Rhodes', registeredOffice: '65-B, Sector A-1, Township, Lahore', board: [{ name: 'Tariq Hameed Chaudhri', title: 'Chairman' }, { name: 'Asif Peer', title: 'CEO' }, { name: 'Salman Siddiqui', title: 'CFO' }, { name: 'Shafqat Kasuri', title: 'Independent Director' }], strengths: ["Pakistan's #1 technology exporter with USD earnings providing PKR hedge", "Diversified global client base across healthcare, finance, and retail verticals", "CareCloud acquisition adds US healthcare IT exposure with high recurring revenue"], concerns: ["Global IT sector slowdown and client budget freezes impact revenue growth", "US dollar depreciation directly reduces PKR-equivalent export earnings", "Talent retention becomes costly as Pakistani tech professionals seek global opportunities"] },
    TRG: { ceo: 'Umar Saif', founded: '2002', hq: 'Islamabad', employees: '25,000+', industry: 'Technology & BPO', fy: 'December', about: "TRG Pakistan is a technology and BPO conglomerate with global operations through its subsidiary Ibex, one of the world's largest BPO providers serving clients in North America, the Middle East, and Europe.", brands: ['Ibex', 'TRG Digital', 'TRG Media'], auditors: 'KPMG Taseer Hadi & Co.', registeredOffice: 'TRG Tech Park, H-8/1, Islamabad', board: [{ name: 'Zia Chishti', title: 'Executive Chairman' }, { name: 'Umar Saif', title: 'CEO' }, { name: 'Adeel Shafqat', title: 'CFO' }, { name: 'Muhammad Ali Zeb', title: 'Independent Director' }], strengths: ["Ibex global scale provides access to large US enterprise clients with long-term contracts", "AI and automation capabilities position Ibex ahead of traditional BPO competitors", "USD revenue base from US operations provides significant PKR upside"], concerns: ["BPO industry faces pressure from AI automation disrupting call center jobs", "High operating leverage means revenue slowdowns quickly impact profitability", "Complex corporate structure across listed/unlisted entities creates governance concerns"] },
  }
  const info = INFO[s.symbol] ?? { ceo: 'N/A', founded: 'N/A', hq: 'Pakistan', employees: 'N/A', industry: s.sector, fy: 'June', about: `${s.company} is a leading company in Pakistan's ${s.sector} sector listed on the Pakistan Stock Exchange.`, brands: [], auditors: 'N/A', registeredOffice: 'Pakistan', board: [{ name: 'N/A', title: 'Chairman' }], strengths: ['Market leader in its sector', 'Consistent financial performance', 'Experienced management team'], concerns: ['Sector headwinds may impact growth', 'Regulatory uncertainty', 'External macro pressures'] }

  const scoreColor = (sc: number) => sc >= 60 ? '#16a34a' : sc >= 40 ? '#d97706' : '#dc2626'

  function makeArcPath(score: number) {
    const sc = Math.min(99.9, Math.max(0.1, score))
    const a  = Math.PI * (1 - sc / 100)
    return `M 12 52 A 38 38 0 0 0 ${(50 + 38 * Math.cos(a)).toFixed(2)} ${(52 - 38 * Math.sin(a)).toFixed(2)}`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* ── 1. Overall Stats ── */}
      <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)' }}>
        <div style={{ display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
          {/* Featured price */}
          <div style={{ padding: '18px 22px', borderRight: '1px solid var(--border-subtle)', minWidth: 150, flexShrink: 0 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>Price (PKR)</p>
            <p style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>{s.price.toFixed(2)}</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: 8, padding: '3px 10px', borderRadius: 5, background: up ? 'rgba(22,163,74,0.1)' : 'rgba(220,38,38,0.1)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: lineColor }}>{up ? '▲' : '▼'} {up ? '+' : ''}{s.change.toFixed(2)} ({up ? '+' : ''}{s.pct.toFixed(2)}%)</span>
            </div>
          </div>
          {/* Other stats */}
          {([
            { label: 'Open',     val: openPrice.toFixed(2),       sub: 'Today',    clr: '' },
            { label: 'High',     val: highPrice.toFixed(2),       sub: 'Today',    clr: 'var(--green-gain)' },
            { label: 'Low',      val: lowPrice.toFixed(2),        sub: 'Today',    clr: 'var(--red-loss)' },
            { label: 'Volume',   val: s.vol,                       sub: 'Shares',   clr: '' },
            { label: '52W High', val: s.w52h.toLocaleString(),    sub: 'All-time', clr: 'var(--green-gain)' },
            { label: '52W Low',  val: s.w52l.toLocaleString(),    sub: 'All-time', clr: 'var(--red-loss)' },
          ] as { label: string; val: string; sub: string; clr: string }[]).map((item, idx) => (
            <div key={item.label} style={{ flex: '1 1 80px', padding: '18px 16px', borderRight: idx < 5 ? '1px solid var(--border-subtle)' : 'none' }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>{item.label}</p>
              <p style={{ fontSize: 15, fontWeight: 800, color: item.clr || 'var(--text-primary)', letterSpacing: '-0.02em' }}>{item.val}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{item.sub}</p>
            </div>
          ))}
        </div>
        {/* 52W range bar */}
        <div style={{ padding: '10px 22px 14px', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 10, color: 'var(--red-loss)', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.w52l}</span>
            <div style={{ flex: 1, height: 4, background: 'var(--navy-700)', borderRadius: 2, position: 'relative' }}>
              <div style={{ position: 'absolute', left: `${Math.min(96, Math.max(4, (s.price - s.w52l) / (s.w52h - s.w52l) * 100))}%`, top: -3, width: 10, height: 10, borderRadius: '50%', background: lineColor, transform: 'translateX(-50%)', border: '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
            <span style={{ fontSize: 10, color: 'var(--green-gain)', fontWeight: 600, whiteSpace: 'nowrap' }}>{s.w52h}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 6 }}>52W Range</span>
          </div>
        </div>
      </div>

      {/* ── 2. Stockifyy Analysis ── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Stockifyy Analysis</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }} className="analysis-cards-grid">

          {/* Intrinsic Score — Fear & Greed style gauge */}
          <div style={{ padding: '22px 18px 20px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, alignSelf: 'flex-start' }}>Intrinsic Score</p>
            <GaugeMeter score={intrinsicScore} color={scoreColor(intrinsicScore)} />
            <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', color: scoreColor(intrinsicScore), lineHeight: 1, marginTop: 2 }}>{intrinsicScore}</span>
            <div style={{ marginTop: 8, padding: '4px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${scoreColor(intrinsicScore)}18`, color: scoreColor(intrinsicScore) }}>
              {intrinsicScore >= 65 ? 'Undervalued' : intrinsicScore >= 45 ? 'Fairly Valued' : 'Overvalued'}
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 10, textAlign: 'center', lineHeight: 1.6 }}>
              Intrinsic value<br /><strong style={{ color: 'var(--text-primary)', fontSize: 14 }}>PKR {intrinsicValue.toLocaleString()}</strong>
            </p>
          </div>

          {/* Margin of Safety */}
          <div style={{ padding: '22px 18px 20px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, alignSelf: 'flex-start' }}>Margin of Safety</p>
            <GaugeMeter
              score={Math.min(100, Math.max(0, 50 + mos))}
              color={mos > 0 ? '#16a34a' : '#dc2626'}
              leftLabel="Overpriced"
              rightLabel="Discount"
            />
            <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', color: mos > 0 ? 'var(--green-gain)' : 'var(--red-loss)', lineHeight: 1, marginTop: 2 }}>
              {mos > 0 ? '+' : ''}{mos}%
            </span>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, textAlign: 'center', lineHeight: 1.5 }}>
              {mos > 20 ? 'Significant discount — attractive entry' : mos > 5 ? 'Trading near intrinsic value' : mos > 0 ? 'Minimal discount — limited upside' : 'Trading above intrinsic value'}
            </p>
            <div style={{ marginTop: 10, width: '100%', background: 'var(--navy-800)', borderRadius: 8, padding: '10px 14px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>Current Price</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: mos > 0 ? 'var(--green-gain)' : 'var(--red-loss)' }}>PKR {s.price.toFixed(2)}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 3 }}>Intrinsic Value</p>
                <p style={{ fontSize: 13, fontWeight: 800, color: 'var(--brand-gold)' }}>PKR {intrinsicValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Stockifyy Score */}
          <div style={{ padding: '22px 18px 20px', borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 8, alignSelf: 'flex-start' }}>Stockifyy Score</p>
            <GaugeMeter score={stockifyyScore} color={scoreColor(stockifyyScore)} leftLabel="Weak" rightLabel="Strong" />
            <span style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.03em', color: scoreColor(stockifyyScore), lineHeight: 1, marginTop: 2 }}>{stockifyyScore}</span>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6, textAlign: 'center' }}>
              {stockifyyScore >= 65 ? 'Strong' : stockifyyScore >= 50 ? 'Moderate' : 'Weak'} overall rating
            </p>
            <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
              {([
                { label: 'Value',  score: valueScore  },
                { label: 'Growth', score: growthScore },
                { label: 'Safety', score: safetyScore },
                { label: 'Income', score: incomeScore },
              ] as { label: string; score: number }[]).map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: `${scoreColor(item.score)}12`, border: `1px solid ${scoreColor(item.score)}30` }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: scoreColor(item.score) }}>{item.score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Company Snapshot ── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Company Snapshot</p>
        <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {([
              { label: 'Market Cap',          val: `PKR ${mktCapB}B` },
              { label: 'Shares Outstanding',  val: `${sharesM}M shares` },
              { label: 'Free Float Shares',   val: `${freeFloatM}M shares` },
              { label: 'Weekly Avg Volume',   val: `${weeklyVolM}M` },
              { label: 'Free Float %',        val: `${freeFloatPct}%` },
              { label: 'Dividend Yield',      val: `${dividendYield}%` },
              { label: 'Earnings Per Share',  val: `PKR ${eps}` },
              { label: 'Net Income Margin',   val: `${netMarginPct}%` },
              { label: 'Price to Book',       val: `${pbRatio}x` },
              { label: 'Price to Earnings',   val: `${peRatio}x` },
              { label: 'PEG Ratio',           val: `${pegRatio}x` },
            ] as { label: string; val: string }[]).map((item, i, arr) => (
              <div key={item.label} style={{
                padding: '11px 16px',
                borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                ...(i === arr.length - 1 && arr.length % 2 === 1 ? { gridColumn: '1 / -1' } : {}),
                borderRight: (i % 2 === 0 && !(i === arr.length - 1 && arr.length % 2 === 1)) ? '1px solid var(--border-subtle)' : 'none',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{item.label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Stock vs KSE-100 ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Stock vs KSE-100 (1Y, Indexed to 100)</p>
          <div style={{ display: 'flex', gap: 14 }}>
            <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
              <span style={{ width: 14, height: 2, background: '#D97706', display: 'inline-block', borderRadius: 1 }} />{s.symbol}
            </span>
            <span style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
              <span style={{ width: 14, height: 2, background: '#3b82f6', display: 'inline-block', borderRadius: 1 }} />KSE-100
            </span>
          </div>
        </div>
        <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={compareData}>
              <defs>
                <linearGradient id="stockIdxGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#D97706" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#D97706" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="kseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="i" hide />
              <YAxis domain={['auto','auto']} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={40} tickFormatter={v => v.toFixed(0)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="stock" name={s.symbol} stroke="#D97706" strokeWidth={2} fill="url(#stockIdxGrad)" dot={false} />
              <Area type="monotone" dataKey="kse"   name="KSE-100" stroke="#3b82f6" strokeWidth={1.5} fill="url(#kseGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── 5. About the Company ── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>About {s.company}</p>
        <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '16px 20px', marginBottom: 10 }}>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--text-secondary)' }}>{info.about}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }} className="about-grid">
          {/* Corporate Information */}
          <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--navy-800)', borderBottom: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Information</p>
            </div>
            {([['Sector', s.sector], ['Industry', info.industry], ['Auditors', info.auditors], ['Registered Office', info.registeredOffice], ['Fiscal Year End', info.fy + ' 30'], ['Exchange', 'PSX (KSE)']] as [string, string][]).map(([label, val], i, arr) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>{val}</span>
              </div>
            ))}
          </div>
          {/* Board & Management */}
          <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
            <div style={{ padding: '10px 16px', background: 'var(--navy-800)', borderBottom: '1px solid var(--border-subtle)' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Board &amp; Management</p>
            </div>
            {info.board.map((member, i) => (
              <div key={member.name} style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', borderBottom: i < info.board.length - 1 ? '1px solid var(--border-subtle)' : 'none', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--navy-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {member.name.split(' ').filter(w => w.length > 1).slice(-2).map(w => w[0]).join('')}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{member.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 6. Brands & Subsidiaries ── */}
      {info.brands.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Brands &amp; Subsidiaries</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {info.brands.map((brand, idx) => {
              const palette = ['#1e40af','#065f46','#6b21a8','#b45309','#0e7490','#7c3aed','#0f766e','#92400e']
              return (
                <div key={brand} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: palette[idx % palette.length], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>
                      {brand.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('')}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>{brand}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── 7. Strengths & Concerns ── */}
      <div>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 10 }}>Strengths &amp; Concerns</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="strengths-grid">
          <div style={{ borderRadius: 10, border: '1px solid rgba(22,163,74,0.25)', background: 'rgba(22,163,74,0.03)', padding: '16px 18px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--green-gain)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#16a34a" opacity="0.2"/><path d="M4 7l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Strengths
            </p>
            {info.strengths.map((str, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < info.strengths.length - 1 ? 11 : 0 }}>
                <span style={{ color: 'var(--green-gain)', flexShrink: 0, fontWeight: 700 }}>•</span>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{str}</p>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: 10, border: '1px solid rgba(220,38,38,0.25)', background: 'rgba(220,38,38,0.03)', padding: '16px 18px' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--red-loss)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#dc2626" opacity="0.2"/><path d="M7 4v3.5M7 9.5v.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Concerns
            </p>
            {info.concerns.map((con, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: i < info.concerns.length - 1 ? 11 : 0 }}>
                <span style={{ color: 'var(--red-loss)', flexShrink: 0, fontWeight: 700 }}>•</span>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65 }}>{con}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

function CandlestickLayer({ xAxisMap, yAxisMap, data }: any) {
  const xAxis = xAxisMap?.[0]
  const yAxis = yAxisMap?.[0]
  if (!xAxis?.scale || !yAxis?.scale) return null
  const n = (data as any[])?.length ?? 0
  const barW = Math.max(2, Math.min(10, 500 / (n || 1) * 0.6))
  return (
    <g>
      {(data as any[])?.map((d, idx) => {
        const x  = xAxis.scale(d.i ?? idx)
        const hy = yAxis.scale(d.high)
        const ly = yAxis.scale(d.low)
        const oy = yAxis.scale(d.open)
        const cy = yAxis.scale(d.close)
        const isUp = d.close >= d.open
        const col  = isUp ? '#16a34a' : '#dc2626'
        const bodyTop = Math.min(oy, cy)
        const bodyH   = Math.max(1.5, Math.abs(cy - oy))
        return (
          <g key={idx}>
            <line x1={x} y1={hy} x2={x} y2={ly} stroke={col} strokeWidth={1} opacity={0.7} />
            <rect x={x - barW / 2} y={bodyTop} width={barW} height={bodyH}
              fill={isUp ? 'none' : col} stroke={col} strokeWidth={1.5} rx={0.5} />
          </g>
        )
      })}
    </g>
  )
}

function ChartsTab({ s }: { s: typeof UNIVERSE[string] }) {
  const [frame, setFrame] = useState<'1D'|'1W'|'1M'|'3M'|'6M'|'1Y'>('1M')
  const [chartType, setChartType] = useState<'area'|'candle'>('area')
  const POINTS: Record<string, number> = { '1D': 78, '1W': 35, '1M': 22, '3M': 65, '6M': 130, '1Y': 250 }
  const up = s.change >= 0
  const lineColor = up ? '#16a34a' : '#dc2626'
  const pts = POINTS[frame]

  const areaData = genPrice(s.price, pts, s.price * 13 + pts)
  const ohlcData = genOHLC(s.price, pts, s.price * 17 + pts)
  const ohlcMin = Math.min(...ohlcData.map(d => d.low)) * 0.998
  const ohlcMax = Math.max(...ohlcData.map(d => d.high)) * 1.002

  const rand = seededRand(s.price * 5)
  const volData = (chartType === 'area' ? areaData : ohlcData).map((d: any) => ({
    i: d.i, vol: Math.floor(rand() * 5000000 + 500000),
    up: chartType === 'candle' ? (d.close ?? 0) >= (d.open ?? 0) : true,
  }))

  const areaPrices = areaData.map(d => d.v)
  const resist = +(Math.max(...areaPrices.slice(-Math.min(20, areaPrices.length))) * 1.005).toFixed(2)
  const support = +(Math.min(...areaPrices.slice(-Math.min(20, areaPrices.length))) * 0.995).toFixed(2)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Controls row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['1D','1W','1M','3M','6M','1Y'] as const).map(f => (
            <button key={f} onClick={() => setFrame(f)} style={{
              padding: '5px 13px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: frame === f ? lineColor : 'var(--navy-800)',
              color: frame === f ? '#fff' : 'var(--text-muted)', transition: 'all 0.15s',
            }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {(['area','candle'] as const).map(t => (
            <button key={t} onClick={() => setChartType(t)} style={{
              padding: '5px 13px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${chartType === t ? 'var(--brand-gold)' : 'var(--border-subtle)'}`,
              background: chartType === t ? 'rgba(217,119,6,0.1)' : 'var(--navy-900)',
              color: chartType === t ? 'var(--brand-gold)' : 'var(--text-muted)', transition: 'all 0.15s',
            }}>{t === 'area' ? 'Area' : 'Candle'}</button>
          ))}
        </div>
      </div>

      {/* Price chart */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
        <ResponsiveContainer width="100%" height={280}>
          {chartType === 'area' ? (
            <AreaChart data={areaData}>
              <defs>
                <linearGradient id="cGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={lineColor} stopOpacity={0.16} />
                  <stop offset="95%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="i" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} />
              <YAxis domain={['auto','auto']} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={64} tickFormatter={v => v.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={resist} stroke="var(--red-loss)" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: `R  ${resist.toLocaleString()}`, position: 'insideTopRight', fontSize: 10, fill: 'var(--red-loss)' }} />
              <ReferenceLine y={support} stroke="var(--green-gain)" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: `S  ${support.toLocaleString()}`, position: 'insideBottomRight', fontSize: 10, fill: 'var(--green-gain)' }} />
              <Area type="monotone" dataKey="v" name="Price (PKR)" stroke={lineColor} strokeWidth={2} fill="url(#cGrad)" dot={false} />
            </AreaChart>
          ) : (
            <ComposedChart data={ohlcData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
              <XAxis dataKey="i" type="number" domain={[0, pts - 1]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} />
              <YAxis domain={[ohlcMin, ohlcMax]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={64} tickFormatter={v => v.toLocaleString()} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={ohlcMax * 0.995} stroke="var(--red-loss)" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: 'R', position: 'insideTopRight', fontSize: 10, fill: 'var(--red-loss)' }} />
              <ReferenceLine y={ohlcMin * 1.005} stroke="var(--green-gain)" strokeDasharray="4 4" strokeWidth={1.5}
                label={{ value: 'S', position: 'insideBottomRight', fontSize: 10, fill: 'var(--green-gain)' }} />
              <Bar dataKey="high" fill="transparent" stroke="transparent" />
              <Customized component={CandlestickLayer} />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Volume */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '12px 16px' }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>Volume</p>
        <ResponsiveContainer width="100%" height={70}>
          <BarChart data={volData} barSize={4}>
            <XAxis dataKey="i" hide />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="vol" name="Volume">
              {volData.map((d, i) => <Cell key={i} fill={d.up ? '#16a34a' : '#dc2626'} opacity={0.55} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function SectorPeersTab({ s }: { s: typeof UNIVERSE[string] }) {
  const peers = Object.values(UNIVERSE).filter(x => x.sector === s.sector)
  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--navy-800)', borderBottom: '2px solid var(--border-subtle)' }}>
            {['Symbol','Company','Price','Change','% Chg','Volume','52W High','52W Low'].map((h, i) => (
              <th key={h} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: i <= 1 ? 'left' : 'right', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {peers.map(p => {
            const up = p.change >= 0
            const c = up ? 'var(--green-gain)' : 'var(--red-loss)'
            const isActive = p.symbol === s.symbol
            return (
              <tr key={p.symbol} className="tr-hover" style={{ borderBottom: '1px solid var(--border-subtle)', background: isActive ? 'rgba(217,119,6,0.05)' : 'transparent' }}>
                <td style={{ padding: '9px 14px' }}>
                  <Link href={`/dashboard/stocks/${p.symbol}`} style={{ fontSize: 13, fontWeight: 700, color: isActive ? 'var(--brand-gold)' : 'var(--text-primary)', textDecoration: 'none' }}>
                    {p.symbol} {isActive && <span style={{ fontSize: 10, background: 'var(--brand-gold)', color: '#fff', borderRadius: 3, padding: '1px 5px', marginLeft: 4 }}>THIS</span>}
                  </Link>
                </td>
                <td style={{ padding: '9px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{p.company}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 13, fontWeight: 700 }}>{p.price.toFixed(2)}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: c }}>{up ? '+' : ''}{p.change.toFixed(2)}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, fontWeight: 600, color: c }}>{up ? '+' : ''}{p.pct.toFixed(2)}%</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>{p.vol}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, color: 'var(--green-gain)' }}>{p.w52h.toLocaleString()}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, color: 'var(--red-loss)' }}>{p.w52l.toLocaleString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function CompareSectorTab({ s, onTabChange }: { s: typeof UNIVERSE[string]; onTabChange?: (t: string) => void }) {
  const peers = Object.values(UNIVERSE).filter(x => x.sector === s.sector)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [customField, setCustomField] = useState('')

  type MetricDef = {
    key: string
    label: string
    fmt: (v: number) => string
    betterIsHigh: boolean
    getValue: (p: typeof UNIVERSE[string]) => number
    group: string
  }

  const isBanking = s.sector === 'Banking'

  const ALL_METRICS: MetricDef[] = [
    // MARKET
    { key: 'mktcap',    group: 'MARKET',       label: 'Market Cap (PKR B)',    fmt: v => `${v.toFixed(1)}B`,    betterIsHigh: true,  getValue: p => { const r = seededRand(p.price * 37); r(); return +(p.price * Math.round(200 + r() * 800) / 1000).toFixed(1) } },
    { key: 'pe',        group: 'VALUATION',    label: 'P / E',                 fmt: v => `${v.toFixed(2)}x`,   betterIsHigh: false, getValue: p => 4   + (p.price % 9) },
    { key: 'pb',        group: 'VALUATION',    label: 'P / B',                 fmt: v => `${v.toFixed(2)}x`,   betterIsHigh: false, getValue: p => +(0.9 + (p.price % 3)).toFixed(2) },
    { key: 'divyield',  group: 'VALUATION',    label: 'Dividend Yield',        fmt: v => `${v.toFixed(2)}%`,   betterIsHigh: true,  getValue: p => 1   + (p.price % 7) },
    { key: 'eps',       group: 'VALUATION',    label: 'EPS (PKR)',             fmt: v => `PKR ${v.toFixed(2)}`,betterIsHigh: true,  getValue: p => +(p.price / (6 + (p.price % 14))).toFixed(2) },
    { key: 'peg',       group: 'VALUATION',    label: 'PEG Ratio',             fmt: v => `${v.toFixed(2)}x`,   betterIsHigh: false, getValue: p => +(0.5 + (p.price % 2)).toFixed(2) },
    // INCOME STATEMENT
    { key: 'revenue',   group: 'FINANCIALS',   label: 'Revenue (PKR B)',       fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.08 + (p.price % 18)).toFixed(1) },
    { key: 'netrev',    group: 'FINANCIALS',   label: 'Net Revenue',           fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.07 + (p.price % 14)).toFixed(1) },
    { key: 'grossprof', group: 'FINANCIALS',   label: 'Gross Profit',          fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.04 + (p.price % 8)).toFixed(1) },
    { key: 'opincome',  group: 'FINANCIALS',   label: 'Operating Profit',      fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.035 + (p.price % 6)).toFixed(1) },
    { key: 'ebitda',    group: 'FINANCIALS',   label: 'EBITDA',                fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.04 + (p.price % 9)).toFixed(1) },
    { key: 'netprofit', group: 'FINANCIALS',   label: 'Net Profit',            fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.025 + (p.price % 5)).toFixed(1) },
    // BALANCE SHEET
    { key: 'totassets', group: 'BALANCE SHEET',label: 'Total Assets',          fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.6 + (p.price % 80)).toFixed(1) },
    { key: 'totequity', group: 'BALANCE SHEET',label: 'Total Equity',          fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.12 + (p.price % 20)).toFixed(1) },
    { key: 'totdebt',   group: 'BALANCE SHEET',label: 'Total Debt',            fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: false, getValue: p => +(p.price * 0.08 + (p.price % 15)).toFixed(1) },
    { key: 'cash',      group: 'BALANCE SHEET',label: 'Cash & Equivalents',    fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.04 + (p.price % 10)).toFixed(1) },
    // OTHER
    { key: 'depr',      group: 'OTHER',        label: 'Depreciation',          fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: false, getValue: p => +(p.price * 0.008 + (p.price % 2)).toFixed(1) },
    { key: 'capex',     group: 'OTHER',        label: 'Capital Expenditure',   fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: false, getValue: p => +(p.price * 0.01 + (p.price % 3)).toFixed(1) },
    { key: 'inventory', group: 'OTHER',        label: 'Inventory',             fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: false, getValue: p => +(p.price * 0.015 + (p.price % 4)).toFixed(1) },
    { key: 'finecost',  group: 'OTHER',        label: 'Finance Cost',          fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: false, getValue: p => +(p.price * 0.007 + (p.price % 2)).toFixed(1) },
    { key: 'taxexp',    group: 'OTHER',        label: 'Tax Expense',           fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: false, getValue: p => +(p.price * 0.009 + (p.price % 2)).toFixed(1) },
    { key: 'retearns',  group: 'OTHER',        label: 'Retained Earnings',     fmt: v => `${v.toFixed(1)}B`,   betterIsHigh: true,  getValue: p => +(p.price * 0.05 + (p.price % 8)).toFixed(1) },
    // PROFITABILITY
    { key: 'roe',       group: 'PROFITABILITY',label: 'ROE',                   fmt: v => `${v.toFixed(2)}%`,   betterIsHigh: true,  getValue: p => 10  + (p.price % 22) },
    { key: 'roa',       group: 'PROFITABILITY',label: 'ROA',                   fmt: v => `${v.toFixed(2)}%`,   betterIsHigh: true,  getValue: p => 1   + (p.price % 5) },
    { key: 'netmargin', group: 'PROFITABILITY',label: 'Net Margin',            fmt: v => `${v.toFixed(2)}%`,   betterIsHigh: true,  getValue: p => 2   + (p.price % 8) },
    { key: 'grossmarg', group: 'PROFITABILITY',label: 'Gross Margin',          fmt: v => `${v.toFixed(2)}%`,   betterIsHigh: true,  getValue: p => 20  + (p.price % 30) },
    // PERFORMANCE
    { key: 'ret1y',     group: 'PERFORMANCE',  label: '1Y Return',             fmt: v => `${v > 0 ? '+' : ''}${v.toFixed(2)}%`, betterIsHigh: true, getValue: p => 18 + (p.price % 65) },
    { key: 'w52pos',    group: 'PERFORMANCE',  label: '52W Position',          fmt: v => `${v.toFixed(0)}%`,   betterIsHigh: true,  getValue: p => ((p.price - p.w52l) / (p.w52h - p.w52l)) * 100 },
    { key: 'vol',       group: 'PERFORMANCE',  label: 'Avg Volume',            fmt: v => `${v.toFixed(1)}M`,   betterIsHigh: true,  getValue: p => 0.5 + (p.price % 4) },
    // BANKING-SPECIFIC
    ...(isBanking ? [
      { key: 'advances',  group: 'BANKING',    label: 'Advances',              fmt: (v: number) => `${v.toFixed(1)}B`,  betterIsHigh: true,  getValue: (p: typeof UNIVERSE[string]) => +(p.price * 0.4 + (p.price % 50)).toFixed(1) },
      { key: 'deposits',  group: 'BANKING',    label: 'Deposits',              fmt: (v: number) => `${v.toFixed(1)}B`,  betterIsHigh: true,  getValue: (p: typeof UNIVERSE[string]) => +(p.price * 0.5 + (p.price % 60)).toFixed(1) },
      { key: 'nii',       group: 'BANKING',    label: 'Net Interest Income',   fmt: (v: number) => `${v.toFixed(1)}B`,  betterIsHigh: true,  getValue: (p: typeof UNIVERSE[string]) => +(p.price * 0.06 + (p.price % 10)).toFixed(1) },
      { key: 'invest',    group: 'BANKING',    label: 'Investments',           fmt: (v: number) => `${v.toFixed(1)}B`,  betterIsHigh: true,  getValue: (p: typeof UNIVERSE[string]) => +(p.price * 0.35 + (p.price % 40)).toFixed(1) },
      { key: 'markup',    group: 'BANKING',    label: 'Markup Income',         fmt: (v: number) => `${v.toFixed(1)}B`,  betterIsHigh: true,  getValue: (p: typeof UNIVERSE[string]) => +(p.price * 0.07 + (p.price % 12)).toFixed(1) },
      { key: 'npl',       group: 'BANKING',    label: 'NPL Ratio',             fmt: (v: number) => `${v.toFixed(2)}%`,  betterIsHigh: false, getValue: (p: typeof UNIVERSE[string]) => 2 + (p.price % 8) },
      { key: 'nim',       group: 'BANKING',    label: 'Net Interest Margin',   fmt: (v: number) => `${v.toFixed(2)}%`,  betterIsHigh: true,  getValue: (p: typeof UNIVERSE[string]) => 3 + (p.price % 4) },
      { key: 'casa',      group: 'BANKING',    label: 'CASA Ratio',            fmt: (v: number) => `${v.toFixed(1)}%`,  betterIsHigh: true,  getValue: (p: typeof UNIVERSE[string]) => 30 + (p.price % 40) },
    ] : []),
  ]

  const DEFAULT_KEYS = ['mktcap', 'pe', 'divyield', 'roe', 'netmargin', 'ret1y', 'w52pos',
    ...(isBanking ? ['nii', 'deposits', 'npl'] : []),
  ]
  const [selectedKeys, setSelectedKeys] = useState<string[]>(DEFAULT_KEYS)

  const toggleKey = (key: string) => setSelectedKeys(prev =>
    prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
  )

  const selectedMetrics = ALL_METRICS.filter(m => selectedKeys.includes(m.key))
  const summaryMetrics = selectedMetrics.slice(0, 4)
  const activeGroups = [...new Set(selectedMetrics.map(m => m.group))]
  const allGroups = [...new Set(ALL_METRICS.map(m => m.group))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Metric picker ── */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setPickerOpen(o => !o)}
          style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: `1.5px solid ${pickerOpen ? 'var(--brand-gold)' : 'var(--border-normal)'}`, background: 'var(--navy-900)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}
        >
          <span style={{ color: 'var(--brand-gold)', fontWeight: 700 }}>{selectedKeys.length} metrics selected</span>
          {pickerOpen ? <MdKeyboardArrowUp size={20} color="var(--text-muted)" /> : <MdKeyboardArrowDown size={20} color="var(--text-muted)" />}
        </button>

        {pickerOpen && (
          <div style={{ position: 'absolute', top: '110%', left: 0, right: 0, zIndex: 50, background: 'var(--navy-900)', border: '1px solid var(--border-normal)', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.12)', maxHeight: 400, overflowY: 'auto', padding: '8px 0' }}>
            {allGroups.map(group => (
              <div key={group}>
                <div style={{ padding: '8px 16px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', color: 'var(--text-muted)' }}>{group}</div>
                {ALL_METRICS.filter(m => m.group === group).map(m => (
                  <label key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 16px', cursor: 'pointer', background: selectedKeys.includes(m.key) ? 'rgba(217,119,6,0.06)' : 'transparent' }}>
                    <span style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${selectedKeys.includes(m.key) ? 'var(--brand-gold)' : 'var(--border-normal)'}`, background: selectedKeys.includes(m.key) ? 'var(--brand-gold)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {selectedKeys.includes(m.key) && <span style={{ color: '#fff', fontSize: 10, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                    </span>
                    <input type="checkbox" checked={selectedKeys.includes(m.key)} onChange={() => toggleKey(m.key)} style={{ display: 'none' }} />
                    <span style={{ fontSize: 13, color: selectedKeys.includes(m.key) ? 'var(--brand-gold)' : 'var(--text-primary)' }}>{m.label}</span>
                  </label>
                ))}
              </div>
            ))}
            {/* Custom field */}
            <div>
              <div style={{ padding: '8px 16px 4px', fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', color: 'var(--text-muted)' }}>CUSTOM FIELD</div>
              <div style={{ padding: '6px 16px 10px' }}>
                <input
                  value={customField}
                  onChange={e => setCustomField(e.target.value)}
                  placeholder="Type field name..."
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 6, border: '1px solid var(--border-normal)', background: 'var(--navy-800)', fontSize: 12, color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedMetrics.length === 0 ? (
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>Select at least one metric above to compare</div>
      ) : (
        <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>

          {/* ── Top summary cards ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--border-subtle)' }} className="compare-summary-grid">
            {summaryMetrics.map((m, idx) => {
              const allVals = peers.map(p => m.getValue(p))
              const avg = allVals.reduce((a, b) => a + b, 0) / allVals.length
              const stockVal = m.getValue(s)
              const isAbove = m.betterIsHigh ? stockVal >= avg : stockVal <= avg
              return (
                <div key={m.key} style={{ padding: '18px 20px', borderRight: idx < 3 ? '1px solid var(--border-subtle)' : 'none', background: isAbove ? 'rgba(22,163,74,0.04)' : 'transparent' }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{m.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 4 }}>{m.fmt(stockVal)}</p>
                  <p style={{ fontSize: 11, color: isAbove ? 'var(--green-gain)' : 'var(--red-loss)' }}>
                    {isAbove ? '▲ Above' : '▼ Below'} avg {m.fmt(+avg.toFixed(2))}
                  </p>
                </div>
              )
            })}
          </div>

          {/* ── Weaker / Stronger header ── */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px 4px', gap: 16 }}>
            <div style={{ flex: '0 0 180px' }} />
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: 64 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Weaker</span>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-muted)' }}>Stronger</span>
            </div>
          </div>

          {/* ── Grouped metric rows ── */}
          {activeGroups.map(group => {
            const groupMetrics = selectedMetrics.filter(m => m.group === group)
            return (
              <div key={group}>
                <div style={{ padding: '8px 20px 4px', background: 'var(--navy-800)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', color: 'var(--text-muted)' }}>{group}</span>
                </div>
                {groupMetrics.map(metric => {
                  const values = peers.map(p => ({ symbol: p.symbol, val: metric.getValue(p) }))
                  const allNums = values.map(v => v.val)
                  const minV = Math.min(...allNums)
                  const maxV = Math.max(...allNums)
                  const range = maxV - minV || 1
                  const avg = allNums.reduce((a, b) => a + b, 0) / allNums.length
                  const stockVal = metric.getValue(s)
                  const sorted = [...values].sort((a, b) => metric.betterIsHigh ? b.val - a.val : a.val - b.val)
                  const rank = sorted.findIndex(v => v.symbol === s.symbol) + 1
                  const toPct = (val: number) => {
                    const norm = metric.betterIsHigh ? ((val - minV) / range) : (1 - (val - minV) / range)
                    return Math.min(96, Math.max(4, norm * 100))
                  }
                  const avgPct = toPct(avg)

                  return (
                    <div key={metric.key} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', gap: 16 }}>
                      <div style={{ flex: '0 0 180px' }}>
                        <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3 }}>{metric.label}</p>
                        <p style={{ fontSize: 16, fontWeight: 800, color: 'var(--brand-gold)', letterSpacing: '-0.02em' }}>{metric.fmt(stockVal)}</p>
                      </div>
                      <div style={{ flex: 1, position: 'relative', height: 56 }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 2, background: 'var(--navy-700)', borderRadius: 1, transform: 'translateY(-50%)' }} />
                        <div style={{ position: 'absolute', left: `${avgPct}%`, top: '20%', height: '60%', width: 2, borderLeft: '2px dashed var(--text-muted)', transform: 'translateX(-50%)' }} />
                        {values.map(pv => {
                          const pct = toPct(pv.val)
                          const isThis = pv.symbol === s.symbol
                          return (
                            <div key={pv.symbol} style={{ position: 'absolute', left: `${pct}%`, top: '50%', transform: 'translate(-50%, -50%)', zIndex: isThis ? 4 : 2 }}>
                              {isThis ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                  <div style={{ background: 'var(--brand-gold)', color: '#fff', fontSize: 9, fontWeight: 800, borderRadius: 4, padding: '2px 6px', whiteSpace: 'nowrap', marginBottom: 4, boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }}>{metric.fmt(pv.val)}</div>
                                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--brand-gold)', border: '2.5px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(217,119,6,0.4)' }}>
                                    <span style={{ fontSize: 7, fontWeight: 900, color: '#fff' }}>{pv.symbol.slice(0, 3)}</span>
                                  </div>
                                </div>
                              ) : (
                                <div title={`${pv.symbol}: ${metric.fmt(pv.val)}`} style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--navy-800)', border: '2px solid var(--navy-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
                                  <span style={{ fontSize: 6, fontWeight: 800, color: 'var(--text-secondary)' }}>{pv.symbol.slice(0, 2)}</span>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                      <div style={{ flex: '0 0 60px', textAlign: 'right' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: rank === 1 ? 'var(--green-gain)' : rank === peers.length ? 'var(--red-loss)' : 'var(--text-secondary)' }}>
                          {rank}{rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} / {peers.length}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* ── Footer ── */}
          <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--brand-gold)', display: 'inline-block' }} /> This Stock
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--navy-700)', border: '2px solid var(--navy-600)', display: 'inline-block' }} /> Peers
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)' }}>
                <span style={{ width: 14, height: 2, borderTop: '2px dashed var(--text-muted)', display: 'inline-block' }} /> Sector avg
              </span>
            </div>
            {onTabChange && (
              <button onClick={() => onTabChange('Sector Peers')} style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-gold)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                See All Peers &rsaquo;
              </button>
            )}
          </div>
          <div style={{ padding: '0 20px 12px' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {s.sector} &middot; {peers.length} {peers.length === 1 ? 'company' : 'companies'} &middot; Financials based on latest twelve months.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function FinancialsTab({ s }: { s: typeof UNIVERSE[string] }) {
  const [sheet, setSheet] = useState<'income'|'balance'>('income')

  const r = seededRand(s.price * 99)
  const base = s.price * 10

  // Income Statement data — TTM + FY2025..FY2021
  const YEARS = ['TTM', '2025', '2024', '2023', '2022', '2021']
  const incomeRows = [
    { item: 'Revenue',             vals: YEARS.map((_, i) => +(base * (1.18 - i * 0.06) * (0.9 + r() * 0.2)).toFixed(1)) },
    { item: 'Gross Profit',        vals: YEARS.map((_, i) => +(base * (0.42 - i * 0.02) * (0.9 + r() * 0.15)).toFixed(1)) },
    { item: 'Operating Profit',    vals: YEARS.map((_, i) => +(base * (0.28 - i * 0.015) * (0.9 + r() * 0.12)).toFixed(1)) },
    { item: 'EBITDA',              vals: YEARS.map((_, i) => +(base * (0.33 - i * 0.015) * (0.9 + r() * 0.12)).toFixed(1)) },
    { item: 'Finance Cost',        vals: YEARS.map((_, i) => +(base * (0.06 + i * 0.005) * (0.95 + r() * 0.1)).toFixed(1)) },
    { item: 'Tax Expense',         vals: YEARS.map((_, i) => +(base * (0.07 - i * 0.005) * (0.9 + r() * 0.1)).toFixed(1)) },
    { item: 'Net Profit',          vals: YEARS.map((_, i) => +(base * (0.22 - i * 0.015) * (0.9 + r() * 0.12)).toFixed(1)) },
    { item: 'EPS (PKR)',           vals: YEARS.map((_, i) => +(s.price / (6 + i * 0.5) * (0.95 + r() * 0.1)).toFixed(2)) },
    { item: 'Gross Margin %',      vals: YEARS.map(() => +(35 + r() * 20).toFixed(1)),  isPct: true },
    { item: 'Net Margin %',        vals: YEARS.map(() => +(8  + r() * 18).toFixed(1)),  isPct: true },
    { item: 'Dividend (PKR)',      vals: YEARS.map((_, i) => +(2 + i * 0.3 + r() * 4).toFixed(2)) },
  ]

  // Balance Sheet data
  const balanceRows = [
    { item: 'Total Assets',        vals: YEARS.map((_, i) => +(base * (6 - i * 0.3) * (0.95 + r() * 0.1)).toFixed(1)) },
    { item: 'Total Equity',        vals: YEARS.map((_, i) => +(base * (1.2 - i * 0.05) * (0.95 + r() * 0.1)).toFixed(1)) },
    { item: 'Total Debt',          vals: YEARS.map((_, i) => +(base * (0.8 + i * 0.04) * (0.9 + r() * 0.1)).toFixed(1)) },
    { item: 'Cash & Equivalents',  vals: YEARS.map((_, i) => +(base * (0.4 - i * 0.02) * (0.9 + r() * 0.15)).toFixed(1)) },
    { item: 'Investments',         vals: YEARS.map((_, i) => +(base * (3.5 - i * 0.2) * (0.9 + r() * 0.1)).toFixed(1)) },
    { item: 'Net Advances / Loans',vals: YEARS.map((_, i) => +(base * (4 - i * 0.25) * (0.9 + r() * 0.1)).toFixed(1)) },
    { item: 'Deposits / Liabilities',vals: YEARS.map((_, i) => +(base * (4.8 - i * 0.28) * (0.9 + r() * 0.1)).toFixed(1)) },
    { item: 'Book Value / Share',  vals: YEARS.map((_, i) => +(s.price * (0.6 - i * 0.03) * (0.95 + r() * 0.1)).toFixed(2)) },
    { item: 'Debt / Equity',       vals: YEARS.map(() => +(0.4 + r() * 0.6).toFixed(2)), isRatio: true },
    { item: 'Current Ratio',       vals: YEARS.map(() => +(1 + r() * 0.8).toFixed(2)),   isRatio: true },
    { item: 'ROE %',               vals: YEARS.map(() => +(10 + r() * 25).toFixed(1)),    isPct: true },
    { item: 'ROA %',               vals: YEARS.map(() => +(1 + r() * 4).toFixed(1)),      isPct: true },
  ]

  const rows = sheet === 'income' ? incomeRows : balanceRows

  // Chart data (annual — last 5 years for chart)
  const chartYears = ['2021','2022','2023','2024','2025']
  const incomeChartData = chartYears.map((y, i) => ({
    y,
    revenue:   incomeRows[0].vals[5 - i],
    netProfit: incomeRows[6].vals[5 - i],
    eps:       incomeRows[7].vals[5 - i],
  }))
  const balanceChartData = chartYears.map((y, i) => ({
    y,
    assets:  balanceRows[0].vals[5 - i],
    equity:  balanceRows[1].vals[5 - i],
    debt:    balanceRows[2].vals[5 - i],
  }))

  const fmtVal = (v: number, isPct?: boolean, isRatio?: boolean) =>
    isPct ? `${v}%` : isRatio ? `${v}x` : `${v >= 1000 ? (v / 1000).toFixed(1) + 'B' : v + 'M'}`

  const colStyle = (i: number): React.CSSProperties => ({
    padding: '9px 14px',
    textAlign: i === 0 ? 'left' : 'right',
    fontSize: i === 0 ? 13 : 12,
    fontWeight: i === 0 ? 600 : i === 1 ? 700 : 400,
    color: i === 0 ? 'var(--text-primary)' : i === 1 ? 'var(--brand-gold)' : 'var(--text-secondary)',
    borderBottom: '1px solid var(--border-subtle)',
    whiteSpace: 'nowrap',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Tab + PDF row ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: 4, background: 'var(--navy-800)', padding: 4, borderRadius: 8 }}>
          {([['income','Income Statement'],['balance','Balance Sheet']] as const).map(([key, label]) => (
            <button key={key} onClick={() => setSheet(key)} style={{
              padding: '6px 18px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
              background: sheet === key ? 'var(--brand-gold)' : 'transparent',
              color: sheet === key ? '#fff' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}>{label}</button>
          ))}
        </div>
        <a
          href="#"
          onClick={e => e.preventDefault()}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 7, border: '1px solid var(--border-normal)', background: 'var(--navy-900)', textDecoration: 'none', cursor: 'pointer' }}
        >
          <MdPictureAsPdf size={16} color="#dc2626" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
            {sheet === 'income' ? 'Income Statement' : 'Balance Sheet'} PDF
          </span>
          <MdDownload size={14} color="var(--text-muted)" />
        </a>
      </div>

      {/* ── Charts ── */}
      {sheet === 'income' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="fin-charts-grid">
          <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Revenue vs Net Profit (PKR M)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={incomeChartData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={50} tickFormatter={v => `${(v/1000).toFixed(0)}B`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue"   name="Revenue"    fill="#3b82f6" radius={[3,3,0,0]} />
                <Bar dataKey="netProfit" name="Net Profit" fill="#16a34a" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Earnings Per Share (PKR)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={incomeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={40} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="eps" name="EPS" fill="var(--brand-gold)" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="fin-charts-grid">
          <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Assets, Equity & Debt (PKR M)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={balanceChartData} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={50} tickFormatter={v => `${(v/1000).toFixed(0)}B`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="assets" name="Total Assets"  fill="#3b82f6" radius={[3,3,0,0]} />
                <Bar dataKey="equity" name="Total Equity"  fill="#16a34a" radius={[3,3,0,0]} />
                <Bar dataKey="debt"   name="Total Debt"    fill="#dc2626" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 10 }}>Equity Growth Trend</p>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={balanceChartData}>
                <defs>
                  <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="y" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={50} tickFormatter={v => `${(v/1000).toFixed(0)}B`} />
                <Tooltip content={<CustomTooltip />} />
                <Area dataKey="equity" name="Total Equity" stroke="#16a34a" fill="url(#eqGrad)" strokeWidth={2} dot={{ r: 3, fill: '#16a34a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── Data table: Item | TTM | 2025 | 2024 | 2023 | 2022 | 2021 ── */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', background: 'var(--navy-800)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
            {sheet === 'income' ? 'Income Statement' : 'Balance Sheet'} — Annual (PKR M)
          </p>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>All figures in PKR Millions unless stated</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
            <thead>
              <tr style={{ background: 'var(--navy-800)' }}>
                <th style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left', borderBottom: '2px solid var(--border-subtle)', minWidth: 180 }}>Item</th>
                {YEARS.map((y, i) => (
                  <th key={y} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: i === 0 ? 'var(--brand-gold)' : 'var(--text-muted)', textAlign: 'right', borderBottom: '2px solid var(--border-subtle)', minWidth: 90 }}>
                    {y}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={row.item} className="tr-hover" style={{ background: ri % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                  <td style={{ ...colStyle(0), fontWeight: 600, fontSize: 12 }}>{row.item}</td>
                  {row.vals.map((v, i) => (
                    <td key={i} style={{ ...colStyle(i + 1) }}>
                      {fmtVal(v, (row as any).isPct, (row as any).isRatio)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}


function RangeTrack({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ position: 'relative', height: 6, background: 'var(--navy-700)', borderRadius: 3, overflow: 'visible' }}>
      <div style={{
        position: 'absolute', left: 0, top: 0, height: '100%',
        width: `${pct}%`, borderRadius: 3,
        background: `linear-gradient(90deg, ${color}55, ${color})`,
      }} />
      <div style={{
        position: 'absolute', top: '50%', left: `${pct}%`,
        transform: 'translate(-50%, -50%)',
        width: 12, height: 12, borderRadius: '50%',
        background: color, border: '2px solid var(--navy-900)',
        boxShadow: `0 0 6px ${color}80`,
      }} />
    </div>
  )
}

const fundNorm = (v: number, min: number, max: number, invert = false) => {
  const p = Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100))
  return invert ? 100 - p : p
}
const fundGrade     = (p: number) => p >= 80 ? 'A+' : p >= 65 ? 'A' : p >= 50 ? 'B+' : p >= 40 ? 'B' : p >= 30 ? 'C' : 'D'
const fundGradeColor = (p: number) => p >= 80 ? '#16a34a' : p >= 65 ? '#22c55e' : p >= 50 ? '#d97706' : p >= 30 ? '#f97316' : '#dc2626'
const fundGradeBg    = (p: number) => p >= 80 ? '#dcfce7' : p >= 65 ? '#f0fdf4' : p >= 50 ? '#fef3c7' : p >= 30 ? '#fff7ed' : '#fef2f2'

function FundamentalsTab({ s }: { s: typeof UNIVERSE[string] }) {
  const r = seededRand(s.price * 77)

  const norm  = fundNorm
  const grade = fundGrade

  // ── Seeded metric values ──────────────────────────────────────────────────
  const pe           = +(4  + (s.price % 9) + r() * 3).toFixed(1)
  const pb           = +(0.9 + r() * 2.4).toFixed(2)
  const ps           = +(0.8 + r() * 1.8).toFixed(2)
  const evEbitda     = +(4  + r() * 6).toFixed(1)
  const divYield     = +(1.5 + r() * 7).toFixed(2)
  const roe          = +(10 + r() * 25).toFixed(1)
  const roa          = +(1  + r() * 4).toFixed(1)
  const netMarg      = +(8  + r() * 22).toFixed(1)
  const ebitdaMg     = +(20 + r() * 20).toFixed(1)
  const grossMg      = +(30 + r() * 25).toFixed(1)
  const debtEq       = +(0.2 + r() * 0.8).toFixed(2)
  const currRatio    = +(1.0 + r() * 0.8).toFixed(2)
  const quickRat     = +(+currRatio - 0.05 - r() * 0.1).toFixed(2)
  const intCov       = +(2 + r() * 6).toFixed(1)
  const bvps         = +(s.price * (0.5 + r() * 0.4)).toFixed(2)
  const revGrow      = +(5 + r() * 25).toFixed(1)
  const niGrow       = +(3 + r() * 30).toFixed(1)
  const epsGrow      = +(4 + r() * 28).toFixed(1)
  const assetGrow    = +(4 + r() * 18).toFixed(1)
  // additional
  const eps          = +(s.price / +pe * (0.85 + r() * 0.3)).toFixed(2)
  const opProfMarg   = +(+ebitdaMg - 2 - r() * 4).toFixed(2)
  const pbtMarg      = +(+netMarg + 1 + r() * 2).toFixed(2)
  const otherOpInc   = +(r() * 200).toFixed(0)
  const payoutRatio  = +(30 + r() * 55).toFixed(1)
  const dps          = +(s.price * +divYield / 100).toFixed(2)
  const divCover     = +(100 / +payoutRatio).toFixed(2)
  const retentionR   = +(100 - +payoutRatio).toFixed(1)
  const eqToAssets   = +(0.3 + r() * 0.4).toFixed(2)
  const eqMultiplier = +(1 / +eqToAssets).toFixed(2)
  const ltDebtEq     = +(+debtEq * (0.55 + r() * 0.35)).toFixed(2)
  const ltDebtAssets = +(+ltDebtEq * +eqToAssets).toFixed(3)
  const cashPerShr   = +(+bvps * (0.1 + r() * 0.25)).toFixed(2)
  const solvencyR    = +(+currRatio - 0.3 - r() * 0.4).toFixed(2)
  const liabToAssets = +(1 - +eqToAssets).toFixed(2)
  const totalAssetTO = +(0.4 + r() * 0.8).toFixed(2)
  const numShares    = +(500 + r() * 2000).toFixed(0)
  const salesPerShr  = +(s.price / +ps).toFixed(2)
  const roce         = +(+roe * (0.55 + r() * 0.35)).toFixed(2)
  const capEmployed  = +(s.price * +numShares / 1000).toFixed(2)
  const receivDays   = +(15 + r() * 45).toFixed(0)
  const inventDays   = +(50 + r() * 150).toFixed(0)
  const payabDays    = +(30 + r() * 60).toFixed(0)
  const wcDays       = +(+receivDays + +inventDays - +payabDays).toFixed(0)
  const workingCap   = +(s.price * (50 + r() * 200)).toFixed(0)
  const fixedAssetTO = +(0.8 + r() * 1.8).toFixed(2)
  const inventTO     = +(365 / +inventDays).toFixed(2)
  const ma50         = +(s.price * (0.92 + r() * 0.12)).toFixed(2)
  const ma200        = +(s.price * (0.88 + r() * 0.16)).toFixed(2)
  const idxWeight    = +(r() * 6).toFixed(2)

  // Category scores
  const catVal  = Math.round((norm(+pe, 4, 25, true) + norm(+pb, 0.5, 4, true) + norm(+ps, 0.5, 3.5, true) + norm(+evEbitda, 3, 12, true)) / 4)
  const catProf = Math.round((norm(+roe, 5, 35) + norm(+netMarg, 3, 35) + norm(+ebitdaMg, 10, 50) + norm(+grossMg, 20, 60)) / 4)
  const catGrow = Math.round((norm(+revGrow, 0, 35) + norm(+niGrow, 0, 40) + norm(+epsGrow, 0, 35) + norm(+assetGrow, 0, 25)) / 4)
  const catHlth = Math.round((norm(+currRatio, 0.5, 2.5) + norm(+debtEq, 0, 1.5, true) + norm(+intCov, 1, 10) + norm(+quickRat, 0.3, 2.0)) / 4)

  const categories = [
    { label: 'Valuation',    score: catVal,  desc: 'P/E · P/B · P/S · EV/EBITDA' },
    { label: 'Profitability',score: catProf, desc: 'ROE · Net Margin · EBITDA' },
    { label: 'Growth',       score: catGrow, desc: 'Revenue · Earnings · EPS' },
    { label: 'Health',       score: catHlth, desc: 'Debt · Liquidity · Coverage' },
  ]

  // Shorthand: generate stable sparkline seed from a metric value
  const sk = (v: number | string) => Math.abs(+v * s.price * 1.37)

  type MetricRow = { label: string; val: string; pct: number; weak: string; strong: string }
  type Section   = { title: string; items: MetricRow[] }

  const [modal, setModal] = useState<{ label: string; val: string; pct: number; seed: number } | null>(null)
  const [view,  setView]  = useState<'yearly' | 'quarterly'>('yearly')

  const genHistory = (currentVal: number, seed: number, yearly: boolean) => {
    let sv = ((seed * 1664525 + 1013904223) | 0) >>> 0
    const periods = yearly
      ? ['2021', '2022', '2023', '2024', '2025', '2026']
      : ['Q3\'24','Q4\'24','Q1\'25','Q2\'25','Q3\'25','Q4\'25','Q1\'26','Q2\'26']
    const vol = Math.max(Math.abs(currentVal) * 0.18, 0.5)
    const vals: number[] = [currentVal]
    for (let i = 1; i < periods.length; i++) {
      sv = ((sv * 1664525 + 1013904223) | 0) >>> 0
      vals.unshift(+(vals[0] + ((sv & 0xff) / 255 - 0.52) * vol * 2).toFixed(2))
    }
    return periods.map((p, i) => ({ period: p, value: vals[i] }))
  }

  // Helper: clamp 0-100, position on track
  const p52 = (v: number) => Math.round(norm(v, s.w52l, s.w52h))

  const sections: Section[] = [
    {
      title: 'Earnings',
      items: [
        { label: 'Earnings per Share',   val: `${eps}`,  pct: norm(+eps, -5, 20),          weak: 'Loss (<0)',      strong: 'Strong (20+)' },
        { label: 'Price Earnings Ratio', val: `${pe}×`,  pct: norm(+pe, 4, 25, true),      weak: 'Expensive (25×)',strong: 'Cheap (4×)'   },
      ],
    },
    {
      title: 'Important Ratios',
      items: [
        { label: 'Return on Capital Employed', val: `${roce}%`,       pct: norm(+roce, 5, 30),           weak: 'Low (5%)',        strong: 'High (30%)'   },
        { label: 'Number of Shares',           val: `${(+numShares/1000).toFixed(1)}M`, pct: 50,         weak: '—',              strong: '—'             },
        { label: 'Sales per Share',            val: `PKR ${salesPerShr}`, pct: 50,                       weak: '—',              strong: '—'             },
        { label: 'Market Price per Share',     val: `PKR ${s.price}`, pct: p52(s.price),                 weak: `52W Low ${s.w52l}`, strong: `52W High ${s.w52h}` },
        { label: 'Book Value per Share',       val: `PKR ${bvps}`,    pct: norm(+bvps, s.price*0.3, s.price*1.2), weak: 'Below market', strong: 'Above market' },
        { label: 'Price / Book Ratio',         val: `${pb}×`,         pct: norm(+pb, 0.5, 4, true),     weak: 'High (4×+)',      strong: 'Low (0.5×)'   },
        { label: 'Price to Sales Ratio',       val: `${ps}×`,         pct: norm(+ps, 0.5, 3.5, true),   weak: 'High (3.5×+)',    strong: 'Low (0.5×)'   },
        { label: 'Capital Employed',           val: `PKR ${capEmployed}M`, pct: 50,                     weak: '—',              strong: '—'             },
      ],
    },
    {
      title: 'Profitability',
      items: [
        { label: 'Gross Profit Margin',      val: `${grossMg}%`,   pct: norm(+grossMg, 20, 60),      weak: 'Low (20%)',    strong: 'High (60%)'   },
        { label: 'Operating Profit Margin',  val: `${opProfMarg}%`,pct: norm(+opProfMarg, -5, 35),   weak: 'Loss (<0%)',   strong: 'High (35%)'   },
        { label: 'Profit Before Tax Margin', val: `${pbtMarg}%`,   pct: norm(+pbtMarg, -5, 35),      weak: 'Loss (<0%)',   strong: 'High (35%)'   },
        { label: 'Net Profit Margin',        val: `${netMarg}%`,   pct: norm(+netMarg, 3, 35),       weak: 'Low (3%)',     strong: 'High (35%)'   },
        { label: 'Other Operating Income',   val: `PKR ${otherOpInc}M`, pct: norm(+otherOpInc, 0, 200), weak: 'None',     strong: 'High (200M+)' },
      ],
    },
    {
      title: 'Dividends',
      items: [
        { label: 'Dividend per Share', val: `PKR ${dps}`,      pct: norm(+dps, 0, 15),          weak: 'None',         strong: 'High (15+)'   },
        { label: 'Dividend Yield',     val: `${divYield}%`,    pct: norm(+divYield, 0, 10),      weak: 'None (0%)',    strong: 'High (10%)'   },
        { label: 'Dividend Cover',     val: `${divCover}x`,    pct: norm(+divCover, 0.5, 3),     weak: 'Uncovered (<1)', strong: 'Safe (3×)'  },
        { label: 'Payout Ratio',       val: `${payoutRatio}%`, pct: norm(+payoutRatio, 0, 100, true), weak: 'High (100%)', strong: 'Low (0%)' },
      ],
    },
    {
      title: 'Equity Ratios',
      items: [
        { label: 'Return on Equity',  val: `${roe}%`,         pct: norm(+roe, 5, 35),           weak: 'Weak (5%)',    strong: 'Strong (35%)' },
        { label: 'Return on Assets',  val: `${roa}%`,         pct: norm(+roa, 1, 5),            weak: 'Weak (1%)',   strong: 'Strong (5%)'  },
        { label: 'Retention Ratio',   val: `${retentionR}%`,  pct: norm(+retentionR, 20, 80),   weak: 'Low (20%)',   strong: 'High (80%)'   },
        { label: 'Equity Multiplier', val: `${eqMultiplier}×`,pct: norm(+eqMultiplier, 1, 5, true), weak: 'High (5×+)', strong: 'Low (1×)' },
        { label: 'Equity to Assets',  val: `${eqToAssets}`,   pct: norm(+eqToAssets, 0.2, 0.7), weak: 'Low (0.2)',  strong: 'High (0.7)'   },
      ],
    },
    {
      title: 'Debt',
      items: [
        { label: 'Long term Debt to Equity', val: `${ltDebtEq}`,    pct: norm(+ltDebtEq, 0, 1, true),    weak: 'High (1×+)',   strong: 'None (0)'    },
        { label: 'Long term Debt to Assets', val: `${ltDebtAssets}`, pct: norm(+ltDebtAssets, 0, 0.5, true), weak: 'High (0.5+)', strong: 'None (0)' },
      ],
    },
    {
      title: 'Cash',
      items: [
        { label: 'Cash per Share', val: `PKR ${cashPerShr}`, pct: norm(+cashPerShr, 0, s.price * 0.5), weak: 'None', strong: `High (${(s.price*0.5).toFixed(0)}+)` },
      ],
    },
    {
      title: 'Liquidity',
      items: [
        { label: 'Solvency Ratio', val: `${solvencyR}`,  pct: norm(+solvencyR, -0.5, 2),   weak: 'Insolvent (<0)', strong: 'Strong (2+)'  },
        { label: 'Current Ratio',  val: `${currRatio}×`, pct: norm(+currRatio, 0.5, 2.5),  weak: 'Tight (<0.5×)', strong: 'Strong (2.5×)' },
        { label: 'Quick Ratio',    val: `${quickRat}×`,  pct: norm(+quickRat, 0.3, 2.0),   weak: 'Tight (<0.3×)', strong: 'Strong (2.0×)' },
      ],
    },
    {
      title: 'Financial Health',
      items: [
        { label: 'Net Assets per Share',  val: `PKR ${bvps}`,      pct: norm(+bvps, s.price*0.3, s.price*1.2), weak: 'Below market', strong: 'Above market' },
        { label: 'Liabilities to Assets', val: `${liabToAssets}`,  pct: norm(+liabToAssets, 0.3, 0.8, true),   weak: 'High (0.8+)',  strong: 'Low (0.3)'   },
        { label: 'Interest Cover',        val: `${intCov}×`,       pct: norm(+intCov, 1, 10),                   weak: 'Risky (1×)',   strong: 'Safe (10×)'   },
        { label: 'Total Assets Turnover', val: `${totalAssetTO}×`, pct: norm(+totalAssetTO, 0.2, 1.5),          weak: 'Low (0.2)',    strong: 'High (1.5)'   },
      ],
    },
    {
      title: 'Efficiency',
      items: [
        { label: 'Working Capital',             val: `PKR ${(+workingCap/1000000).toFixed(2)}M`, pct: norm(+workingCap, 0, s.price*300), weak: 'Tight', strong: 'Strong' },
        { label: 'Receivable Days',             val: `${receivDays} days`,  pct: norm(+receivDays, 60, 10, true), weak: 'Slow (60d+)', strong: 'Fast (10d)'   },
        { label: 'Inventory Days',              val: `${inventDays} days`,  pct: norm(+inventDays, 200, 30, true),weak: 'Slow (200d+)', strong: 'Fast (30d)'  },
        { label: 'Payables Days',               val: `${payabDays} days`,   pct: norm(+payabDays, 15, 90),        weak: 'Short (15d)',  strong: 'Long (90d)'  },
        { label: 'Working Capital (Days)',       val: `${wcDays} days`,      pct: norm(+wcDays, 150, 20, true),    weak: 'Long (150d+)', strong: 'Short (20d)' },
        { label: 'Fixed Asset Turnover',        val: `${fixedAssetTO}×`,    pct: norm(+fixedAssetTO, 0.5, 3),     weak: 'Low (0.5)',    strong: 'High (3×)'   },
        { label: 'Inventory Turnover',          val: `${inventTO}×`,        pct: norm(+inventTO, 1, 8),           weak: 'Slow (1×)',    strong: 'Fast (8×)'   },
      ],
    },
    {
      title: 'Market Stats (PSX)',
      items: [
        { label: 'Prev Close (LDCP)', val: `PKR ${(s.price - s.change).toFixed(2)}`, pct: p52(s.price - s.change), weak: `52W Low ${s.w52l}`,  strong: `52W High ${s.w52h}`  },
        { label: 'Volume',             val: s.vol,                                    pct: 50,                       weak: '—',                  strong: '—'                    },
        { label: '52W High',           val: `PKR ${s.w52h}`,                          pct: 100,                      weak: '—',                  strong: '52W High'             },
        { label: '52W Low',            val: `PKR ${s.w52l}`,                          pct: 0,                        weak: '52W Low',            strong: '—'                    },
        { label: '50D MA',             val: `PKR ${ma50}`,                            pct: p52(+ma50),               weak: `52W Low ${s.w52l}`,  strong: `52W High ${s.w52h}`  },
        { label: '200D MA',            val: `PKR ${ma200}`,                           pct: p52(+ma200),              weak: `52W Low ${s.w52l}`,  strong: `52W High ${s.w52h}`  },
        { label: 'Idx Weight',         val: `${idxWeight}%`,                          pct: norm(+idxWeight, 0, 6),   weak: 'Low (0%)',           strong: 'High (6%)'            },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* ── Grade cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }} className="fund-grade-grid">
        {categories.map(cat => (
          <div key={cat.label} style={{
            borderRadius: 10, border: '1px solid var(--border-subtle)',
            background: 'var(--navy-900)', padding: '16px 14px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              width: 58, height: 58, borderRadius: '50%',
              background: fundGradeBg(cat.score),
              border: `2px solid ${fundGradeColor(cat.score)}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: fundGradeColor(cat.score) }}>{grade(cat.score)}</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 1 }}>{cat.label}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{cat.desc}</p>
            </div>
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>Score</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: fundGradeColor(cat.score) }}>{cat.score}/100</span>
              </div>
              <RangeTrack pct={cat.score} color={fundGradeColor(cat.score)} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Metric sections (2-column grid) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="fund-sections-grid">
      {sections.map(sec => (
        <div key={sec.title} style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
          <div style={{ padding: '10px 20px', background: 'var(--navy-800)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{sec.title}</span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{sec.items.length} metrics</span>
          </div>
          <div style={{ padding: '6px 0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, padding: '12px' }} className="fund-metric-cards">
              {sec.items.map(m => {
                const seed = sk(m.val)
                return (
                  <div key={m.label}
                    onClick={() => { setModal({ label: m.label, val: m.val, pct: m.pct, seed }); setView('yearly') }}
                    style={{
                      borderRadius: 8, border: '1px solid var(--border-subtle)',
                      background: 'var(--navy-950)', padding: '12px 14px',
                      display: 'flex', flexDirection: 'column', gap: 8,
                      cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = fundGradeColor(m.pct); (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 2px ${fundGradeColor(m.pct)}20` }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                  >
                    <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', lineHeight: 1.3 }}>{m.label}</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: fundGradeColor(m.pct), letterSpacing: '-0.03em', lineHeight: 1 }}>{m.val}</p>
                    <RangeTrack pct={m.pct} color={fundGradeColor(m.pct)} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 9, color: '#dc262660' }}>{m.weak}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: fundGradeColor(m.pct), background: `${fundGradeColor(m.pct)}15`, padding: '1px 7px', borderRadius: 10 }}>{grade(m.pct)}</span>
                      <span style={{ fontSize: 9, color: '#16a34a60' }}>{m.strong}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
      </div>{/* end fund-sections-grid */}

      {/* ── Metric history modal ── */}
      {modal && (() => {
        const data  = genHistory(parseFloat(modal.val.replace(/[^0-9.\-]/g, '')) || modal.pct, modal.seed, view === 'yearly')
        const color = fundGradeColor(modal.pct)
        const minV  = Math.min(...data.map(d => d.value))
        const maxV  = Math.max(...data.map(d => d.value))
        const isUp  = data[data.length - 1].value >= data[0].value
        return (
          <div
            onClick={() => setModal(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
          >
            <div onClick={e => e.stopPropagation()} style={{ background: 'var(--navy-900)', borderRadius: 14, border: '1px solid var(--border-subtle)', width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.18)' }}>
              {/* Header */}
              <div style={{ padding: '18px 22px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{modal.label}</p>
                    <p style={{ fontSize: 28, fontWeight: 900, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{modal.val}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <button onClick={() => setModal(null)} style={{ background: 'var(--navy-800)', border: '1px solid var(--border-subtle)', borderRadius: 6, width: 28, height: 28, cursor: 'pointer', fontSize: 14, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}15`, padding: '2px 10px', borderRadius: 10 }}>{grade(modal.pct)}</span>
                  </div>
                </div>
                {/* Yearly / Quarterly toggle */}
                <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
                  {(['yearly', 'quarterly'] as const).map(v => (
                    <button key={v} onClick={() => setView(v)} style={{
                      fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 6, cursor: 'pointer',
                      background: view === v ? color : 'var(--navy-800)',
                      color: view === v ? '#fff' : 'var(--text-muted)',
                      border: `1px solid ${view === v ? color : 'var(--border-subtle)'}`,
                      textTransform: 'capitalize',
                    }}>{v}</button>
                  ))}
                </div>
              </div>
              {/* Chart */}
              <div style={{ padding: '16px 8px 12px' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={data} margin={{ top: 8, right: 20, bottom: 0, left: 10 }}>
                    <defs>
                      <linearGradient id="mhGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                    <YAxis domain={[minV - Math.abs(minV)*0.08, maxV + Math.abs(maxV)*0.08]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={48} />
                    <Tooltip contentStyle={{ background: 'var(--navy-900)', border: '1px solid var(--border-subtle)', borderRadius: 8, fontSize: 12 }} formatter={(v: any) => [v, modal.label]} />
                    <Area dataKey="value" stroke={color} strokeWidth={2} fill="url(#mhGrad)" dot={{ r: 3, fill: color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {/* Mini stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', borderTop: '1px solid var(--border-subtle)', padding: '12px 22px' }}>
                {[
                  { label: view === 'yearly' ? '5Y High' : '8Q High', val: Math.max(...data.map(d => d.value)).toFixed(2) },
                  { label: view === 'yearly' ? '5Y Low'  : '8Q Low',  val: Math.min(...data.map(d => d.value)).toFixed(2) },
                  { label: 'Change', val: `${isUp ? '+' : ''}${(data[data.length-1].value - data[0].value).toFixed(2)}` },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 9, color: 'var(--text-muted)', marginBottom: 3 }}>{stat.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 800, color: stat.label === 'Change' ? (isUp ? '#16a34a' : '#dc2626') : 'var(--text-primary)' }}>{stat.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      })()}

    </div>
  )
}

function ShareholdersTab() {
  const data = [
    { name: 'Institutional (Foreign)', value: 22.4, color: '#3b82f6' },
    { name: 'Institutional (Local)',   value: 31.8, color: '#8b5cf6' },
    { name: 'Promoter / Sponsor',      value: 18.6, color: 'var(--brand-gold)' },
    { name: 'General Public',          value: 19.7, color: '#10b981' },
    { name: 'Government / NIT / ICP',  value: 7.5,  color: '#f59e0b' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        {/* Pie */}
        <div style={{ flex: '0 0 300px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>Ownership Breakdown</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={2}>
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend + breakdown */}
        <div style={{ flex: 1, minWidth: 240, borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: 16 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>Category Breakdown</p>
          {data.map(d => (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 10 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-primary)' }}>{d.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: d.color }}>{d.value}%</span>
                </div>
                <div style={{ height: 5, background: 'var(--navy-700)', borderRadius: 3 }}>
                  <div style={{ width: `${d.value}%`, height: '100%', background: d.color, borderRadius: 3 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top shareholders table */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', background: 'var(--navy-800)', borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Top Shareholders</p>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['#','Shareholder','Category','Shares','% Holding'].map((h, i) => (
                <th key={h} style={{ padding: '9px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: i <= 1 ? 'left' : 'right', background: 'var(--navy-900)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['1','Aga Khan Fund for Economic Dev.','Institutional (Foreign)','248.5M','18.60%'],
              ['2','National Bank of Pakistan','Government / NIT / ICP','82.3M','6.16%'],
              ['3','NIT Equity Market Opportunity Fund','Government / NIT / ICP','42.1M','3.15%'],
              ['4','Employees Provident Fund HBL','Promoter / Sponsor','36.8M','2.76%'],
              ['5','CDC — NSSF Pakistan','Government / NIT / ICP','28.4M','2.13%'],
            ].map(([n, sh, cat, shares, pct]) => (
              <tr key={n} className="tr-hover" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '9px 14px', fontSize: 11, color: 'var(--text-muted)' }}>{n}</td>
                <td style={{ padding: '9px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{sh}</td>
                <td style={{ padding: '9px 14px', fontSize: 11, color: 'var(--text-secondary)' }}>{cat}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>{shares}</td>
                <td style={{ padding: '9px 14px', textAlign: 'right', fontSize: 13, fontWeight: 700, color: 'var(--brand-gold)' }}>{pct}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NewsTab({ s }: { s: typeof UNIVERSE[string] }) {
  const items = [
    { date: 'Oct 15, 2026', title: `${s.symbol} posts record quarterly profit, beats estimates by 12%`, tag: 'Earnings', positive: true },
    { date: 'Oct 12, 2026', title: `${s.sector} sector outlook improves as SBP signals rate pause`, tag: 'Macro', positive: true },
    { date: 'Oct 10, 2026', title: `${s.symbol} announces PKR 4.00/share interim dividend for FY26`, tag: 'Dividend', positive: true },
    { date: 'Oct 8, 2026',  title: `${s.symbol} appoints new CFO as part of leadership restructuring`, tag: 'Corporate', positive: null },
    { date: 'Oct 5, 2026',  title: `Regulatory changes may impact ${s.sector} sector margins in Q2`, tag: 'Regulation', positive: false },
    { date: 'Oct 2, 2026',  title: `${s.symbol} AGM scheduled for November 20, 2026 in Karachi`, tag: 'Corporate', positive: null },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.map((n, i) => (
        <div key={i} style={{ padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', display: 'flex', gap: 14, alignItems: 'flex-start', cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--navy-800)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'var(--navy-900)'}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                background: n.positive === true ? 'rgba(22,163,74,0.1)' : n.positive === false ? 'rgba(220,38,38,0.1)' : 'rgba(148,163,184,0.1)',
                color: n.positive === true ? 'var(--green-gain)' : n.positive === false ? 'var(--red-loss)' : 'var(--text-muted)',
              }}>{n.tag}</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.date}</span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{n.title}</p>
          </div>
          <MdOpenInNew size={14} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
        </div>
      ))}
    </div>
  )
}

function AnnouncementsTab({ s }: { s: typeof UNIVERSE[string] }) {
  const items = [
    { date: 'Oct 10, 2026', type: 'Financial Results', subject: `${s.symbol} — Q1 FY27 Financial Results`, tag: 'Earnings' },
    { date: 'Oct 10, 2026', type: 'Dividend',          subject: `${s.symbol} — Interim Cash Dividend @ PKR 4.00/share`, tag: 'Dividend' },
    { date: 'Sep 28, 2026', type: 'Board Meeting',     subject: `${s.symbol} — Notice of Board Meeting (Oct 10, 2026)`, tag: 'Corporate' },
    { date: 'Sep 15, 2026', type: 'shareholding',      subject: `${s.symbol} — Change in Substantial Shareholding`, tag: 'Shareholding' },
    { date: 'Aug 28, 2026', type: 'Financial Results', subject: `${s.symbol} — Annual Results FY26`, tag: 'Earnings' },
    { date: 'Aug 20, 2026', type: 'Dividend',          subject: `${s.symbol} — Final Cash Dividend @ PKR 6.50/share for FY26`, tag: 'Dividend' },
    { date: 'Jul 12, 2026', type: 'AGM Notice',        subject: `${s.symbol} — Notice of 49th Annual General Meeting`, tag: 'AGM' },
  ]
  const tagColor: Record<string, string> = { Earnings: '#3b82f6', Dividend: '#16a34a', Corporate: 'var(--text-muted)', Shareholding: '#f59e0b', AGM: '#8b5cf6' }

  return (
    <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--navy-800)', borderBottom: '2px solid var(--border-subtle)' }}>
            {['Date','Type','Subject',''].map((h, i) => (
              <th key={i} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-muted)', textAlign: 'left' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((a, i) => (
            <tr key={i} className="tr-hover" style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }}>
              <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{a.date}</td>
              <td style={{ padding: '10px 14px' }}>
                <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4, color: tagColor[a.tag] ?? 'var(--text-muted)', background: 'var(--navy-800)', border: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
                  {a.type}
                </span>
              </td>
              <td style={{ padding: '10px 14px', fontSize: 12, color: 'var(--text-primary)' }}>{a.subject}</td>
              <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                <MdOpenInNew size={13} style={{ color: 'var(--text-muted)' }} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function CompanyReportTab({ s }: { s: typeof UNIVERSE[string] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* About */}
      <div style={{ padding: '20px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>About {s.company}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {s.company} is one of Pakistan's leading companies in the {s.sector} sector, listed on the Pakistan Stock Exchange (PSX) under the ticker symbol <strong>{s.symbol}</strong>.
          The company operates across multiple business segments, maintaining a strong presence in domestic markets while expanding its regional footprint.
          With a focus on operational efficiency, disciplined capital allocation, and strong governance, the company has delivered consistent earnings growth over the past five years.
        </p>
      </div>

      {/* Key info grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {[
          ['Founded', '1947'],
          ['Listed on PSX', '1974'],
          ['Registered Office', 'Karachi, Pakistan'],
          ['Sector', s.sector],
          ['Employees', '~12,500'],
          ['Auditor', 'KPMG Taseer Hadi & Co.'],
          ['Legal Advisor', 'Orr, Dignam & Co.'],
          ['Share Registrar', 'CDC Pakistan'],
        ].map(([k, v]) => (
          <div key={k} style={{ padding: '12px 14px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{k}</span>
            <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 700 }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Management */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', background: 'var(--navy-800)', borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: 12, fontWeight: 700 }}>Board & Management</p>
        </div>
        {[
          ['Chairman',  'Sir Mohammed Anwarудин Khan', 'Board'],
          ['President & CEO', 'Muhammad Aurangzeb', 'Management'],
          ['CFO', 'Rayomond Kotwal', 'Management'],
          ['Company Secretary', 'Noman Ahmed', 'Management'],
        ].map(([role, name, type], i, arr) => (
          <div key={role} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{role}</p>
            </div>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: type === 'Board' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)', color: type === 'Board' ? '#8b5cf6' : '#3b82f6', fontWeight: 700 }}>{type}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StockDetailPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = use(params)
  const [tab, setTab] = useState<Tab>('Overview')
  const [logoErr, setLogoErr] = useState(false)

  const s = UNIVERSE[symbol.toUpperCase()]

  if (!s) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Stock not found</p>
        <p style={{ fontSize: 13, marginBottom: 24 }}>"{symbol}" is not in our database.</p>
        <Link href="/dashboard/stocks" style={{ color: 'var(--brand-gold)', fontWeight: 600, fontSize: 13 }}>
          ← Back to Stocks
        </Link>
      </div>
    )
  }

  const up    = s.change >= 0
  const color = up ? 'var(--green-gain)' : 'var(--red-loss)'
  const bg    = SECTOR_COLOR[s.sector] ?? '334155'

  return (
    <div className="space-y-6">

      {/* ── Back link ── */}
      <Link href="/dashboard/stocks" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>
        <MdArrowBack size={15} /> Back to Stocks
      </Link>

      {/* ── Stock header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {logoErr
            ? <div style={{ width: 52, height: 52, borderRadius: 12, background: `#${bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                {s.symbol.slice(0, 2)}
              </div>
            : <Image src={logoUrl(s.company, s.sector)} alt={s.symbol} width={52} height={52} onError={() => setLogoErr(true)} style={{ borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} unoptimized />
          }
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>{s.symbol}</h1>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: 'var(--navy-800)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}>{s.sector}</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>{s.company}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 2 }}>
            PKR {s.price.toLocaleString('en-PK', { minimumFractionDigits: 2 })}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
            {up ? <MdTrendingUp size={16} style={{ color }} /> : <MdTrendingDown size={16} style={{ color }} />}
            <span style={{ fontSize: 14, fontWeight: 700, color }}>
              {up ? '+' : ''}{s.change.toFixed(2)} ({up ? '+' : ''}{s.pct.toFixed(2)}%)
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Today</span>
          </div>
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div style={{ borderBottom: '2px solid var(--border-subtle)', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="tab-bar stock-tab-bar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            display: 'inline-block', padding: '10px 16px', fontSize: 13, fontWeight: tab === t ? 700 : 500,
            cursor: 'pointer', border: 'none', background: 'none',
            color: tab === t ? 'var(--brand-gold)' : 'var(--text-muted)',
            borderBottom: `2px solid ${tab === t ? 'var(--brand-gold)' : 'transparent'}`,
            marginBottom: -2, transition: 'all 0.15s', whiteSpace: 'nowrap',
          }}>{t}</button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div>
        {tab === 'Overview'        && <OverviewTab s={s} />}
        {tab === 'Charts'          && <ChartsTab s={s} />}
        {tab === 'Sector Peers'    && <SectorPeersTab s={s} />}
        {tab === 'Compare Sector'  && <CompareSectorTab s={s} onTabChange={setTab} />}
        {tab === 'Financials'      && <FinancialsTab s={s} />}
        {tab === 'Fundamentals'    && <FundamentalsTab s={s} />}
        {tab === 'Shareholders'    && <ShareholdersTab />}
        {tab === 'News'            && <NewsTab s={s} />}
        {tab === 'Announcements'   && <AnnouncementsTab s={s} />}
        {tab === 'Company Report'  && <CompanyReportTab s={s} />}
      </div>

    </div>
  )
}
