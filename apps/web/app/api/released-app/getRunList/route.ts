import prisma from "@/backend/prisma";
import { respData, respErr } from "@/lib/resp";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const documentId = searchParams.get("documentId");
  const limit = Number(searchParams.get("limit")) || 25;
  const page = Number(searchParams.get("page")) || 0;

  try {
    // Build where clause based on provided parameters
    const whereClause = {
      documentId: documentId,
    };

    // Get runs for user with pagination
    const runs = await prisma.run.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
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

    return respData(runs, {
      total,
    });
  } catch (error) {
    console.error("Error listing runs:", error);
    return respErr("Failed to list runs");
  }
}
