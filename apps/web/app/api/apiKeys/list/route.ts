import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        last4: true,
        createdAt: true,
      },
    });

    const total = await prisma.apiKey.count({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
    });

    return respData(apiKeys, { total });
  } catch (error) {
    console.error("Error listing API keys:", error);
    return respErr("Failed to list API keys");
  }
}
