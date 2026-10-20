import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Stockifyy — PSX Data Portal',
  description: 'Pakistan Stock Exchange data portal powered by CS Solutions',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}
          style={{ background: '#F8FAFC' }}>
      <body style={{ background: '#F8FAFC', color: '#0F172A', margin: 0 }}>
        {children}
      </body>
    </html>
  )
}
