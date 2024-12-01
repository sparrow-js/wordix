import Prisma from "@/backend/prisma";
import { type Invitation, WorkspaceRole } from "@prisma/client";

export type InvitationWithWorkspaceId = Invitation & {
  typebot: {
    workspaceId: string | null;
  };
};

export const convertInvitationsToCollaborations = async (
  { id, email }: { id: string; email: string },
  invitations: InvitationWithWorkspaceId[],
) => {
  await Prisma.collaboratorsOnCollections.createMany({
    data: invitations.map((invitation) => ({
      collectionId: invitation.collectionId,
      type: invitation.type,
      userId: id,
    })),
  });
  const workspaceInvitations = invitations.reduce<InvitationWithWorkspaceId[]>(
    (acc, invitation) =>
      acc.some((inv) => inv.typebot.workspaceId === invitation.typebot.workspaceId) ? acc : [...acc, invitation],
    [],
  );
  for (const invitation of workspaceInvitations) {
    if (!invitation.typebot.workspaceId) continue;
    await Prisma.memberInWorkspace.createMany({
      data: [
        {
          userId: id,
          workspaceId: invitation.typebot.workspaceId,
          role: WorkspaceRole.GUEST,
        },
      ],
      skipDuplicates: true,
    });
  }
  return Prisma.invitation.deleteMany({
    where: {
      email,
    },
  });
};
