import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await request.json();

  const workspace = await prisma.workspace.findUnique({
    where: {
      id,
    },
    include: {
      members: {
        select: {
          role: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              createdAt: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    return new Response("Workspace not found", { status: 404 });
  }

  const processedWorkspace = {
    ...workspace,
    members: workspace.members.map((member) => ({
      role: member.role,
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
      createdAt: member.user.createdAt,
    })),
  };

  return respData(processedWorkspace);
}
