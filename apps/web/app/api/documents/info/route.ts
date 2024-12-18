import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";

export async function POST(request: Request) {
  const body = await request.json();
  const { id } = body;
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const document = await prisma.document.findUnique({
    where: { id, createdById: session.user.id },
  });

  if (!document) {
    return respErr("Document not found");
  }

  return respData({ document });
}
