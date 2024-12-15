import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// Or like this if you need to do something here.
export default auth((req) => {
  // 获取当前路径
  const { pathname } = req.nextUrl;

  const url = req.nextUrl;
  console.log("*******req.url", url);

  const hostname = req.headers.get("host").replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`);
  const searchParams = req.nextUrl.searchParams.toString();
  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

  console.log("*******hostname", hostname, path);

  // 定义无需认证的路径列表，包括根路径
  const publicPaths = ["/", "/login", "/register", "/forgot-password"];

  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    console.log("*******req.url", new URL(`/app${path === "/" ? "" : path}`, req.url), req.url);

    if (!req.auth && path !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (req.auth && path === "/login") {
      return NextResponse.rewrite(new URL("/", req.url));
    }

    if (!req.auth && path === "/login") {
      return NextResponse.rewrite(new URL("/login", req.url));
    }

    return NextResponse.rewrite(new URL(`/app${path === "/" ? "" : path}`, req.url));
  }

  if (hostname === "localhost:3000" || hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN) {
    return NextResponse.rewrite(new URL(`/home${path === "/" ? "" : path}`, req.url));
  }

  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));

  // // 如果已登录且访问登录页，重定向到应用首页
  // if (req.auth && pathname === "/login") {
  //   return Response.redirect(new URL("/app", req.nextUrl.origin));
  // }

  // // 如果用户未认证且当前路径不在公开路径列表中，重定向到登录页
  // if (!req.auth && !publicPaths.includes(pathname)) {
  //   const newUrl = new URL("/login", req.nextUrl.origin);
  //   newUrl.searchParams.set("callbackUrl", pathname);
  //   return Response.redirect(newUrl);
  // }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg|FascinateInline-Regular\\.ttf).*)"],
};

// export default middleware;
