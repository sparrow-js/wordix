import Prisma from "@/backend/prisma";
import type { WorkspaceInvitation } from "@prisma/client";

export const getNewUserInvitations = async (
  email: string,
): Promise<{
  invitations: any[];
  workspaceInvitations: WorkspaceInvitation[];
}> => {
  const [invitations, workspaceInvitations] = await Prisma.$transaction([
    Prisma.invitation.findMany({
      where: { email },
      include: { collection: { select: { workspaceId: true } } },
    }),
    Prisma.workspaceInvitation.findMany({
      where: { email },
    }),
  ]);

  return { invitations, workspaceInvitations };
};
