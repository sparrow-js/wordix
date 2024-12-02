import prisma from "@/backend/prisma";
import { respData, respErr } from "@/lib/resp";
import { headers } from "next/headers";

async function authenticateByToken(apiToken: string) {
  const apiKey = await prisma.apiKey.findFirst({
    where: { hash: apiToken },
    include: { user: true },
  });

  return apiKey?.user || null;
}

function extractBearerToken(headers: Headers) {
  return headers.get("authorization")?.slice(7);
}

export async function POST(req: Request, { params }: { params: { documentId: string } }) {
  try {
    const headersList = headers();
    const bearerToken = extractBearerToken(headersList);
    const user = bearerToken ? await authenticateByToken(bearerToken) : null;

    if (!user) {
      return respErr("Not authenticated");
    }

    const { documentId } = params;
    const body = await req.json();
    const { inputs, version } = body;

    const document = await prisma.document.findFirst({
      where: { id: documentId },
      select: {
        workspace: {
          select: {
            id: true,
            members: {
              select: { userId: true },
            },
          },
        },
      },
    });

    if (!document?.workspace) {
      return respErr("Document not found");
    }

    const isWorkspaceMember = document.workspace.members.some((member) => member.userId === user.id);
    if (!isWorkspaceMember) {
      return respErr("Not authorized");
    }

    // ... handle run creation logic ...
    return respData({});
  } catch (error) {
    console.error("Error creating run:", error);
    return respErr("Failed to create run");
  }
}
