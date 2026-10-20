export const instant = false

import MarketChart from '@/components/dashboard/MarketChart'
import MarketMovers from '@/components/dashboard/MarketMovers'


const MARKETS = [
  { label: 'KSE 100',       value: '165,320', pct: '+0.33%', pts: '+543.71', up: true  },
  { label: 'KSE 30',        value: '58,412',  pct: '+0.21%', pts: '+122.30', up: true  },
  { label: 'KMI 30',        value: '94,807',  pct: '-0.18%', pts: '-171.65', up: false },
  { label: 'KMI All Share',  value: '44,215', pct: '+0.09%', pts: '+39.80',  up: true  },
  { label: 'All Shares',    value: '51,630',  pct: '-0.04%', pts: '-20.65',  up: false },
]

const RISK_SCORE = 14 // -100 to +100

const GAINERS = [
  { symbol: 'BML',    name: 'Bank Makramah Ltd',          price: 58.69,  change: +10.01, volume: 4200000  },
  { symbol: 'THALL',  name: 'Thal Limited',               price: 520.90, change: +4.82,  volume: 1850000  },
  { symbol: 'TPLRF1', name: 'TPL REIT Fund I',            price: 8.90,   change: +4.21,  volume: 9400000  },
  { symbol: 'GADT',   name: 'Gadoon Textile Mills',       price: 289.95, change: +3.74,  volume: 2100000  },
  { symbol: 'CHCC',   name: 'Cherat Cement Company',      price: 267.49, change: +3.48,  volume: 3300000  },
  { symbol: 'MLCF',   name: 'Maple Leaf Cement',          price: 41.20,  change: +3.12,  volume: 8900000  },
  { symbol: 'HUBC',   name: 'Hub Power Company',          price: 138.75, change: +2.95,  volume: 5400000  },
  { symbol: 'PSO',    name: 'Pakistan State Oil',         price: 312.40, change: +2.74,  volume: 4100000  },
  { symbol: 'ENGRO',  name: 'Engro Corporation',          price: 284.60, change: +2.51,  volume: 5200000  },
  { symbol: 'LUCK',   name: 'Lucky Cement',               price: 710.00, change: +2.38,  volume: 900000   },
  { symbol: 'SYS',    name: 'Systems Limited',            price: 680.50, change: +2.19,  volume: 2100000  },
  { symbol: 'MEBL',   name: 'Meezan Bank',                price: 190.80, change: +1.97,  volume: 8400000  },
  { symbol: 'TRG',    name: 'TRG Pakistan',               price: 148.20, change: +1.82,  volume: 3700000  },
  { symbol: 'SEARL',  name: 'Searle Pakistan',            price: 105.70, change: +1.64,  volume: 1200000  },
  { symbol: 'ATRL',   name: 'Attock Refinery',            price: 258.40, change: +1.53,  volume: 780000   },
  { symbol: 'OGDC',   name: 'OGDC',                       price: 161.30, change: +1.41,  volume: 12100000 },
  { symbol: 'HBL',    name: 'Habib Bank Ltd',             price: 188.75, change: +1.26,  volume: 8400000  },
  { symbol: 'NESTLE', name: 'Nestlé Pakistan',            price: 6850.0, change: +1.18,  volume: 120000   },
  { symbol: 'PPL',    name: 'Pakistan Petroleum',         price: 133.50, change: +1.07,  volume: 6800000  },
  { symbol: 'MCB',    name: 'MCB Bank',                   price: 250.10, change: +0.94,  volume: 3200000  },
]

const LOSERS = [
  { symbol: 'JDWS',   name: 'JDW Sugar Mills',           price: 850.00, change: -5.82, volume: 1600000  },
  { symbol: 'AGP',    name: 'AGP Limited',               price: 156.01, change: -4.63, volume: 2200000  },
  { symbol: 'BNWM',   name: 'Bannu Woollen Mills',       price: 60.00,  change: -4.21, volume: 940000   },
  { symbol: 'AICL',   name: 'Adamjee Insurance',         price: 93.01,  change: -3.94, volume: 1800000  },
  { symbol: 'NCPL',   name: 'Nishat Chunian Power',      price: 48.58,  change: -3.67, volume: 3100000  },
  { symbol: 'FCCL',   name: 'Fauji Cement',              price: 22.30,  change: -3.44, volume: 7400000  },
  { symbol: 'PAEL',   name: 'Pak Elektron',              price: 35.90,  change: -3.18, volume: 5600000  },
  { symbol: 'HCAR',   name: 'Honda Atlas Cars',          price: 198.50, change: -2.97, volume: 1100000  },
  { symbol: 'UNITY',  name: 'Unity Foods',               price: 28.45,  change: -2.75, volume: 9800000  },
  { symbol: 'SRVI',   name: 'Service Industries',        price: 645.00, change: -2.54, volume: 480000   },
  { symbol: 'KEL',    name: 'K-Electric',                price: 8.40,   change: -2.41, volume: 42300000 },
  { symbol: 'DGKC',   name: 'DG Khan Cement',            price: 105.50, change: -2.28, volume: 3200000  },
  { symbol: 'HGFA',   name: 'Huffaz Seamless Pipe',      price: 32.10,  change: -2.14, volume: 1400000  },
  { symbol: 'ASTM',   name: 'Ansari Steel',              price: 18.75,  change: -1.96, volume: 2700000  },
  { symbol: 'NETSOL', name: 'NetSol Technologies',       price: 112.40, change: -1.81, volume: 820000   },
  { symbol: 'PIOC',   name: 'Pioneer Cement',            price: 88.60,  change: -1.67, volume: 4500000  },
  { symbol: 'PABC',   name: 'Pacific Insurance',         price: 14.20,  change: -1.52, volume: 1900000  },
  { symbol: 'MDTL',   name: 'Modart International',      price: 9.85,   change: -1.38, volume: 3600000  },
  { symbol: 'SIEM',   name: 'Siemens Pakistan',          price: 748.00, change: -1.24, volume: 340000   },
  { symbol: 'COLG',   name: 'Colgate-Palmolive',         price: 2840.0, change: -1.09, volume: 290000   },
]

const ACTIVE = [
  { symbol: 'KEL',    name: 'K-Electric Limited',              vol: '9.7M',  price: 5.90  },
  { symbol: 'PIBTL',  name: 'Pakistan Intl Bulk Terminal',     vol: '3.8M',  price: 13.85 },
  { symbol: 'CNERGY', name: 'Cnergyico PK Limited',            vol: '2.8M',  price: 12.27 },
  { symbol: 'PTC',    name: 'Pakistan Telecom Co. Ltd',        vol: '2.6M',  price: 51.60 },
  { symbol: 'BOP',    name: 'The Bank of Punjab',              vol: '1.9M',  price: 28.53 },
  { symbol: 'WTL',    name: 'World Call Telecom',              vol: '1.7M',  price: 1.82  },
  { symbol: 'PACE',   name: 'Pace (Pakistan) Limited',         vol: '1.5M',  price: 6.44  },
  { symbol: 'PAEL',   name: 'Pak Elektron Limited',            vol: '1.3M',  price: 35.90 },
  { symbol: 'FCCL',   name: 'Fauji Cement Company',           vol: '1.2M',  price: 22.30 },
  { symbol: 'HASCOL', name: 'Hascol Petroleum',               vol: '1.1M',  price: 18.75 },
]

function MarketCard({ label, value, pct, pts, up }: typeof MARKETS[0]) {
  const color = up ? 'var(--green-gain)' : 'var(--red-loss)'
  const bg    = up ? 'rgba(22,163,74,0.06)'  : 'rgba(220,38,38,0.06)'
  const border= up ? 'rgba(22,163,74,0.18)'  : 'rgba(220,38,38,0.18)'
  return (
    <div className="market-card" style={{ borderRadius: 8, background: bg, border: `1px solid ${border}`, padding: '12px 14px', minWidth: 0, cursor: 'pointer' }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color, marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color, lineHeight: 1, marginBottom: 6 }}>
        {value}
      </p>
      <p style={{ fontSize: 12, fontWeight: 600, color }}>
        {up ? '▲' : '▼'} {pct}{pts && <span style={{ fontWeight: 400, opacity: 0.7 }}> {pts}</span>}
      </p>
    </div>
  )
}

function RiskGauge({ score }: { score: number }) {
  const angle = (score / 100) * 90
  const label = score > 20 ? 'Risk-On' : score < -20 ? 'Risk-Off' : 'Mild Risk-On'
  return (
    <div style={{
      borderRadius: 8,
      background: 'var(--navy-900)',
      border: '1px solid var(--border-subtle)',
      padding: '16px 18px',
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
        Risk Sentiment
      </p>
      <p style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--green-gain)', marginBottom: 2, fontFamily: 'var(--font-display)' }}>
        {label}
      </p>
      <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 12 }}>
        Risk assets +0.3σ across 5, havens -0.1σ across 2.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg viewBox="0 0 180 100" width="180" height="100">
          <defs>
            <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#DC2626" />
              <stop offset="40%"  stopColor="#CA8A04" />
              <stop offset="70%"  stopColor="#65A30D" />
              <stop offset="100%" stopColor="#16A34A" />
            </linearGradient>
          </defs>
          <path d="M 12 92 A 78 78 0 0 1 168 92" fill="none" stroke="var(--border-normal)" strokeWidth="12" strokeLinecap="round" />
          <path d="M 12 92 A 78 78 0 0 1 168 92" fill="none" stroke="url(#riskGrad)" strokeWidth="12" strokeLinecap="round" />
          <g transform={`rotate(${angle}, 90, 92)`}>
            <line x1="90" y1="92" x2="90" y2="24" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="90" cy="92" r="5" fill="var(--text-primary)" />
          </g>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: 180, marginTop: -6 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Risk-Off</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>+{score} composite</span>
          <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Risk-On</span>
        </div>
      </div>
    </div>
  )
}


export default function UserDashboard() {
  return (
    <div className="space-y-8">

      {/* ── Today Across All Markets ── */}
      <section>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', fontFamily: 'var(--font-display)', marginBottom: 4 }}>
          Today Across All Markets
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
          Stocks, crypto, commodities and the rupee, with a live risk read.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8 }}
             className="market-cards">
          {MARKETS.map(m => <MarketCard key={m.label} {...m} />)}
        </div>
        <div style={{ marginTop: 16 }}>
          <MarketChart />
        </div>
      </section>

      {/* ── Market Movers ── */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Market Movers
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
          Top gainers, losers and most active stocks on PSX today.
        </p>

        <MarketMovers gainers={GAINERS} losers={LOSERS} />

        {/* Most Active — Table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-gold)', display: 'inline-block' }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Most Active</h2>
          </div>
          <div style={{
            background: 'var(--navy-900)', border: '1px solid var(--border-subtle)',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <div className="table-scroll">
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
                <thead>
                  <tr style={{ background: 'var(--navy-900)', borderBottom: '1px solid var(--border-subtle)' }}>
                    {['#', 'Symbol', 'Company', 'Price (PKR)', 'Volume'].map(h => (
                      <th key={h} style={{
                        padding: '7px 14px', fontSize: 11, fontWeight: 700,
                        color: 'var(--text-muted)', textAlign: h === '#' ? 'center' : h === 'Price (PKR)' || h === 'Volume' ? 'right' : 'left',
                        letterSpacing: '0.04em', textTransform: 'uppercase',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ACTIVE.map((s, i) => (
                    <tr key={s.symbol} className="tr-hover" style={{
                      borderBottom: i < ACTIVE.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}>
                      <td style={{ padding: '7px 14px', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', width: 36 }}>{i + 1}</td>
                      <td style={{ padding: '7px 14px', fontSize: 12, fontWeight: 700, color: 'var(--brand-gold)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{s.symbol}</td>
                      <td style={{ padding: '7px 14px', fontSize: 12, color: 'var(--text-secondary)' }}>{s.name}</td>
                      <td style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right', whiteSpace: 'nowrap' }}>{s.price.toFixed(2)}</td>
                      <td style={{ padding: '7px 14px', fontSize: 12, fontWeight: 600, color: 'var(--brand-gold)', textAlign: 'right', whiteSpace: 'nowrap' }}>{s.vol}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
