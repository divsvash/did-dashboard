import type { Metadata } from 'next'
// @ts-ignore: global CSS import handled by Next.js
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'DID Dashboard',
  description: 'Decentralized Identity Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
