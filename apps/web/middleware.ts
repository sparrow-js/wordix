import { auth } from "@/lib/auth";

// Or like this if you need to do something here.
export default auth((req) => {
  // 获取当前路径
  const { pathname } = req.nextUrl;

  // 定义无需认证的路径列表，包括根路径
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/docs"];

  // 如果已登录且访问登录页，重定向到应用首页
  if (req.auth && pathname === "/login") {
    return Response.redirect(new URL("/app", req.nextUrl.origin));
  }

  // 如果用户未认证且当前路径不在公开路径列表中，重定向到登录页
  if (!req.auth && !publicPaths.includes(pathname)) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", pathname);
    return Response.redirect(newUrl);
  }
});

// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.png).*)"],
};

// export default middleware;
