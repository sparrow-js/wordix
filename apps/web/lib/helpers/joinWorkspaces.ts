import Prisma from "@/backend/prisma";
import type { WorkspaceInvitation } from "@prisma/client";

export const joinWorkspaces = async (
  { id, email }: { id: string; email: string },
  invitations: WorkspaceInvitation[],
) => {
  await Prisma.$transaction([
    Prisma.memberInWorkspace.createMany({
      data: invitations.map((invitation) => ({
        workspaceId: invitation.workspaceId,
        role: invitation.type,
        userId: id,
      })),
      skipDuplicates: true,
    }),
    Prisma.workspaceInvitation.deleteMany({
      where: {
        email,
      },
    }),
  ]);
};
