import { createServerSupabaseClient } from '../../../lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')
  const next = searchParams.get('next') ?? '/'

  console.log('Callback reçu:', { code, error, errorDescription, searchParams: Object.fromEntries(searchParams) })

  // Gérer les erreurs OAuth2 directement de Twitter
  if (error) {
    const errorParams = new URLSearchParams({
      error: error,
      error_code: 'oauth_error',
      error_description: errorDescription || 'Erreur OAuth2 de Twitter'
    })
    
    console.log('Erreur OAuth2 détectée:', { error, errorDescription })
    return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
  }

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Échange de code:', { data: !!data, error: exchangeError })
    
    if (!exchangeError && data?.session) {
      // Succès - rediriger vers la page demandée
      const forwardedHost = request.headers.get('x-forwarded-host')
      const redirectUrl = forwardedHost 
        ? `https://${forwardedHost}${next}`
        : `${origin}${next}`
      
      console.log('Authentification réussie, redirection vers:', redirectUrl)
      return NextResponse.redirect(redirectUrl)
    } else {
      // Erreur lors de l'échange de code
      const errorParams = new URLSearchParams({
        error: exchangeError?.message || 'session_error',
        error_code: 'auth_callback_error',
        error_description: exchangeError?.message || 'Erreur lors de la création de session'
      })
      
      console.log('Erreur échange de code:', exchangeError)
      return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
    }
  }

  // Pas de code - erreur générale
  const errorParams = new URLSearchParams({
    error: 'missing_code',
    error_code: 'callback_error',
    error_description: 'Code d\'authentification manquant'
  })
  
  console.log('Aucun code reçu dans le callback')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
} 