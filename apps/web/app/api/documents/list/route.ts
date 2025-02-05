import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
  const body = await request.json();
  const {
    collectionId,
    workspaceId,
    direction = "DESC",
    limit = 25,
    page = 0,
    sort = "publishedAt",
    visibility,
  } = body;

  const session = await auth();
  // Check if user has access to the workspace
  if (workspaceId) {
    const workspace = await prisma.workspace.findUnique({
      where: {
        id: workspaceId,
      },
      include: {
        members: true,
      },
    });

    if (!workspace) {
      return new Response("Workspace not found", { status: 404 });
    }

    const isMember = workspace.members.some((member) => member.userId === session?.user?.id);
    if (!isMember) {
      return new Response("Unauthorized", { status: 401 });
    }
  }

  const documents = await prisma.document.findMany({
    where: {
      collectionId,
      workspaceId,
      ...(visibility ? { visibility } : {}),
    },
    skip: page * limit,
    take: limit,
    orderBy: {
      [sort]: direction.toLowerCase(),
    },
    include: {
      collection: {
        select: {
          name: true,
        },
      },
    },
  });

  const total = await prisma.document.count({
    where: {
      ...(collectionId ? { collectionId } : {}),
      ...(workspaceId ? { workspaceId } : {}),
      ...(visibility ? { visibility } : {}),
    },
  });

  return respData(documents, {
    total,
  });
}
