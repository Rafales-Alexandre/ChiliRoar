import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import TwitterAuthDiagnostic from '../components/TwitterAuthDiagnostic'
import SociosDetector from '../components/SociosDetector'
import { fanTokens } from './fanTokens'
import { WalletProvider } from './contexts/WalletContext'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import { SociosWalletProvider } from './contexts/SociosWalletContext'

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
          <SociosWalletProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
                <TwitterAuthDiagnostic />
                <SociosDetector />
              </ToastProvider>
            </AuthProvider>
          </SociosWalletProvider>
        </WalletProvider>
      </body>
    </html>
  )
} 