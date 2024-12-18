import { auth } from "@/lib/auth";
import { type NextRequest, NextResponse } from "next/server";

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|.*\\.webp|FascinateInline-Regular\\.ttf).*)",
  ],
};

// 定义无需认证的路径列表，包括根路径
const publicPaths = ["/privacy-policy", "/terms"];

const appPublicPaths = "explore";

export default async function middleware(req: NextRequest) {
  // 获取当前路径
  const { pathname } = req.nextUrl;

  const url = req.nextUrl;

  const hostname = req.headers
    .get("host")
    .replace("www.", "")
    .replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    if (path.includes(appPublicPaths)) {
      return NextResponse.rewrite(new URL(`/app${path === "/" ? "" : path}`, req.url));
    }

    const session = await auth();

    if (!session && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (session && path === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (!session && path === "/login") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }

    return NextResponse.rewrite(new URL(`/app${path === "/" ? "" : path}`, req.url));
  }

  if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return NextResponse.rewrite(new URL(`/home${path === "/" ? "" : path}`, req.url));
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
