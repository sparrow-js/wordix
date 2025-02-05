import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { respData } from "@/lib/resp";
import prisma from "@/backend/prisma";


export async function GET(req: NextRequest) {
  const session = await auth();
  const searchParams = req.nextUrl.searchParams
  const workspaceId = searchParams.get('workspaceId') || ''

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }


  // Check if user has access to the workspace
  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      members: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!workspace) {
    return new Response("You don't have access to this workspace", { status: 403 });
  }


  try {
    const response = await fetch(`${process.env.PRO_URL}/api/token/${workspace.tokenId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ONE_API_TOKEN}`,
      },
    });

    const res = await response.json();
    const { data } = res;


    return respData({
      remain_quota: data.remain_quota,
      used_quota: data.used_quota,
    });
  } catch (error) {
    console.error("Error adding token:", error);
    return NextResponse.json({ error: "Failed to add token" }, { status: 500 });
  }
}
