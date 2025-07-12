import React from 'react'

export interface User {
  id: string
  email?: string
  name?: string
  avatar_url?: string
  wallet_address?: string
  provider?: 'twitter' | 'wallet'
  created_at: string
  updated_at: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface AuthContextType extends AuthState {
  signInWithTwitter: () => Promise<void>
  signInWithWallet: (address: string) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  forceRefreshSession: () => Promise<void>
}

export interface LoginProvider {
  id: 'twitter' | 'wallet'
  name: string
  icon: string | React.ReactNode
  color: string
  gradient: string
} 