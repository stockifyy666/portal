'use client'

import { useState } from 'react'
import { MdPerson, MdNotifications, MdPalette, MdStorage, MdSecurity, MdCheck } from 'react-icons/md'

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

type Tab = 'profile' | 'notifications' | 'appearance' | 'data' | 'security'

// â”€â”€â”€ Section components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</p>
        {hint && <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} style={{
      width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
      background: on ? 'var(--brand-gold)' : 'var(--navy-700)',
      position: 'relative', transition: 'background 0.2s',
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: '#fff',
        position: 'absolute', top: 3, left: on ? 23 : 3, transition: 'left 0.2s',
      }} />
    </button>
  )
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', minWidth: 220 }} />
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-primary)', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  )
}

function SaveButton({ onClick, saved }: { onClick: () => void; saved: boolean }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600,
      cursor: 'pointer', border: 'none',
      background: saved ? 'var(--green-gain)' : 'var(--brand-gold)', color: '#fff',
      transition: 'background 0.3s',
    }}>
      {saved ? <><MdCheck size={15} /> Saved</> : 'Save Changes'}
    </button>
  )
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function SettingsPage() {
  const [tab, setTab]   = useState<Tab>('profile')
  const [saved, setSaved] = useState(false)

  // Profile
  const [name,     setName]     = useState('Ahmad Raza')
  const [email,    setEmail]    = useState('stockifyy1@gmail.com')
  const [phone,    setPhone]    = useState('+92 300 0000000')
  const [timezone, setTimezone] = useState('Asia/Karachi')

  // Notifications
  const [priceAlerts,   setPriceAlerts]   = useState(true)
  const [newsDigest,    setNewsDigest]    = useState(true)
  const [weeklyReport,  setWeeklyReport]  = useState(false)
  const [emailNotif,    setEmailNotif]    = useState(true)

  // Appearance
  const [theme,    setTheme]    = useState('Dark')
  const [currency, setCurrency] = useState('PKR')
  const [lang,     setLang]     = useState('English')

  // Data
  const [defaultIndex, setDefaultIndex] = useState('KSE-100')
  const [refreshRate,  setRefreshRate]  = useState('30s')
  const [dataRange,    setDataRange]    = useState('1Y')

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile',       label: 'Profile',       icon: <MdPerson size={15} />       },
    { key: 'notifications', label: 'Notifications', icon: <MdNotifications size={15} /> },
    { key: 'appearance',    label: 'Appearance',    icon: <MdPalette size={15} />       },
    { key: 'data',          label: 'Data',          icon: <MdStorage size={15} />       },
    { key: 'security',      label: 'Security',      icon: <MdSecurity size={15} />      },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
            cursor: 'pointer', border: 'none', background: 'none',
            color: tab === t.key ? 'var(--brand-gold)' : 'var(--text-muted)',
            borderBottom: `2px solid ${tab === t.key ? 'var(--brand-gold)' : 'transparent'}`,
            marginBottom: -2,
          }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Header */}
      <div>
        <h1 style={{ marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Manage your account preferences and platform configuration</p>
      </div>

      {/* Panel */}
      <div style={{ borderRadius: 8, border: '1px solid var(--border-subtle)', background: 'var(--navy-900)', padding: '20px 24px' }}>

        {tab === 'profile' && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Profile Information</p>
            <Row label="Full Name"    hint="Your display name on the platform"><Input value={name}     onChange={setName}     placeholder="Your name" /></Row>
            <Row label="Email"        hint="Used for login and notifications">  <Input value={email}   onChange={setEmail}   placeholder="email@example.com" /></Row>
            <Row label="Phone"        hint="For SMS alerts (optional)">         <Input value={phone}   onChange={setPhone}   placeholder="+92 300 xxxxxxx" /></Row>
            <Row label="Timezone"     hint="Used to display market hours">      <Select value={timezone} onChange={setTimezone} options={['Asia/Karachi', 'UTC', 'America/New_York', 'Europe/London']} /></Row>
          </div>
        )}

        {tab === 'notifications' && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Notification Preferences</p>
            <Row label="Price Alerts"   hint="Get notified when your alert conditions are triggered"><Toggle on={priceAlerts}  onChange={() => setPriceAlerts(v => !v)}  /></Row>
            <Row label="News Digest"    hint="Daily curated PSX market news summary">               <Toggle on={newsDigest}   onChange={() => setNewsDigest(v => !v)}   /></Row>
            <Row label="Weekly Report"  hint="Weekly portfolio performance summary email">          <Toggle on={weeklyReport} onChange={() => setWeeklyReport(v => !v)} /></Row>
            <Row label="Email Notifs"   hint="Receive all notifications via email">                 <Toggle on={emailNotif}   onChange={() => setEmailNotif(v => !v)}   /></Row>
          </div>
        )}

        {tab === 'appearance' && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Display Preferences</p>
            <Row label="Theme"    hint="Interface color scheme">     <Select value={theme}    onChange={setTheme}    options={['Dark', 'Light', 'Auto']} /></Row>
            <Row label="Currency" hint="Default currency for prices"><Select value={currency} onChange={setCurrency} options={['PKR', 'USD', 'EUR', 'GBP']} /></Row>
            <Row label="Language" hint="Interface language">         <Select value={lang}     onChange={setLang}     options={['English', 'Urdu']} /></Row>
          </div>
        )}

        {tab === 'data' && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Data Preferences</p>
            <Row label="Default Index"   hint="Index shown first on the dashboard">          <Select value={defaultIndex} onChange={setDefaultIndex} options={['KSE-100', 'KSE-30', 'KMI-30', 'All Share']} /></Row>
            <Row label="Data Refresh"    hint="How often market data auto-refreshes">        <Select value={refreshRate}  onChange={setRefreshRate}  options={['15s', '30s', '1m', '5m', 'Manual']} /></Row>
            <Row label="Default Range"   hint="Default chart timeframe on charts page">      <Select value={dataRange}    onChange={setDataRange}    options={['1D', '1W', '1M', '3M', '6M', '1Y']} /></Row>
          </div>
        )}

        {tab === 'security' && (
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>Account Security</p>
            <Row label="Change Password"   hint="Update your account password">
              <button style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-secondary)' }}>
                Change Password
              </button>
            </Row>
            <Row label="Two-Factor Auth"   hint="Add an extra layer of security">
              <button style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-secondary)' }}>
                Enable 2FA
              </button>
            </Row>
            <Row label="Active Sessions"   hint="View and manage logged-in devices">
              <button style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: '1px solid var(--border-subtle)', background: 'var(--navy-800)', color: 'var(--text-secondary)' }}>
                View Sessions
              </button>
            </Row>
            <Row label="Delete Account"    hint="Permanently remove your Stockifyy account">
              <button style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', border: '1px solid rgba(220,38,38,0.4)', background: 'rgba(220,38,38,0.08)', color: 'var(--red-loss)' }}>
                Delete Account
              </button>
            </Row>
          </div>
        )}

        {tab !== 'security' && (
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
            <SaveButton onClick={handleSave} saved={saved} />
          </div>
        )}
      </div>
    </div>
  )
}

