import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  const { collectionId, limit = 25, offset = 0 } = body;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get runs for user with pagination
    const runs = await prisma.run.findMany({
      where: {
        collectionId: collectionId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      skip: offset,
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
      where: {
        collectionId: collectionId,
      },
    });

    return respData(runs, {
      total,
    });
  } catch (error) {
    console.error("Error listing runs:", error);
    return respErr("Failed to list runs");
  }
}
