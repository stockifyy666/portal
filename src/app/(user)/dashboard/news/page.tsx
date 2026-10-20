'use client'

import { useState, useMemo } from 'react'
import { MdSearch, MdAccessTime, MdTrendingUp, MdBookmark, MdBookmarkBorder, MdPublic, MdBarChart } from 'react-icons/md'

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Tab = 'psx' | 'global'

const NEWS = [
  // â”€â”€ PSX / Pakistan market â”€â”€
  {
    id: 1,
    tab: 'psx' as Tab,
    headline: 'KSE-100 surges 543 points as inflation data beats expectations',
    summary: 'The benchmark KSE-100 index closed higher on Monday after Pakistan\'s National CPI reading came in lower than analyst forecasts, signalling continued easing of inflationary pressures and boosting investor sentiment across banking and cement sectors.',
    source: 'Business Recorder',
    time: '2h ago',
    category: 'Market',
    tags: ['KSE-100', 'Inflation', 'CPI'],
    featured: true,
    impact: 'positive',
  },
  {
    id: 2,
    tab: 'psx' as Tab,
    headline: 'SBP holds policy rate at 17.50% amid global uncertainty',
    summary: 'The Monetary Policy Committee kept the benchmark interest rate unchanged at 17.50%, citing external account pressures and global commodity price volatility. Analysts expect a 50bps cut in the next MPC meeting in November.',
    source: 'Dawn Business',
    time: '4h ago',
    category: 'Banking',
    tags: ['SBP', 'Policy Rate', 'MPC'],
    featured: true,
    impact: 'neutral',
  },
  {
    id: 3,
    tab: 'psx' as Tab,
    headline: 'IMF tranche of $1.3B approved following sixth review',
    summary: 'The International Monetary Fund board approved the sixth review of Pakistan\'s Extended Fund Facility, releasing a $1.3 billion tranche. Total EFF drawings now stand at $5.7 billion out of the $7 billion program.',
    source: 'The News International',
    time: '6h ago',
    category: 'Economy',
    tags: ['IMF', 'EFF', 'Tranche'],
    featured: true,
    impact: 'positive',
  },
  {
    id: 4,
    tab: 'psx' as Tab,
    headline: 'Pakistan forex reserves climb to $9.8B as remittances hit record high',
    summary: 'State Bank of Pakistan\'s liquid foreign exchange reserves rose to $9.8 billion, supported by record remittance inflows of $3.1 billion in September "” a 12.4% year-on-year increase.',
    source: 'Express Tribune',
    time: '8h ago',
    category: 'Economy',
    tags: ['Forex Reserves', 'Remittances', 'SBP'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 5,
    tab: 'psx' as Tab,
    headline: 'Engro Fertilizers posts 18% jump in quarterly profit on improved offtake',
    summary: 'Engro Fertilizers Limited reported a net profit of PKR 8.4 billion for Q3 FY26, up 18% year-on-year, driven by improved urea offtake and stable gas prices. The board declared an interim dividend of PKR 4.00 per share.',
    source: 'Business Recorder',
    time: '10h ago',
    category: 'Corporate',
    tags: ['EFERT', 'Earnings', 'Dividend'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 6,
    tab: 'psx' as Tab,
    headline: 'Systems Limited wins $22M contract for digital transformation project',
    summary: 'Systems Limited announced a $22 million multi-year contract with a major European financial institution for core banking modernisation, contributing significantly to FY27 revenues.',
    source: 'Tech Desk Pakistan',
    time: '1d ago',
    category: 'Corporate',
    tags: ['SYS', 'IT Export', 'Contract'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 7,
    tab: 'psx' as Tab,
    headline: 'Meezan Bank total deposits cross PKR 2 trillion milestone',
    summary: 'Meezan Bank Limited, Pakistan\'s largest Islamic bank, announced that its total deposits surpassed PKR 2 trillion for the first time, driven by strong growth in current and savings accounts across all regions.',
    source: 'ARY News Business',
    time: '2d ago',
    category: 'Banking',
    tags: ['MEBL', 'Islamic Banking', 'Deposits'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 8,
    tab: 'psx' as Tab,
    headline: 'K-Electric posts operating loss as circular debt reaches Rs 680B',
    summary: 'K-Electric Limited reported an operating loss for the quarter as circular debt in the power sector climbed to Rs 680 billion. The company called on the government to expedite fuel price adjustments.',
    source: 'The News International',
    time: '3d ago',
    category: 'Energy',
    tags: ['KEL', 'Circular Debt', 'Power'],
    featured: false,
    impact: 'negative',
  },
  {
    id: 9,
    tab: 'psx' as Tab,
    headline: 'OGDC quarterly output rises 4% as new Sindh field comes online',
    summary: 'Oil and Gas Development Company reported a 4% quarter-on-quarter increase in hydrocarbon production after its new Sindh gas field was commissioned ahead of schedule.',
    source: 'Energy Update',
    time: '3d ago',
    category: 'Energy',
    tags: ['OGDC', 'Production', 'Gas'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 10,
    tab: 'psx' as Tab,
    headline: 'Pakistan rupee stabilises near 278 as dollar inflows improve',
    summary: 'The Pakistani rupee held steady around 278 against the US dollar in the interbank market, supported by improved dollar inflows from exports and remittances.',
    source: 'Express Tribune',
    time: '3d ago',
    category: 'Market',
    tags: ['PKR', 'USD', 'Rupee'],
    featured: false,
    impact: 'neutral',
  },

  // â”€â”€ Global â”€â”€
  {
    id: 11,
    tab: 'global' as Tab,
    headline: 'Fed holds rates steady; signals one cut possible before year-end',
    summary: 'The Federal Reserve kept its benchmark rate in the 5.25%"“5.50% range at its October meeting, leaving the door open to a single 25 basis-point reduction in December if inflation data continues to cool.',
    source: 'Reuters',
    time: '1h ago',
    category: 'Central Banks',
    tags: ['Fed', 'Interest Rates', 'USD'],
    featured: true,
    impact: 'neutral',
  },
  {
    id: 12,
    tab: 'global' as Tab,
    headline: 'Brent crude edges above $87 on Middle East supply concerns',
    summary: 'Brent crude oil prices rose above $87 per barrel as geopolitical tensions in the Middle East raised concerns about supply disruptions. OPEC+ is monitoring the situation ahead of its next output review.',
    source: 'Bloomberg',
    time: '3h ago',
    category: 'Commodities',
    tags: ['Brent', 'OPEC+', 'Oil'],
    featured: true,
    impact: 'negative',
  },
  {
    id: 13,
    tab: 'global' as Tab,
    headline: 'China GDP grows 4.8% in Q3, missing 5% annual target',
    summary: 'China\'s economy expanded 4.8% in the third quarter, below the government\'s 5% growth target. Weak domestic consumption and a sluggish property sector weighed on growth despite strong export performance.',
    source: 'Financial Times',
    time: '5h ago',
    category: 'Economy',
    tags: ['China', 'GDP', 'Growth'],
    featured: true,
    impact: 'negative',
  },
  {
    id: 14,
    tab: 'global' as Tab,
    headline: 'Dollar index retreats from 11-month high after US CPI miss',
    summary: 'The US Dollar Index fell 0.4% after US consumer price inflation came in below expectations at 3.1% year-on-year in September, reducing bets on another Fed rate hike and boosting emerging market currencies.',
    source: 'Reuters',
    time: '7h ago',
    category: 'Forex',
    tags: ['DXY', 'CPI', 'Emerging Markets'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 15,
    tab: 'global' as Tab,
    headline: 'Gold surpasses $2,680 as safe-haven demand lifts metals',
    summary: 'Gold prices climbed past $2,680 per troy ounce, driven by geopolitical uncertainty and softer US Treasury yields. Silver and platinum also posted gains as investors rotated into safe-haven assets.',
    source: 'MarketWatch',
    time: '9h ago',
    category: 'Commodities',
    tags: ['Gold', 'Silver', 'Safe-Haven'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 16,
    tab: 'global' as Tab,
    headline: 'IMF cuts global growth forecast to 3.0% for 2026',
    summary: 'The IMF trimmed its 2026 global growth projection to 3.0% from 3.2%, citing tighter financial conditions, elevated debt levels in emerging markets, and persistent inflationary pressures in advanced economies.',
    source: 'IMF World Economic Outlook',
    time: '12h ago',
    category: 'Economy',
    tags: ['IMF', 'Global Growth', 'Forecast'],
    featured: false,
    impact: 'negative',
  },
  {
    id: 17,
    tab: 'global' as Tab,
    headline: 'MSCI Emerging Markets index gains 1.2% on China stimulus hopes',
    summary: 'Emerging market equities rallied with the MSCI EM index adding 1.2%, after reports that Chinese policymakers are considering additional fiscal stimulus measures to revive domestic consumption.',
    source: 'Bloomberg',
    time: '1d ago',
    category: 'Equities',
    tags: ['MSCI', 'Emerging Markets', 'China'],
    featured: false,
    impact: 'positive',
  },
  {
    id: 18,
    tab: 'global' as Tab,
    headline: 'ECB cuts rates by 25bps as Eurozone inflation nears target',
    summary: 'The European Central Bank lowered its deposit rate by 25 basis points to 3.25%, as headline inflation in the Eurozone fell to 2.2% in September, approaching the ECB\'s 2% target for the first time since 2021.',
    source: 'Financial Times',
    time: '2d ago',
    category: 'Central Banks',
    tags: ['ECB', 'Rate Cut', 'EUR'],
    featured: false,
    impact: 'positive',
  },
]

const IMPACT_COLOR = { positive: 'var(--green-gain)', negative: 'var(--red-loss)', neutral: 'var(--text-muted)' }
const IMPACT_BG    = { positive: 'rgba(22,163,74,0.08)', negative: 'rgba(220,38,38,0.08)', neutral: 'rgba(148,163,184,0.08)' }
const IMPACT_LABEL = { positive: '▲ Positive', negative: '▼ Negative', neutral: '— Neutral' }

const CATEGORY_GRADIENT: Record<string, string> = {
  Market:        'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
  Banking:       'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
  Economy:       'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
  Corporate:     'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
  Energy:        'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
  Forex:         'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)',
  Commodities:   'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
  Equities:      'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
  'Central Banks':'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
}

// â”€â”€â”€ Components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function FeaturedCard({ item, bookmarked, onBookmark }: { item: typeof NEWS[0]; bookmarked: boolean; onBookmark: () => void }) {
  const ic = item.impact as keyof typeof IMPACT_COLOR
  const gradient = CATEGORY_GRADIENT[item.category] ?? CATEGORY_GRADIENT['Market']
  return (
    <div className="card-hover news-featured-card" style={{
      borderRadius: 8, border: '1px solid var(--border-subtle)',
      background: 'var(--navy-900)', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      {/* Visual header "” dark gradient with category */}
      <div style={{
        background: gradient, padding: '22px 20px 18px',
        position: 'relative', minHeight: 100,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: 8,
        }}>{item.category}</span>
        <h3 style={{
          fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em',
          lineHeight: 1.4, color: 'var(--text-primary)', margin: 0,
        }}>{item.headline}</h3>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 18px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.65, flex: 1, margin: 0 }}>
          {item.summary}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: IMPACT_COLOR[ic],
              display: 'inline-block',
            }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{item.source}</span>
            <span style={{ color: 'var(--border-normal)', fontSize: 12 }}>Â·</span>
            <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}>
              <MdAccessTime size={11} /> {item.time}
            </span>
          </div>
          <button onClick={e => { e.stopPropagation(); onBookmark() }} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: bookmarked ? 'var(--brand-gold)' : 'var(--text-muted)',
            padding: 2, flexShrink: 0, transition: 'color 0.15s',
          }}>
            {bookmarked ? <MdBookmark size={17} /> : <MdBookmarkBorder size={17} />}
          </button>
        </div>
      </div>
    </div>
  )
}

function NewsRow({ item, bookmarked, onBookmark }: { item: typeof NEWS[0]; bookmarked: boolean; onBookmark: () => void }) {
  const ic = item.impact as keyof typeof IMPACT_COLOR
  return (
    <div className="card-hover" style={{
      borderRadius: 8, border: '1px solid var(--border-subtle)',
      background: 'var(--navy-900)', cursor: 'pointer',
      padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 14,
    }}>
      {/* Impact dot */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%',
        background: IMPACT_COLOR[ic], marginTop: 6, flexShrink: 0,
      }} />

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--brand-gold)' }}>
            {item.category}
          </span>
          <span style={{ color: 'var(--border-normal)', fontSize: 11 }}>Â·</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <MdAccessTime size={11} /> {item.time}
          </span>
          <span style={{ color: 'var(--border-normal)', fontSize: 11 }}>Â·</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>{item.source}</span>
        </div>

        {/* Headline */}
        <p style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.5, color: 'var(--text-primary)', margin: 0 }}>
          {item.headline}
        </p>
      </div>

      {/* Bookmark */}
      <button onClick={e => { e.stopPropagation(); onBookmark() }} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: bookmarked ? 'var(--brand-gold)' : 'var(--text-muted)',
        padding: 2, flexShrink: 0, transition: 'color 0.15s', marginTop: 2,
      }}>
        {bookmarked ? <MdBookmark size={16} /> : <MdBookmarkBorder size={16} />}
      </button>
    </div>
  )
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const TABS: { key: Tab; label: string }[] = [
  { key: 'psx',    label: 'PSX Market News' },
  { key: 'global', label: 'Global News'     },
]

export default function NewsPage() {
  const [tab,       setTab]       = useState<Tab>('psx')
  const [search,    setSearch]    = useState('')
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set())

  function toggleBookmark(id: number) {
    setBookmarks(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const filtered = useMemo(() => {
    let list = NEWS.filter(n => n.tab === tab)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(n =>
        n.headline.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [tab, search])

  const featured = filtered.filter(n => n.featured)
  const rest     = filtered.filter(n => !n.featured)

  return (
    <div className="space-y-8">

      {/* â”€â”€ Header â”€â”€ */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>News</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pakistan market and global financial coverage</p>
        </div>
        {bookmarks.size > 0 && (
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand-gold)', background: 'rgba(217,119,6,0.1)', border: '1px solid rgba(217,119,6,0.2)', borderRadius: 8, padding: '5px 12px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <MdBookmark size={13} /> {bookmarks.size} saved
          </span>
        )}
      </div>

      {/* â”€â”€ Tabs + Search â”€â”€ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 0, flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSearch('') }} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
              cursor: 'pointer', border: 'none', background: 'none', transition: 'all 0.15s',
              color: tab === t.key ? 'var(--brand-gold)' : 'var(--text-muted)',
              borderBottom: `2px solid ${tab === t.key ? 'var(--brand-gold)' : 'transparent'}`,
              marginBottom: -2,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="news-search-wrap">
          <MdSearch size={16} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search headlines, tags…"
            style={{
              width: '100%', paddingLeft: 34, paddingRight: 12, paddingTop: 8, paddingBottom: 8,
              borderRadius: 8, border: '1px solid var(--border-subtle)',
              background: 'var(--navy-900)', color: 'var(--text-primary)',
              fontSize: 13, outline: 'none',
            }}
          />
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          No news found.
        </div>
      )}

      {/* â”€â”€ Top Stories â”€â”€ */}
      {featured.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <MdTrendingUp size={16} style={{ color: 'var(--brand-gold)' }} />
            <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Top Stories</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }} className="news-featured">
            {featured.map(n => (
              <FeaturedCard key={n.id} item={n} bookmarked={bookmarks.has(n.id)} onBookmark={() => toggleBookmark(n.id)} />
            ))}
          </div>
        </section>
      )}

      {/* â”€â”€ Latest â”€â”€ */}
      {rest.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>Latest</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{rest.length} stories</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {rest.map(n => (
              <NewsRow key={n.id} item={n} bookmarked={bookmarks.has(n.id)} onBookmark={() => toggleBookmark(n.id)} />
            ))}
          </div>
        </section>
      )}

    </div>
  )
}

