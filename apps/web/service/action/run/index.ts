import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";

import { RunStatus } from "@prisma/client";

export async function createRun(
  documentId: string,
  collectionId: string,
  params: {
    metadata: any;
    duration: number;
  },
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const run = await prisma.run.create({
    data: {
      userId: session.user.id,
      status: RunStatus.COMPLETED,
      metadata: params.metadata,
      duration: params.duration,
      documentId: documentId,
      collectionId: collectionId,
    },
  });

  return run;
}
