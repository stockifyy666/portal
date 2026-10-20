'use client'

import { useState, useMemo } from 'react'
import { MdCalendarToday, MdAccessTime, MdArrowForwardIos, MdSearch, MdShowChart, MdBarChart, MdAccountBalance, MdTrendingUp, MdTrendingDown } from 'react-icons/md'

type TabKey = 'all' | 'research' | 'technical' | 'fundamentals'

interface Report {
  id: number
  tab: Exclude<TabKey, 'all'>
  title: string
  summary: string
  analyst: string
  firm: string
  date: string
  readTime: number
  tags: string[]
  featured: boolean
}

const REPORTS: Report[] = [
  { id: 1,  tab: 'research',     featured: true,  title: 'Pakistan Banking Sector "” Resilience Amid Rate Cycle Turn',          summary: 'A comprehensive look at Pakistan\'s Big-5 banks heading into the monetary easing cycle. NIM compression of 80"“120bps offset by loan book growth and improved asset quality. Top pick: MEBL.',  analyst: 'Saad Hashmi',    firm: 'AKD Securities',        date: 'Oct 10, 2026', readTime: 12, tags: ['Banking', 'NIM', 'Rate Cycle'] },
  { id: 2,  tab: 'technical',    featured: true,  title: 'KSE-100 Weekly Technical Outlook "” Bull Flag Breakout in Progress',  summary: 'The KSE-100 index has broken above 165,000 resistance on strong volumes, confirming a bull flag continuation pattern. Immediate target: 168,500. Key support at 161,200.',                   analyst: 'Kamran Siddiqui', firm: 'Pak Kuwait Investment', date: 'Oct 13, 2026', readTime: 5,  tags: ['KSE-100', 'RSI', 'Support & Resistance'] },
  { id: 3,  tab: 'fundamentals', featured: true,  title: 'Meezan Bank FY26 Annual Results "” Record Earnings, Strong Capital',  summary: 'MEBL posted FY26 net profit of PKR 72.3 billion, up 22% YoY, driven by higher NRPU and deposit growth. ROE stands at 31.4%. Book value per share grew to PKR 98.',                          analyst: 'Sana Baig',       firm: 'BMA Capital',           date: 'Oct 12, 2026', readTime: 11, tags: ['MEBL', 'Earnings', 'DCF'] },
  { id: 4,  tab: 'research',     featured: false, title: 'Cement Sector Mid-Year Review "” Margins Under Pressure',             summary: 'Elevated coal and energy costs continue to squeeze margins. LUCK and MLCF remain top picks given export exposure and cost efficiency. Maintain HOLD on DGKC.',                            analyst: 'Bilal Tariq',     firm: 'JS Global',             date: 'Oct 5, 2026',  readTime: 8,  tags: ['Cement', 'Dispatches', 'FY26'] },
  { id: 5,  tab: 'research',     featured: false, title: 'Oil & Gas Sector "” Production Growth Offsets Price Headwinds',       summary: 'New field additions by OGDC and PPL expected to drive 6"“8% output growth in FY27. Circular debt exposure and lower international oil prices cap upside.',                             analyst: 'Zara Malik',      firm: 'Arif Habib Ltd',        date: 'Oct 2, 2026',  readTime: 10, tags: ['Energy', 'RLNG', 'Circular Debt'] },
  { id: 6,  tab: 'research',     featured: false, title: 'IT Sector "” Export Story Remains Intact Despite Global Slowdown',    summary: 'Pakistan\'s listed IT companies continue to win large multi-year contracts. Systems Limited and TRG lead our coverage. Initiating NetSol with BUY and TP PKR 185.',                  analyst: 'Omar Faruqi',     firm: 'Tresmark',              date: 'Sep 28, 2026', readTime: 9,  tags: ['IT Export', 'SYS', 'TRG'] },
  { id: 7,  tab: 'technical',    featured: false, title: 'OGDC "” Golden Cross Signals Medium-Term Uptrend',                    summary: 'OGDC\'s 50-day MA crossed above 200-day MA for the first time since March 2024. RSI at 58 leaves room for further upside. Target PKR 175, stop-loss PKR 154.',                      analyst: 'Hina Raza',       firm: 'IGI Securities',        date: 'Oct 11, 2026', readTime: 6,  tags: ['OGDC', 'Golden Cross', 'Moving Average'] },
  { id: 8,  tab: 'technical',    featured: false, title: 'HBL "” Consolidation Near Support; Watch for Bounce',                 summary: 'HBL consolidating in a tight range between PKR 182"“192. A bounce from the 182 support with volume confirmation would target PKR 205. MACD turning positive on daily.',           analyst: 'Kamran Siddiqui', firm: 'Pak Kuwait Investment', date: 'Oct 9, 2026',  readTime: 5,  tags: ['HBL', 'Support', 'MACD'] },
  { id: 9,  tab: 'technical',    featured: false, title: 'Lucky Cement "” Ascending Triangle Points to Breakout',              summary: 'LUCK has been forming a textbook ascending triangle over the past 6 weeks. Close above PKR 925 on volume > 500K confirms breakout. Measured target: PKR 1,010.',                  analyst: 'Adeela Qureshi',  firm: 'Foundation Securities', date: 'Oct 7, 2026',  readTime: 5,  tags: ['LUCK', 'Chart Pattern', 'Breakout'] },
  { id: 10, tab: 'fundamentals', featured: false, title: 'Pakistan Macro Fundamentals "” Stabilisation Phase Underway',         summary: 'IMF EFF on track, forex reserves at $9.8B, CPI easing toward 10%. Pakistan\'s macro fundamentals are in the best shape since 2022. Upgrade market view to Overweight.',              analyst: 'Research Team',   firm: 'AKD Securities',        date: 'Oct 6, 2026',  readTime: 14, tags: ['Macro', 'IMF', 'Forex Reserves'] },
  { id: 11, tab: 'fundamentals', featured: false, title: 'ENGRO Corp "” Sum-of-the-Parts Valuation "” Fair Value PKR 380',      summary: 'Our SOTP model values ENGRO\'s fertilizer, polymer, telecom and food businesses to arrive at a consolidated fair value of PKR 380/share, implying 24% upside.',                      analyst: 'Fatima Naqvi',    firm: 'Topline Securities',    date: 'Oct 1, 2026',  readTime: 10, tags: ['ENGRO', 'SOTP', 'Valuation'] },
  { id: 12, tab: 'fundamentals', featured: false, title: 'PSO "” Circular Debt Risk vs Dividend Yield: A Balancing Act',       summary: 'PSO trades at 14% dividend yield but carries Rs 320B in circular debt receivables. Base-case fair value PKR 395 after modelling three recovery scenarios.',                        analyst: 'Zara Malik',      firm: 'Arif Habib Ltd',        date: 'Sep 25, 2026', readTime: 8,  tags: ['PSO', 'Dividend', 'Circular Debt'] },
]

const SECTIONS: { key: Exclude<TabKey,'all'>; label: string; desc: string; color: string; icon: React.ReactNode }[] = [
  { key: 'research',     label: 'Research',     desc: 'Macro, sector & industry analysis',      color: '#3b82f6', icon: <MdShowChart size={13} /> },
  { key: 'technical',    label: 'Technical',    desc: 'Charts, patterns & price action',        color: '#10b981', icon: <MdBarChart size={13} /> },
  { key: 'fundamentals', label: 'Fundamentals', desc: 'Earnings, valuations & company models',  color: '#8b5cf6', icon: <MdAccountBalance size={13} /> },
]

const MARKET_SNAPSHOT = [
  { index: 'KSE-100', value: '166,315', change: '+897.8',  pct: '+0.54%', up: true },
  { index: 'KSE-30',  value: '49,312',  change: '+273.9',  pct: '+0.56%', up: true },
  { index: 'KMI-30',  value: '240,099', change: '+1,301',  pct: '+0.54%', up: true },
  { index: 'ALLSHR',  value: '114,882', change: '+612.4',  pct: '+0.54%', up: true },
]

const RECENT_ACTIVITY = [
  { symbol: 'MEBL',  action: 'New Report',    label: 'Fundamentals', color: '#8b5cf6' },
  { symbol: 'OGDC',  action: 'Technical',     label: 'Technical',    color: '#10b981' },
  { symbol: 'LUCK',  action: 'Sector Update', label: 'Research',     color: '#3b82f6' },
  { symbol: 'HBL',   action: 'Chart Pattern', label: 'Technical',    color: '#10b981' },
  { symbol: 'ENGRO', action: 'SOTP Model',    label: 'Fundamentals', color: '#8b5cf6' },
]

function ReportCard({ r, showFeaturedBadge }: { r: Report; showFeaturedBadge?: boolean }) {
  const sec = SECTIONS.find(s => s.key === r.tab)!
  return (
    <div className="card-hover" style={{
      borderRadius: 8, border: '1px solid var(--border-subtle)',
      background: 'var(--navy-900)', padding: '12px 16px',
      cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 7,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: sec.color, border: `1.5px solid ${sec.color}`, borderRadius: 6, padding: '2px 8px' }}>{sec.label}</span>
          {showFeaturedBadge && <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--brand-gold)', borderRadius: 6, padding: '2px 8px' }}>Featured</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><MdCalendarToday size={11} /> {r.date}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><MdAccessTime size={11} /> {r.readTime} min</span>
        </div>
      </div>
      <h3 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.4, color: 'var(--text-primary)', margin: 0 }}>{r.title}</h3>
      <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.summary}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {r.tags.map(t => <span key={t} style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500 }}>{t}</span>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: 'var(--brand-gold)', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
          Read Report <MdArrowForwardIos size={11} />
        </div>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Market Snapshot */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Market Snapshot</span>
        </div>
        <div>
          {MARKET_SNAPSHOT.map((m, i) => (
            <div key={m.index} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 14px', borderBottom: i < MARKET_SNAPSHOT.length - 1 ? '1px solid var(--border-subtle)' : undefined,
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{m.index}</span>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{m.value}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: m.up ? '#16A34A' : '#DC2626', display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                  {m.up ? <MdTrendingUp size={12} /> : <MdTrendingDown size={12} />}
                  {m.pct}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Coverage */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Recent Coverage</span>
        </div>
        <div>
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="tr-hover" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 14px', borderBottom: i < RECENT_ACTIVITY.length - 1 ? '1px solid var(--border-subtle)' : undefined,
              cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: a.color }}>{a.symbol.slice(0,2)}</span>
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{a.symbol}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{a.action}</div>
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: a.color, border: `1px solid ${a.color}`, borderRadius: 4, padding: '1px 6px' }}>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analyst note */}
      <div style={{ borderRadius: 8, border: '1px solid rgba(217,119,6,0.25)', background: 'rgba(217,119,6,0.05)', padding: '12px 14px' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--brand-gold)', marginBottom: 6 }}>ANALYST NOTE</div>
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          KSE-100 holds above 165,000 as rate-cut expectations firm up. Banking and cement sectors outperforming. Watch MSCI rebalancing on Oct 28.
        </p>
      </div>

    </aside>
  )
}

export default function ReportsPage() {
  const [tab,    setTab]    = useState<TabKey>('all')
  const [search, setSearch] = useState('')

  const counts = useMemo(() => ({
    all:          REPORTS.length,
    research:     REPORTS.filter(r => r.tab === 'research').length,
    technical:    REPORTS.filter(r => r.tab === 'technical').length,
    fundamentals: REPORTS.filter(r => r.tab === 'fundamentals').length,
  }), [])

  const featured = useMemo(() => REPORTS.filter(r => r.featured), [])

  const filtered = useMemo(() => {
    let list = tab === 'all' ? REPORTS : REPORTS.filter(r => r.tab === tab)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(r =>
        r.title.toLowerCase().includes(q) ||
        r.tags.some(t => t.toLowerCase().includes(q)) ||
        r.firm.toLowerCase().includes(q)
      )
    }
    return list
  }, [tab, search])

  const TABS: { key: TabKey; label: string }[] = [
    { key: 'all',          label: 'All Reports' },
    { key: 'research',     label: 'Research' },
    { key: 'technical',    label: 'Technical Analysis' },
    { key: 'fundamentals', label: 'Fundamental' },
  ]

  const sectionsToShow = tab === 'all' ? SECTIONS : SECTIONS.filter(s => s.key === tab)

  return (
    <div>
      {/* Title + search */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>Stockifyy Reports</h1>
        <div className="reports-search-wrap" style={{ position: 'relative' }}>
          <MdSearch size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search reports…"
            style={{
              width: '100%', paddingLeft: 32, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
              borderRadius: 8, border: '1px solid var(--border-subtle)',
              background: 'var(--navy-900)', color: 'var(--text-primary)',
              fontSize: 13, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Underline tab bar */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20 }}>
        {TABS.map(t => {
          const active = tab === t.key
          const sec    = SECTIONS.find(s => s.key === t.key)
          const color  = sec?.color ?? 'var(--brand-gold)'
          return (
            <button key={t.key} onClick={() => { setTab(t.key); setSearch('') }} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '8px 16px', fontSize: 13, fontWeight: active ? 700 : 500,
              cursor: 'pointer', border: 'none', background: 'none',
              color: active ? 'var(--brand-gold)' : 'var(--text-muted)',
              borderBottom: `2px solid ${active ? 'var(--brand-gold)' : 'transparent'}`,
              marginBottom: -2, transition: 'all 0.15s',
            }}>
              {t.label}
            </button>
          )
        })}
      </div>


      {/* 2-col layout: main + sidebar */}
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Featured */}
          {tab === 'all' && !search && (
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Featured</span>
                <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }} className="reports-featured">
                {featured.map(r => <ReportCard key={r.id} r={r} showFeaturedBadge />)}
              </div>
            </section>
          )}

          {/* Sections */}
          {search ? (
            <section>
              {filtered.length === 0
                ? <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>No reports found.</div>
                : <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }} className="reports-featured">
                    {filtered.map(r => <ReportCard key={r.id} r={r} />)}
                  </div>
              }
            </section>
          ) : (
            sectionsToShow.map(sec => {
              const sectionReports = filtered.filter(r => r.tab === sec.key && (tab !== 'all' || !r.featured))
              if (sectionReports.length === 0) return null
              return (
                <section key={sec.key}>
                  {tab === 'all' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: sec.color, textTransform: 'uppercase' }}>{sec.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{sec.desc}</span>
                      <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }} className="reports-featured">
                    {sectionReports.map(r => <ReportCard key={r.id} r={r} />)}
                  </div>
                </section>
              )
            })
          )}
        </div>

      </div>
    </div>
  )
}

