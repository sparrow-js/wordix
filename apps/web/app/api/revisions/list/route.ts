import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
  const body = await request.json();
  const { documentId, direction = "DESC", limit = 25, offset = 0, sort = "createdAt" } = body;

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const revisions = await prisma.revision.findMany({
    where: {
      documentId,
    },
    skip: offset,
    take: limit,
    orderBy: {
      [sort]: direction.toLowerCase(),
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
    },
  });

  const total = await prisma.revision.count({
    where: {
      documentId,
    },
  });

  return respData(revisions, {
    total,
  });
}
