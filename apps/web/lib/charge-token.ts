import prisma from "@/backend/prisma";
import { Plan } from "@prisma/client";

export const chargeToken = async (email: string, amount: number, plan?: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      workspaces: {
        include: {
          workspace: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const workspace = user.workspaces[0].workspace;

  const tokenInfo = await fetch(`${process.env.PRO_URL}/api/token/${workspace.tokenId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ONE_API_TOKEN}`,
    },
  });

  const token = await tokenInfo.json();
  if (token.data) {
    const { remain_quota } = token.data;
    const response = await fetch(`${process.env.PRO_URL}/api/token`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ONE_API_TOKEN}`,
      },
      body: JSON.stringify({
        ...token.data,
        remain_quota: remain_quota + 500000 * amount,
      }),
    });

    if (plan === "vip") {
      await prisma.workspace.update({
        where: {
          id: workspace.id,
        },
        data: {
          plan: Plan.PRO,
        },
      });
    }

    return response;
  }

  return null;
};
