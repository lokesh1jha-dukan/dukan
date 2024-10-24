import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { isAuthenticatedAndUserData } from "./lib/auth";

export async function middleware(req: NextRequest) {
    const decryptedToken = await isAuthenticatedAndUserData();

    if (!decryptedToken.isAuthenticated) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next({
        request: req,
    });
}


export const config = {
    matcher: ['/cart'],
};
