import type { ReactNode } from "react";
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SessionProvider } from "next-auth/react"

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in")
  return <SessionProvider basePath={"/api/auth"} session={session}>{children}</SessionProvider>;
}
