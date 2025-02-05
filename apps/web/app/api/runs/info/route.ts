import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Get run ID from URL
    const url = new URL(req.url);
    const runId = url.searchParams.get("id");
    if (!runId) {
      return respErr("Run ID is required");
    }

    // Get run details
    const run = await prisma.run.findFirst({
      where: {
        id: runId,
        userId: userId,
      },
    });

    if (!run) {
      return respErr("Run not found");
    }

    return respData(run);
  } catch (error) {
    console.error("Error getting run info:", error);
    return respErr("Failed to get run info");
  }
}
