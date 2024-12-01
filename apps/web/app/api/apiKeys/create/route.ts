import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";
import { nanoid } from "nanoid";
export async function POST(request: Request) {
  const body = await request.json();
  const { name } = body;

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const hash = nanoid(16);

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
