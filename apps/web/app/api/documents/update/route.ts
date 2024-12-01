import prisma from "@/backend/prisma";
import { respData } from "@/lib/resp";

export async function POST(request: Request) {
  const body = await request.json();
  const { id, ...params } = body;

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

  return respData(document);
}
