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

    // Create new run
    const run = await prisma.run.create({
      data: {
        userId,
        status: "PENDING",
      },
    });

    return respData(run);
  } catch (error) {
    console.error("Error creating run:", error);
    return respErr("Failed to create run");
  }
}
