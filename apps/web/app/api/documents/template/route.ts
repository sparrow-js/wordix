import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return respErr("Unauthorized");
  }

  try {
    const body = await request.json();

    const document = await prisma.document.findMany({
      where: {
        template: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    return respData(document);
  } catch (error: any) {
    return respErr(error.message || "Failed to create template");
  }
}
