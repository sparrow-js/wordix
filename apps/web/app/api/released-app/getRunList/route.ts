import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const documentId = searchParams.get("documentId");
  const limit = Number(searchParams.get("limit")) || 25;
  const page = Number(searchParams.get("page")) || 0;
  const session = await auth();

  try {
    if (!documentId) {
      return respErr("Document ID is required");
    }

    const document = await prisma.document.findUnique({
      where: {
        id: documentId,
      },
    });

    if (document?.createdById !== session?.user?.id) {
      if (!document || document.visibility !== "public") {
        return respErr("Document not found or not public");
      }
    }

    let userRuns = [];
    if (session?.user?.id) {
      userRuns = await prisma.run.findMany({
        where: {
          userId: session.user.id,
          documentId: documentId,
          from: "app",
        },
        orderBy: {
          createdAt: "asc",
        },
        take: limit,
        skip: page * limit,
        include: {
          document: {
            select: {
              title: true,
            },
          },
        },
      });
    }

    // Build where clause based on provided parameters
    const whereClause: {
      documentId: string;
      from: string;
      OR?: any[];
    } = {
      documentId: documentId,
      from: "app",
    };

    // Add condition to get runs where userId is not equal to current user's id OR userId is null
    if (session?.user?.id) {
      whereClause.OR = [{ userId: { not: session.user.id } }, { userId: null }];
    }

    // Get runs for user with pagination
    const runs = await prisma.run.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "asc",
      },
      take: limit,
      skip: page * limit,
      include: {
        document: {
          select: {
            title: true,
          },
        },
      },
    });

    // Add total count
    const total = await prisma.run.count({
      where: whereClause,
    });

    return respData(
      {
        runs,
        userRuns,
      },
      {
        total,
      },
    );
  } catch (error) {
    console.error("Error listing runs:", error);
    return respErr("Failed to list runs");
  }
}
