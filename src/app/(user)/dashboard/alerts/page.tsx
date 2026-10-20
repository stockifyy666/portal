'use client'

import { useState } from 'react'
import { MdAdd, MdNotifications, MdCheck, MdClose, MdTrendingUp, MdTrendingDown, MdEdit, MdDelete } from 'react-icons/md'

// â”€â”€â”€ Types & Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type ConditionType = 'price_above' | 'price_below' | 'pct_change_above' | 'pct_change_below' | 'volume_spike'
type AlertStatus = 'active' | 'triggered' | 'paused'

interface Alert {
  id: number; symbol: string; condition: ConditionType
  value: number; status: AlertStatus; createdAt: string; triggeredAt?: string
}

const CONDITION_LABELS: Record<ConditionType, string> = {
  price_above:      'Price rises above',
  price_below:      'Price falls below',
  pct_change_above: '% change above',
  pct_change_below: '% change below',
  volume_spike:     'Volume spike >',
}

const INITIAL_ALERTS: Alert[] = [
  { id:1, symbol:'KSE-100', condition:'price_above',      value:170000, status:'active',    createdAt:'2024-10-10' },
  { id:2, symbol:'HBL',     condition:'price_below',      value:180.00, status:'active',    createdAt:'2024-10-09' },
  { id:3, symbol:'ENGRO',   condition:'pct_change_above', value:3,      status:'active',    createdAt:'2024-10-08' },
  { id:4, symbol:'OGDC',    condition:'price_above',      value:165.00, status:'triggered', createdAt:'2024-10-05', triggeredAt:'2024-10-11' },
  { id:5, symbol:'SYS',     condition:'price_above',      value:650.00, status:'triggered', createdAt:'2024-10-01', triggeredAt:'2024-10-07' },
  { id:6, symbol:'MEBL',    condition:'volume_spike',     value:10000000,status:'paused',   createdAt:'2024-09-28' },
]

const STOCKS = ['KSE-100', 'ENGRO', 'HBL', 'LUCK', 'OGDC', 'MEBL', 'SYS', 'PPL', 'MCB', 'FFC', 'UBL', 'NESTLE', 'HUBC']
const CONDITIONS: ConditionType[] = ['price_above', 'price_below', 'pct_change_above', 'pct_change_below', 'volume_spike']

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS)
  const [tab, setTab] = useState<'active' | 'triggered' | 'all'>('active')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ symbol: 'ENGRO', condition: 'price_above' as ConditionType, value: '' })

  function addAlert() {
    if (!form.value) return
    const newAlert: Alert = {
      id: Date.now(), symbol: form.symbol, condition: form.condition,
      value: +form.value, status: 'active', createdAt: new Date().toISOString().slice(0, 10),
    }
    setAlerts(a => [newAlert, ...a])
    setForm({ symbol: 'ENGRO', condition: 'price_above', value: '' })
    setShowForm(false)
  }

  function removeAlert(id: number) { setAlerts(a => a.filter(x => x.id !== id)) }

  function togglePause(id: number) {
    setAlerts(a => a.map(x => x.id === id ? { ...x, status: x.status === 'paused' ? 'active' : 'paused' } : x))
  }

  const filtered = tab === 'all' ? alerts : alerts.filter(a => a.status === tab)
  const activeCount = alerts.filter(a => a.status === 'active').length
  const triggeredCount = alerts.filter(a => a.status === 'triggered').length

  const tabs = [
    { key: 'active'    as const, label: `Active (${activeCount})`    },
    { key: 'triggered' as const, label: `Triggered (${triggeredCount})` },
    { key: 'all'       as const, label: 'All'                        },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '8px 18px', fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
            cursor: 'pointer', border: 'none', background: 'none',
            color: tab === t.key ? 'var(--brand-gold)' : 'var(--text-muted)',
            borderBottom: `2px solid ${tab === t.key ? 'var(--brand-gold)' : 'transparent'}`,
            marginBottom: -2,
          }}>{t.label}</button>
        ))}
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 4 }}>Price Alerts</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Get notified when your conditions are met</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', border: 'none',
          background: 'var(--brand-gold)', color: '#fff',
        }}>
          <MdAdd size={16} /> Create Alert
        </button>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <div style={{ borderRadius: 8, border: '1px solid var(--brand-gold)', background: 'var(--navy-900)', padding: '20px' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>New Alert</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Symbol</p>
              <select value={form.symbol} onChange={e => setForm(f => ({ ...f, symbol: e.target.value }))}
                style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none', cursor: 'pointer' }}>
                {STOCKS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Condition</p>
              <select value={form.condition} onChange={e => setForm(f => ({ ...f, condition: e.target.value as ConditionType }))}
                style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none', cursor: 'pointer', minWidth: 160 }}>
                {CONDITIONS.map(c => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
              </select>
            </div>
            <div>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 5 }}>Value</p>
              <input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="e.g. 200.00"
                style={{ width: 140, padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 12.5, outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={addAlert} style={{ padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'var(--brand-gold)', color: '#fff' }}>
                Save Alert
              </button>
              <button onClick={() => setShowForm(false)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-muted)' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <MdNotifications size={32} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No alerts in this category.</p>
          </div>
        ) : (
          filtered.map((alert, i) => (
            <div key={alert.id} className="tr-hover" style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              {/* Status indicator */}
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: alert.status === 'active' ? 'var(--green-gain)' : alert.status === 'triggered' ? 'var(--brand-gold)' : 'var(--text-muted)',
              }} />
              {/* Symbol */}
              <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', minWidth: 70 }}>{alert.symbol}</span>
              {/* Condition */}
              <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', flex: 1 }}>
                {CONDITION_LABELS[alert.condition]}{' '}
                <strong style={{ color: 'var(--text-primary)' }}>
                  {alert.condition.includes('pct') ? `${alert.value}%` : alert.condition === 'volume_spike' ? `${(alert.value / 1_000_000).toFixed(1)}M` : `PKR ${alert.value.toLocaleString()}`}
                </strong>
              </span>
              {/* Status badge */}
              <span style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                background: alert.status === 'active' ? 'rgba(22,163,74,0.1)' : alert.status === 'triggered' ? 'rgba(215,168,61,0.15)' : 'rgba(100,116,139,0.15)',
                color: alert.status === 'active' ? 'var(--green-gain)' : alert.status === 'triggered' ? 'var(--brand-gold)' : 'var(--text-muted)',
              }}>
                {alert.status === 'active' ? 'Active' : alert.status === 'triggered' ? 'Triggered' : 'Paused'}
              </span>
              {/* Date */}
              <span style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 80, textAlign: 'right' }}>
                {alert.triggeredAt ?? alert.createdAt}
              </span>
              {/* Actions */}
              {alert.status !== 'triggered' && (
                <button onClick={() => togglePause(alert.id)} title={alert.status === 'paused' ? 'Resume' : 'Pause'}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 4 }}>
                  {alert.status === 'paused' ? <MdCheck size={15} /> : <MdEdit size={15} />}
                </button>
              )}
              <button onClick={() => removeAlert(alert.id)} title="Delete"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 4 }}>
                <MdDelete size={15} />
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

