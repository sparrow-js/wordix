import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;

  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const revision = await prisma.revision.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
        },
      },
      document: {
        select: {
          id: true,
          title: true,
          collectionId: true,
        },
      },
    },
  });

  if (!revision) {
    return new Response("Revision not found", { status: 404 });
  }

  return respData(revision);
}
