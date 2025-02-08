import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";

import { RunStatus } from "@prisma/client";

export async function createRun(documentId: string, collectionId: string, params: any, userId?: string) {
  if (!userId) {
    const session = await auth();
    if (!session?.user?.id) {
      userId = "";
    } else {
      userId = session.user.id;
    }
  }

  const run = await prisma.run.create({
    data: {
      ...(userId ? { userId } : {}),
      status: RunStatus.COMPLETED,
      documentId: documentId,
      collectionId: collectionId,
      ...params,
    },
  });

  return run;
}
