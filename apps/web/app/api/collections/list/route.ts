import prisma from "@/backend/prisma";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
  const body = await request.json();

  const { limit = 25, page = 0, workspaceId } = body;

  const collections = await prisma.collection.findMany({
    skip: page * limit,
    take: limit,
    where: {
      workspaceId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const total = await prisma.collection.count();

  return respData(collections, {
    total,
  });
}
