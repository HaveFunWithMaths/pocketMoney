import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const validTokens = ['Ninad', 'Brajesh', 'Thirumala', 'Saurabh']

    if (request.nextUrl.pathname.startsWith('/login')) {
        if (token && validTokens.includes(token)) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    if (!token || !validTokens.includes(token)) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|img).*)'],
}
