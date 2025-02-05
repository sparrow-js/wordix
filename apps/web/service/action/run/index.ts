import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";

import { RunStatus } from "@prisma/client";

export async function createRun(documentId: string, collectionId: string, params: any) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const run = await prisma.run.create({
    data: {
      userId: session.user.id,
      status: RunStatus.COMPLETED,
      documentId: documentId,
      collectionId: collectionId,
      ...params,
    },
  });

  return run;
}
