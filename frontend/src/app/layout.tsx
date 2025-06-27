import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { FanTokenDataProvider } from './contexts/FanTokenDataContext'
import { fanTokens } from './fanTokens'
import { WalletProvider } from './contexts/WalletContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ChiliRoar - FanTokens Arena',
  description: 'La plateforme ultime pour les FanTokens, les Roars et l\'engagement communautaire',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Extraire tous les tickers des FanTokens
  const allTickers = fanTokens.map(token => token.ticker);

  return (
    <html lang="fr">
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