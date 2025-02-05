import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData, respErr } from "@/lib/resp";
import { generateId } from "@/lib/utils";
export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  const session = await auth();

  if (!session?.user) {
    return respErr("Unauthorized");
  }

  const hash = `wx-${generateId(24)}`;

  const apiKey = await prisma.apiKey.create({
    data: {
      name,
      userId: session.user.id,
      hash,
      last4: hash.slice(-4),
    },
  });

  return respData(apiKey);
}
