import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TwitterAuthDiagnostic from '../components/TwitterAuthDiagnostic'
import { fanTokens } from './fanTokens'
import { WalletProvider } from './contexts/WalletContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

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
          <AuthProvider>
            <ToastProvider>
              {children}
              <TwitterAuthDiagnostic />
            </ToastProvider>
          </AuthProvider>
        </WalletProvider>
      </body>
    </html>
  )
} 