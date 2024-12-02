import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";
import { respData } from "@/lib/resp";

import { CollectionPermission, type CollectionPrivacy } from "@prisma/client";
import { nanoid } from "nanoid";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, privacy, template, tools, workspaceId } = body;

  const session = await auth();

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const collection = await prisma.collection.create({
    data: {
      name,
      createdById: session.user.id as string,
      permission: CollectionPermission.read_write,
      sharing: true,
      urlId: nanoid(10),
      privacy: privacy as CollectionPrivacy,
      documentStructure: [],
      workspaceId,
    },
  });

  return respData(collection);
}
