import prisma from "@/backend/prisma";
import { respData, respErr } from "@/lib/resp";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { documentId: string } }) {
  try {
    const id = params.documentId;

    if (!id) {
      return respErr("Document ID is required");
    }

    const document = await prisma.document.findFirst({
      where: {
        id,
        visibility: "public",
      },
      select: {
        id: true,
        title: true,
        content: true,
        publishedContent: true,
        version: true,
        visibility: true,
        collectionId: true,
        documentVersion: true,
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const revision = await prisma.revision.findFirst({
      where: {
        documentId: id,
        version: document?.documentVersion,
      },
      select: {
        id: true,
        version: true,
        content: true,
        createdAt: true,
        title: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedData = {
      id: document?.id,
      title: revision?.title,
      version: revision?.version,
      content: revision?.content,
      collectionId: document?.collectionId,
      createdAt: revision?.createdAt || null,
    };

    if (!document) {
      return respErr("Document not found or not public");
    }

    return respData(formattedData);
  } catch (error) {
    console.error("Error fetching public app:", error);
    return respErr("Failed to fetch public app");
  }
}
