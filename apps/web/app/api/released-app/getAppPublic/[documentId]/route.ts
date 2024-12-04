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
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!document) {
      return respErr("Document not found or not public");
    }

    return respData({
      document,
    });
  } catch (error) {
    console.error("Error fetching public app:", error);
    return respErr("Failed to fetch public app");
  }
}
