import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '[BRAND] — Profilprodukter & Företagsgåvor',
    template: '%s | [BRAND]',
  },
  description:
    'Premium profilprodukter och företagsgåvor för svenska företag. AI-driven personalisering och snabb leverans.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="sv"
      className={`${inter.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)] antialiased">
        {children}
      </body>
    </html>
  )
}
