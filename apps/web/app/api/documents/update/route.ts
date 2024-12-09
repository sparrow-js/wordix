import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, ...params } = body;
  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (params.publishedContent) {
    params.publishedAt = new Date();
  }

  const existingDocument = await prisma.document.findUnique({
    where: { id },
  });

  if (!existingDocument) {
    return respData(null);
  }

  const document = await prisma.document.update({
    where: { id },
    data: params,
  });

  if (params.documentVersion) {
    await prisma.revision.create({
      data: {
        version: params.documentVersion,
        documentId: document.id,
        userId: session.user.id,
        title: document.title,
        content: document.content,
        text: "",
        editorVersion: "v1",
      },
    });
  }

  return respData(document);
}
