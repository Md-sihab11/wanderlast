import { NextResponse } from 'next/server'
import { auth } from "./lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

}

export const config = {
    matcher: ['/add-destination', '/destinations', '/my-bookings', '/destinations/:path*'],
}