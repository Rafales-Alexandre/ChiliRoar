import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FanTokenDataProvider } from './contexts/FanTokenDataContext'
import { fanTokens } from './fanTokens'
import { WalletProvider } from './contexts/WalletContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChiliRoar - FanTokens Arena',
  description: 'The ultimate platform for FanTokens, Roars and community engagement',
}

const allTickers = fanTokens.map(token => token.ticker);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950`}>
        <WalletProvider>
          <FanTokenDataProvider tickers={allTickers}>
            {children}
          </FanTokenDataProvider>
        </WalletProvider>
      </body>
    </html>
  )
} 