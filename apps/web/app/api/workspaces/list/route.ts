import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";

export async function POST() {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // const waitlistEntry = await prisma.waitlist.findUnique({
  //   where: { email: session.user.email },
  // });

  // if (!waitlistEntry || waitlistEntry.status !== "allow") {
  //   return respData([], { total: 0 }, "waitlist");
  // }

  const workspaces = await prisma.workspace.findMany({
    where: {
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
    select: {
      name: true,
      id: true,
      icon: true,
      plan: true,
    },
  });

  return respData(workspaces);
}
