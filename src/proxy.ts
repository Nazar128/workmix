import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";


const PROTECTED_ROUTES = ["/dashboard", "/projects", "/tasks", "/settings", "/organizations"];
const AUTH_ROUTES = ["/login", "/register"];

export async function proxy( request: NextRequest) {
    const { pathname} = request.nextUrl;
    let response  = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({name, value }) =>
                    request.cookies.set(name,value));
                    response= NextResponse.next({request});
                    cookiesToSet.forEach(({name, value, options}) => 
                    response.cookies.set(name, value,options));
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();
    

    const isProtectedRoute = PROTECTED_ROUTES.some((route) => 
    pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    if(!user && isProtectedRoute) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo",pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (user && isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if ( pathname === "/") {
        if (user) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.redirect(new URL("/login", request.url));
    }

}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};