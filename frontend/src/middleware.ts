import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // Intercepter les callbacks Twitter avec erreur potentielle
  if (pathname === '/auth/callback') {
    const code = searchParams.get('code')
    const error = searchParams.get('error')
    
    console.log('Middleware - Callback intercepté:', { 
      code: !!code, 
      error,
      pathname,
      searchParams: Object.fromEntries(searchParams)
    })
    
    // Si nous avons un code mais pas d'erreur explicite, 
    // préparer la redirection vers la création manuelle en cas d'erreur 500
    if (code && !error) {
      console.log('Middleware - Code présent, continuons vers le callback')
      
      // Ajouter un header pour indiquer que c'est un callback Twitter
      const response = NextResponse.next()
      response.headers.set('x-twitter-callback', 'true')
      return response
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/auth/callback',
    '/auth/:path*'
  ]
} 