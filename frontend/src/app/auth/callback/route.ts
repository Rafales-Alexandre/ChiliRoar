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
    console.log('Tentative d\'échange de code avec Supabase...')
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    console.log('Résultat échange de code:', { 
      hasData: !!data, 
      hasSession: !!data?.session,
      hasUser: !!data?.user,
      error: exchangeError?.message,
      errorCode: exchangeError?.code
    })
    
    if (!exchangeError && data?.session) {
      // Succès - rediriger vers la page demandée
      const forwardedHost = request.headers.get('x-forwarded-host')
      const redirectUrl = forwardedHost 
        ? `https://${forwardedHost}${next}`
        : `${origin}${next}`
      
      console.log('Authentification réussie, redirection vers:', redirectUrl)
      console.log('Utilisateur connecté:', data.user.id, data.user.email || 'sans email')
      return NextResponse.redirect(redirectUrl)
    } 
    
    // Cas spécial pour Twitter : même si il y a une "erreur", vérifier si on a quand même une session
    if (exchangeError && exchangeError.message?.toLowerCase().includes('email')) {
      console.log('Erreur liée à l\'email détectée, vérification de session alternative...')
      
      // Essayer de récupérer une session existante
      const { data: sessionCheck, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionCheck?.session) {
        console.log('Session trouvée malgré l\'erreur email:', sessionCheck.session.user.id)
        
        const forwardedHost = request.headers.get('x-forwarded-host')
        const redirectUrl = forwardedHost 
          ? `https://${forwardedHost}${next}`
          : `${origin}${next}`
        
        return NextResponse.redirect(redirectUrl)
      }
      
      // Si pas de session, essayer de créer un utilisateur avec les données disponibles
      console.log('Tentative de création d\'utilisateur sans email...')
      
      // Rediriger vers une page spéciale pour finaliser l'inscription
      const specialParams = new URLSearchParams({
        action: 'complete_twitter_signup',
        code: code,
        next: next
      })
      
      return NextResponse.redirect(`${origin}/auth/complete-signup?${specialParams.toString()}`)
    }
    
    // Autres erreurs
    const errorParams = new URLSearchParams({
      error: exchangeError?.message || 'session_error',
      error_code: 'auth_callback_error',
      error_description: exchangeError?.message || 'Erreur lors de la création de session'
    })
    
    console.log('Erreur échange de code:', exchangeError)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?${errorParams.toString()}`)
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