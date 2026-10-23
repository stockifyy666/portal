'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeatStock {
  symbol: string; name: string; sector: string
  pct: number; vol: number; mktCap: number
  kse100: boolean; kse30: boolean; kmi30: boolean; kmiAll: boolean
}

const INDICES = ['KSE-100', 'KSE-30', 'KMI-30', 'KMI All Share', 'All Share'] as const
type IdxKey = typeof INDICES[number]

function inIndex(s: HeatStock, idx: IdxKey): boolean {
  if (idx === 'All Share') return true
  if (idx === 'KSE-100') return s.kse100
  if (idx === 'KSE-30') return s.kse30
  if (idx === 'KMI-30') return s.kmi30
  if (idx === 'KMI All Share') return s.kmiAll
  return true
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STOCKS: HeatStock[] = [
  // Commercial Banks
  { symbol:'HBL',   name:'Habib Bank',          sector:'Commercial Banks',  pct:+1.26,  vol:21, mktCap:144, kse100:true,  kse30:true,  kmi30:false, kmiAll:false },
  { symbol:'MEBL',  name:'Meezan Bank',          sector:'Commercial Banks',  pct:+1.65,  vol:15, mktCap:176, kse100:true,  kse30:true,  kmi30:false, kmiAll:true  },
  { symbol:'MCB',   name:'MCB Bank',             sector:'Commercial Banks',  pct:+0.64,  vol:13, mktCap:105, kse100:true,  kse30:true,  kmi30:false, kmiAll:false },
  { symbol:'UBL',   name:'United Bank',          sector:'Commercial Banks',  pct:+0.98,  vol:10, mktCap:93,  kse100:true,  kse30:true,  kmi30:false, kmiAll:false },
  { symbol:'NBP',   name:'Nat. Bank Pakistan',   sector:'Commercial Banks',  pct:-0.42,  vol:11, mktCap:88,  kse100:true,  kse30:true,  kmi30:false, kmiAll:false },
  { symbol:'ABL',   name:'Allied Bank',          sector:'Commercial Banks',  pct:+0.31,  vol:8,  mktCap:74,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'BAFL',  name:'Bank Alfalah',         sector:'Commercial Banks',  pct:+0.36,  vol:32, mktCap:62,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'BAHL',  name:'Bank AL Habib',        sector:'Commercial Banks',  pct:-1.61,  vol:8,  mktCap:58,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'BOP',   name:'Bank of Punjab',       sector:'Commercial Banks',  pct:-1.61,  vol:19, mktCap:22,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'FABL',  name:'Faysal Bank',          sector:'Commercial Banks',  pct:+0.36,  vol:7,  mktCap:32,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'AKBL',  name:'Askari Bank',          sector:'Commercial Banks',  pct:+0.86,  vol:5,  mktCap:28,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'SNBL',  name:'Soneri Bank',          sector:'Commercial Banks',  pct:+0.81,  vol:4,  mktCap:15,  kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'SML',   name:'Silkbank',             sector:'Commercial Banks',  pct:+0.10,  vol:2,  mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Oil & Gas Exploration
  { symbol:'OGDC',  name:'OGDC',                 sector:'Oil & Gas Expl.',   pct:-0.61,  vol:24, mktCap:246, kse100:true,  kse30:true,  kmi30:true,  kmiAll:true  },
  { symbol:'PPL',   name:'Pakistan Petroleum',   sector:'Oil & Gas Expl.',   pct:-1.73,  vol:11, mktCap:114, kse100:true,  kse30:true,  kmi30:true,  kmiAll:true  },
  { symbol:'MARI',  name:'Mari Petroleum',       sector:'Oil & Gas Expl.',   pct:+0.74,  vol:5,  mktCap:48,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'POL',   name:'Pakistan Oilfields',   sector:'Oil & Gas Expl.',   pct:+0.35,  vol:4,  mktCap:42,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  // Oil & Gas Marketing
  { symbol:'PSO',   name:'Pak State Oil',        sector:'Oil & Gas Mktg.',   pct:-1.02,  vol:10, mktCap:118, kse100:true,  kse30:true,  kmi30:false, kmiAll:false },
  { symbol:'SSGC',  name:'Sui Southern Gas',     sector:'Oil & Gas Mktg.',   pct:-0.04,  vol:12, mktCap:35,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'SNGP',  name:'Sui Northern Gas',     sector:'Oil & Gas Mktg.',   pct:+0.18,  vol:9,  mktCap:28,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'APL',   name:'Attock Petroleum',     sector:'Oil & Gas Mktg.',   pct:+0.35,  vol:4,  mktCap:19,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  // Cement
  { symbol:'LUCK',  name:'Lucky Cement',         sector:'Cement',            pct:+1.88,  vol:8,  mktCap:63,  kse100:true,  kse30:true,  kmi30:true,  kmiAll:true  },
  { symbol:'MLCF',  name:'Maple Leaf Cement',    sector:'Cement',            pct:-1.76,  vol:28, mktCap:17,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'DGKC',  name:'DG Khan Cement',       sector:'Cement',            pct:+0.18,  vol:6,  mktCap:24,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'FCCL',  name:'Fauji Cement',         sector:'Cement',            pct:-0.14,  vol:14, mktCap:12,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'THCCL', name:'Thatta Cement',        sector:'Cement',            pct:+0.50,  vol:4,  mktCap:8,   kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'PIOC',  name:'Pioneer Cement',       sector:'Cement',            pct:-0.55,  vol:5,  mktCap:14,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'KGHC',  name:'Kohat Cement',         sector:'Cement',            pct:+0.22,  vol:5,  mktCap:10,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'CHCC',  name:'Cherat Cement',        sector:'Cement',            pct:-0.44,  vol:3,  mktCap:9,   kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'BWCL',  name:'Bestway Cement',       sector:'Cement',            pct:+0.30,  vol:4,  mktCap:11,  kse100:false, kse30:false, kmi30:true,  kmiAll:true  },
  // Power Generation
  { symbol:'HUBC',  name:'Hub Power',            sector:'Power Generation',  pct:-1.91,  vol:9,  mktCap:64,  kse100:true,  kse30:true,  kmi30:false, kmiAll:false },
  { symbol:'KOHE',  name:'Kot Addu Power',       sector:'Power Generation',  pct:+9.98,  vol:18, mktCap:42,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'KAPCO', name:'KAPCO',                sector:'Power Generation',  pct:+0.18,  vol:5,  mktCap:34,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'KEL',   name:'K-Electric',           sector:'Power Generation',  pct:-1.42,  vol:14, mktCap:28,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'NCPL',  name:'Nishat Chunian Power', sector:'Power Generation',  pct:-1.34,  vol:6,  mktCap:18,  kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'NPL',   name:'Nishat Power',         sector:'Power Generation',  pct:+0.10,  vol:4,  mktCap:12,  kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'TSPL',  name:'Triconboston',         sector:'Power Generation',  pct:+0.05,  vol:2,  mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Technology & Comm.
  { symbol:'SYS',   name:'Systems Limited',      sector:'Technology & Comm.',pct:+1.44,  vol:4,  mktCap:75,  kse100:true,  kse30:true,  kmi30:true,  kmiAll:true  },
  { symbol:'TRG',   name:'TRG Pakistan',         sector:'Technology & Comm.',pct:-1.35,  vol:5,  mktCap:44,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'WTL',   name:'WorldCall Telecom',    sector:'Technology & Comm.',pct:+0.00,  vol:22, mktCap:5,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'TPL',   name:'TPL Corp',             sector:'Technology & Comm.',pct:+2.73,  vol:14, mktCap:18,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'PTC',   name:'Pakistan Telecom',     sector:'Technology & Comm.',pct:-1.47,  vol:12, mktCap:55,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'HUMNL', name:'Hum Network',          sector:'Technology & Comm.',pct:-2.29,  vol:8,  mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'AIRLINK',name:'Airlink Comm.',       sector:'Technology & Comm.',pct:-0.88,  vol:6,  mktCap:22,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  // Refinery
  { symbol:'CNERGY',name:'Cnergyico PK',         sector:'Refinery',          pct:+0.41,  vol:28, mktCap:30,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'ATRL',  name:'Attock Refinery',      sector:'Refinery',          pct:+0.04,  vol:8,  mktCap:24,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'PRL',   name:'Pakistan Refinery',    sector:'Refinery',          pct:+1.15,  vol:12, mktCap:18,  kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Fertilizers
  { symbol:'ENGRO', name:'Engro Corp',           sector:'Fertilizers',       pct:-0.52,  vol:9,  mktCap:49,  kse100:true,  kse30:true,  kmi30:true,  kmiAll:true  },
  { symbol:'FFC',   name:'Fauji Fertilizer',     sector:'Fertilizers',       pct:-0.04,  vol:8,  mktCap:55,  kse100:true,  kse30:true,  kmi30:true,  kmiAll:true  },
  { symbol:'EFERT', name:'Engro Fertilizer',     sector:'Fertilizers',       pct:+0.89,  vol:7,  mktCap:38,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'FATIMA',name:'Fatima Fertilizer',    sector:'Fertilizers',       pct:-0.04,  vol:5,  mktCap:32,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'AHCL',  name:'Arif Habib Corp',      sector:'Fertilizers',       pct:-0.52,  vol:6,  mktCap:22,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  // Transport
  { symbol:'PIBTL', name:'Pak Int. Bulk Terminals',sector:'Transport',       pct:-2.02,  vol:14, mktCap:15,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  // Food & Personal Care
  { symbol:'NESTLE',name:'Nestle Pakistan',      sector:'Food & Personal Care',pct:+0.00,vol:2,  mktCap:161, kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'COLG',  name:'Colgate-Palmolive',    sector:'Food & Personal Care',pct:-0.52,vol:3,  mktCap:32,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'FFL',   name:'Fauji Foods',          sector:'Food & Personal Care',pct:-1.32,vol:8,  mktCap:12,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'NATF',  name:'National Foods',       sector:'Food & Personal Care',pct:-0.25,vol:4,  mktCap:22,  kse100:false, kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'UPFL',  name:'Unilever Pak Foods',   sector:'Food & Personal Care',pct:+0.22,vol:2,  mktCap:15,  kse100:false, kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'MUREB', name:'Murree Brewery',       sector:'Food & Personal Care',pct:-0.44,vol:3,  mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Pharmaceuticals
  { symbol:'SEARL', name:'Searle Pakistan',      sector:'Pharmaceuticals',   pct:-1.00,  vol:6,  mktCap:15,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'CPHL',  name:'Citi Pharma',          sector:'Pharmaceuticals',   pct:-2.25,  vol:8,  mktCap:10,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'AGP',   name:'AGP Limited',          sector:'Pharmaceuticals',   pct:-0.77,  vol:4,  mktCap:9,   kse100:false, kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'HINOON',name:'Highnoon Labs',         sector:'Pharmaceuticals',   pct:+0.44,  vol:3,  mktCap:11,  kse100:false, kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'GLAXO', name:'GSK Pakistan',         sector:'Pharmaceuticals',   pct:-0.50,  vol:2,  mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'ABOT',  name:'Abbott Pakistan',      sector:'Pharmaceuticals',   pct:-0.10,  vol:1,  mktCap:12,  kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Textile Composite
  { symbol:'NCL',   name:'Nishat Mills',         sector:'Textile Composite', pct:+1.88,  vol:8,  mktCap:42,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'NML',   name:'Nishat Mills (Pvt)',   sector:'Textile Composite', pct:-2.77,  vol:6,  mktCap:18,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'KTML',  name:'Kohinoor Textile',     sector:'Textile Composite', pct:+0.00,  vol:4,  mktCap:14,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'ILP',   name:'Indus Lyallpur',       sector:'Textile Composite', pct:-0.55,  vol:3,  mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  // Cable & Electrical
  { symbol:'PAEL',  name:'Pak Elektron',         sector:'Cable & Electrical',pct:-1.74,  vol:10, mktCap:22,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  // Insurance
  { symbol:'AICL',  name:'Adamjee Insurance',    sector:'Insurance',         pct:-2.70,  vol:8,  mktCap:19,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  // Automobiles
  { symbol:'INDU',  name:'Indus Motor',          sector:'Automobiles',       pct:+0.88,  vol:3,  mktCap:38,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'MTL',   name:'Millat Tractors',      sector:'Automobiles',       pct:-1.05,  vol:3,  mktCap:28,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'HCAR',  name:'Honda Atlas',          sector:'Automobiles',       pct:+0.44,  vol:4,  mktCap:22,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'SAZEW', name:'Sazgar Eng.',          sector:'Automobiles',       pct:-2.38,  vol:6,  mktCap:14,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'GAL',   name:'Ghandhara Auto',       sector:'Automobiles',       pct:-0.33,  vol:2,  mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'GHNI',  name:'Ghandhara Nissan',     sector:'Automobiles',       pct:+0.55,  vol:2,  mktCap:6,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  { symbol:'ATLH',  name:'Atlas Honda',          sector:'Automobiles',       pct:+0.20,  vol:2,  mktCap:15,  kse100:false, kse30:false, kmi30:true,  kmiAll:true  },
  // Chemical
  { symbol:'LOTCHEM',name:'Lotte Chemical',      sector:'Chemical',          pct:-2.72,  vol:12, mktCap:22,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'NRSL',  name:'Nimir Resins',         sector:'Chemical',          pct:+6.29,  vol:8,  mktCap:10,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'LCI',   name:'Lotte Chemical Ind.',  sector:'Chemical',          pct:-0.31,  vol:4,  mktCap:6,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Miscellaneous
  { symbol:'TISL',  name:'Thal Industries',      sector:'Miscellaneous',     pct:+0.21,  vol:8,  mktCap:25,  kse100:true,  kse30:false, kmi30:true,  kmiAll:true  },
  { symbol:'HADC',  name:'Hadi Containers',      sector:'Miscellaneous',     pct:+3.25,  vol:5,  mktCap:12,  kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // REIT
  { symbol:'TPLRFI',name:'TPL REIT Fund',        sector:'REIT',              pct:-0.92,  vol:6,  mktCap:15,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'DCR',   name:'Dolmen City REIT',     sector:'REIT',              pct:+0.00,  vol:4,  mktCap:18,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  // Inv. Companies
  { symbol:'ENGROH',name:'Engro Holdings',       sector:'Inv. Companies',    pct:-0.54,  vol:8,  mktCap:30,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  { symbol:'PSX',   name:'Pak Stock Exchange',   sector:'Inv. Companies',    pct:-1.13,  vol:5,  mktCap:18,  kse100:true,  kse30:false, kmi30:false, kmiAll:false },
  // Paper & Board
  { symbol:'MACFL', name:'Maple Leaf Foods',     sector:'Paper & Board',     pct:-9.34,  vol:18, mktCap:12,  kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Real Estate
  { symbol:'JVDC',  name:'Javedan Corp',         sector:'Real Estate',       pct:-1.55,  vol:5,  mktCap:20,  kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  // Textile Spinning
  { symbol:'KOSM',  name:'Kohinoor Spinning',    sector:'Textile Spinning',  pct:+0.00,  vol:8,  mktCap:6,   kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'SZTM',  name:'Suraj Cotton',         sector:'Textile Spinning',  pct:+2.52,  vol:5,  mktCap:5,   kse100:false, kse30:false, kmi30:false, kmiAll:true  },
  { symbol:'DSTM',  name:'Dewan Sugar',          sector:'Textile Spinning',  pct:-0.76,  vol:4,  mktCap:4,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Modarbas
  { symbol:'UCAPM', name:'UCA Pakistan',         sector:'Modarbas',          pct:+10.02, vol:12, mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
  // Synthetic & Rayon
  { symbol:'DSFL',  name:'Dost Steels',          sector:'Synthetic & Rayon', pct:+3.53,  vol:10, mktCap:8,   kse100:false, kse30:false, kmi30:false, kmiAll:false },
]

// ─── Colors ───────────────────────────────────────────────────────────────────

function bgColor(pct: number): string {
  if (pct >= 5)    return '#14532d'
  if (pct >= 2.5)  return '#166534'
  if (pct >= 1)    return '#16a34a'
  if (pct >= 0)    return '#22c55e'
  if (pct >= -1)   return '#fca5a5'
  if (pct >= -2.5) return '#ef4444'
  if (pct >= -5)   return '#dc2626'
  return '#991b1b'
}

function txtColor(pct: number): string {
  if (pct >= 0 && pct < 1) return '#052e16'
  if (pct < 0 && pct > -1) return '#450a0a'
  return '#ffffff'
}

// ─── Squarified treemap ───────────────────────────────────────────────────────

interface TRect { id: string; x: number; y: number; w: number; h: number }

function squarify(items: { id: string; value: number }[], x: number, y: number, w: number, h: number): TRect[] {
  if (!items.length || w < 1 || h < 1) return []
  const out: TRect[] = []

  function worst(row: number[], len: number): number {
    if (!row.length || len <= 0) return Infinity
    const s = row.reduce((a, v) => a + v, 0)
    const mx = Math.max(...row), mn = Math.min(...row)
    return Math.max((len * len * mx) / (s * s), (s * s) / (len * len * mn))
  }

  function lay(nodes: { id: string; value: number }[], rx: number, ry: number, rw: number, rh: number) {
    if (!nodes.length || rw < 1 || rh < 1) return
    if (nodes.length === 1) { out.push({ id: nodes[0].id, x: rx, y: ry, w: rw, h: rh }); return }

    const tot = nodes.reduce((s, n) => s + n.value, 0)
    const areas = nodes.map(n => n.value / tot * rw * rh)
    const len = Math.min(rw, rh)

    const row: number[] = [], rowIds: string[] = []
    let used = 0
    for (let i = 0; i < nodes.length; i++) {
      const nr = [...row, areas[i]]
      if (!row.length || worst(nr, len) <= worst(row, len)) {
        row.push(areas[i]); rowIds.push(nodes[i].id); used = i + 1
      } else break
    }

    const rowArea = row.reduce((a, v) => a + v, 0)
    const rest = nodes.slice(used)

    if (rw <= rh) {
      const rowH = rowArea / rw
      let ox = rx
      for (let i = 0; i < row.length; i++) {
        out.push({ id: rowIds[i], x: ox, y: ry, w: row[i] / rowH, h: rowH }); ox += row[i] / rowH
      }
      lay(rest, rx, ry + rowH, rw, rh - rowH)
    } else {
      const rowW = rowArea / rh
      let oy = ry
      for (let i = 0; i < row.length; i++) {
        out.push({ id: rowIds[i], x: rx, y: oy, w: rowW, h: row[i] / rowW }); oy += row[i] / rowW
      }
      lay(rest, rx + rowW, ry, rw - rowW, rh)
    }
  }

  lay([...items].sort((a, b) => b.value - a.value), x, y, w, h)
  return out
}

// ─── HeatTile ─────────────────────────────────────────────────────────────────

function HeatTile({ stock, x, y, w, h, gap = 2, onEnter, onLeave }: {
  stock: HeatStock; x: number; y: number; w: number; h: number; gap?: number
  onEnter?: (s: HeatStock) => void; onLeave?: () => void
}) {
  const pw = w - gap, ph = h - gap
  if (pw < 5 || ph < 5) return null
  const showSym = pw >= 28 && ph >= 18
  const showPct = pw >= 40 && ph >= 32
  const fs = Math.min(13, Math.max(8, pw * 0.17))

  return (
    <div
      onMouseEnter={() => onEnter?.(stock)}
      onMouseLeave={onLeave}
      title={`${stock.name} (${stock.sector})\n${stock.pct >= 0 ? '+' : ''}${stock.pct.toFixed(2)}%`}
      style={{
        position: 'absolute', left: x, top: y, width: pw, height: ph,
        background: bgColor(stock.pct), borderRadius: 3, overflow: 'hidden',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none', transition: 'filter 0.1s',
      }}
      onMouseOver={e => (e.currentTarget.style.filter = 'brightness(1.18)')}
      onMouseOut={e  => (e.currentTarget.style.filter = 'brightness(1)')}
    >
      {showSym && (
        <span style={{ fontSize: fs, fontWeight: 800, color: txtColor(stock.pct), lineHeight: 1.1, textAlign: 'center' }}>
          {stock.symbol}
        </span>
      )}
      {showPct && (
        <span style={{ fontSize: Math.max(7, fs * 0.8), fontWeight: 500, color: txtColor(stock.pct), opacity: 0.9 }}>
          {stock.pct >= 0 ? '+' : ''}{stock.pct.toFixed(2)}%
        </span>
      )}
    </div>
  )
}

// ─── Combined view ────────────────────────────────────────────────────────────

function CombinedView({ stocks, width, onHover, onLeave }: {
  stocks: HeatStock[]; width: number
  onHover: (s: HeatStock) => void; onLeave: () => void
}) {
  const height = Math.max(320, Math.round(width * 0.44))
  const GAP = 3, GAP_INNER = 2, LABEL_H = 17

  const sectorMap = useMemo(() => {
    const m = new Map<string, HeatStock[]>()
    for (const s of stocks) { if (!m.has(s.sector)) m.set(s.sector, []); m.get(s.sector)!.push(s) }
    return m
  }, [stocks])

  const sectorRects = useMemo(() =>
    squarify(
      Array.from(sectorMap.entries()).map(([id, ss]) => ({ id, value: ss.reduce((a, s) => a + s.vol, 0) })),
      0, 0, width, height
    ), [sectorMap, width, height])

  if (width < 60) return null

  return (
    <div style={{
      position: 'relative', width, height,
      background: 'var(--navy-950)', borderRadius: 8,
      border: '1px solid var(--border-subtle)', overflow: 'hidden',
    }}>
      {sectorRects.map(sr => {
        const secStocks = sectorMap.get(sr.id) || []
        const ax = sr.x + GAP, ay = sr.y + GAP + LABEL_H
        const aw = sr.w - GAP * 2, ah = sr.h - GAP * 2 - LABEL_H
        const stockRects = aw > 10 && ah > 10
          ? squarify(secStocks.map(s => ({ id: s.symbol, value: s.vol })), ax, ay, aw, ah)
          : []
        const avgPct = secStocks.reduce((a, s) => a + s.pct, 0) / (secStocks.length || 1)

        return (
          <div key={sr.id}>
            {/* Sector background */}
            <div style={{
              position: 'absolute', left: sr.x + 1, top: sr.y + 1,
              width: sr.w - 2, height: sr.h - 2,
              background: 'var(--navy-900)', borderRadius: 4, pointerEvents: 'none',
            }} />
            {/* Sector label */}
            {sr.w > 40 && (
              <div style={{
                position: 'absolute', left: sr.x + 5, top: sr.y + 3,
                zIndex: 2, pointerEvents: 'none', display: 'flex', alignItems: 'center', gap: 5,
                maxWidth: sr.w - 10, overflow: 'hidden',
              }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--brand-gold)', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {sr.id}
                </span>
                <span style={{ fontSize: 9, fontWeight: 600, color: avgPct >= 0 ? '#4ade80' : '#f87171', whiteSpace: 'nowrap' }}>
                  {avgPct >= 0 ? '+' : ''}{avgPct.toFixed(2)}%
                </span>
              </div>
            )}
            {/* Stock tiles */}
            {stockRects.map(rect => {
              const stock = secStocks.find(s => s.symbol === rect.id)
              if (!stock) return null
              return <HeatTile key={rect.id} stock={stock} x={rect.x} y={rect.y} w={rect.w} h={rect.h} gap={GAP_INNER} onEnter={onHover} onLeave={onLeave} />
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─── Sector card ──────────────────────────────────────────────────────────────

function SectorCard({ sector, stocks, onHover, onLeave }: {
  sector: string; stocks: HeatStock[]
  onHover: (s: HeatStock) => void; onLeave: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [cardW, setCardW] = useState(260)
  const TILE_H = 170

  useEffect(() => {
    if (!ref.current) return
    const obs = new ResizeObserver(e => setCardW(e[0].contentRect.width))
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const avgPct = stocks.reduce((s, st) => s + st.pct, 0) / (stocks.length || 1)
  const totalVol = stocks.reduce((s, st) => s + st.vol, 0)

  const rects = useMemo(() =>
    squarify(stocks.map(s => ({ id: s.symbol, value: s.vol })), 0, 0, cardW, TILE_H),
    [stocks, cardW])

  return (
    <div style={{ borderRadius: 10, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
      <div style={{
        padding: '8px 12px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--brand-gold)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {sector}
          </p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: 0 }}>
            {totalVol.toFixed(1)}% vol &bull; {stocks.length} stocks
          </p>
        </div>
        <span style={{ fontSize: 13, fontWeight: 700, color: avgPct >= 0 ? '#22c55e' : '#ef4444' }}>
          {avgPct >= 0 ? '+' : ''}{avgPct.toFixed(2)}%
        </span>
      </div>
      <div ref={ref} style={{ position: 'relative', height: TILE_H, overflow: 'hidden' }}>
        {rects.map(rect => {
          const stock = stocks.find(s => s.symbol === rect.id)
          if (!stock) return null
          return <HeatTile key={rect.id} stock={stock} x={rect.x} y={rect.y} w={rect.w} h={rect.h} gap={2} onEnter={onHover} onLeave={onLeave} />
        })}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HeatmapPage() {
  const [view, setView] = useState<'combined' | 'sector'>('combined')
  const [idx, setIdx] = useState<IdxKey>('KSE-100')
  const [hovered, setHovered] = useState<HeatStock | null>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerW, setContainerW] = useState(900)

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(e => setContainerW(Math.round(e[0].contentRect.width)))
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const filtered = useMemo(() => STOCKS.filter(s => inIndex(s, idx)), [idx])
  const sectors  = useMemo(() => Array.from(new Set(filtered.map(s => s.sector))), [filtered])

  const advancers = filtered.filter(s => s.pct > 0).length
  const decliners = filtered.filter(s => s.pct < 0).length
  const unchanged = filtered.filter(s => s.pct === 0).length
  const avgPct    = filtered.reduce((s, st) => s + st.pct, 0) / (filtered.length || 1)

  const LEGEND = [
    { label: '≥+5%',  color: '#14532d' },
    { label: '+2.5%', color: '#166534' },
    { label: '+1%',   color: '#16a34a' },
    { label: '0%',    color: '#22c55e' },
    { label: '-1%',   color: '#fca5a5' },
    { label: '-2.5%', color: '#ef4444' },
    { label: '-5%',   color: '#dc2626' },
    { label: '≤-5%',  color: '#991b1b' },
  ]

  return (
    <div
      ref={containerRef}
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
      style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>
            PSX stocks — color shows % change today
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginRight: 2 }}>Change %:</span>
          {LEGEND.map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 11, height: 11, borderRadius: 2, background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{l.label}</span>
            </div>
          ))}
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>&bull; Box size = volume</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        {/* View toggle */}
        <div style={{ display: 'flex', gap: 6 }}>
          {(['combined', 'sector'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '6px 16px', fontSize: 13, fontWeight: 600, borderRadius: 6,
              border: `1px solid ${view === v ? 'var(--brand-gold)' : 'var(--border-subtle)'}`,
              background: view === v ? 'var(--brand-gold)' : 'var(--navy-900)',
              color: view === v ? '#000' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {v === 'combined' ? 'Combined View' : 'Sector View'}
            </button>
          ))}
        </div>
        {/* Index filter */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {INDICES.map(i => (
            <button key={i} onClick={() => setIdx(i)} style={{
              padding: '5px 13px', fontSize: 12, fontWeight: 600, borderRadius: 4,
              border: 'none',
              background: idx === i ? 'var(--brand-gold)' : 'var(--navy-800)',
              color: idx === i ? '#000' : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {i}
            </button>
          ))}
        </div>
      </div>

      {/* Summary row */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {[
          { label: 'Advancing', value: String(advancers), color: '#22c55e', sub: `of ${filtered.length}` },
          { label: 'Declining', value: String(decliners), color: '#ef4444', sub: `of ${filtered.length}` },
          { label: 'Unchanged', value: String(unchanged), color: 'var(--text-muted)', sub: 'flat' },
          { label: 'Avg Change', value: `${avgPct >= 0 ? '+' : ''}${avgPct.toFixed(2)}%`, color: avgPct >= 0 ? '#22c55e' : '#ef4444', sub: 'today' },
        ].map(s => (
          <div key={s.label} style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '8px 14px', minWidth: 80 }}>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '0 0 2px' }}>{s.label}</p>
            <p style={{ fontSize: 17, fontWeight: 700, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '2px 0 0' }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      {view === 'combined' ? (
        <CombinedView stocks={filtered} width={containerW} onHover={setHovered} onLeave={() => setHovered(null)} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }} className="heatmap-sector-grid">
          {sectors.map(sector => (
            <SectorCard
              key={sector} sector={sector}
              stocks={filtered.filter(s => s.sector === sector)}
              onHover={setHovered} onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
        Grouped by sector &bull; Box size = trading volume &bull; Click any stock to open detail &bull; Refreshes every 5 min
      </p>

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: 'fixed', left: pos.x + 14, top: pos.y - 8,
          background: 'var(--navy-800)', border: '1px solid var(--border-subtle)',
          borderRadius: 8, padding: '10px 14px', zIndex: 9999,
          pointerEvents: 'none', minWidth: 170, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>{hovered.symbol}</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '2px 0 6px' }}>{hovered.name}</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: hovered.pct >= 0 ? '#22c55e' : '#ef4444', margin: 0 }}>
            {hovered.pct >= 0 ? '+' : ''}{hovered.pct.toFixed(2)}%
          </p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {hovered.sector} &bull; PKR {hovered.mktCap}B mkt cap
          </p>
        </div>
      )}
    </div>
  )
}
