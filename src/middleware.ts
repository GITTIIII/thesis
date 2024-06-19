import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // private route for only logined
    // const sessionToken = request.cookies.get('next-auth.session-token')?.value;

    // if (!sessionToken && request.nextUrl.pathname !== '/') {
    //     return NextResponse.redirect(new URL('/', request.url));
    // }

    // return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
