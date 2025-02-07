import { createId } from "@paralleldrive/cuid2";
import type { Prisma, PrismaClient } from "@prisma/client";
import { WorkspaceRole } from "@prisma/client";
import type { Adapter, AdapterAccount } from "next-auth/adapters";
import { convertInvitationsToCollaborations } from "./helpers/convertInvitationsToCollaborations";
import { getNewUserInvitations } from "./helpers/getNewUserInvitations";
import { joinWorkspaces } from "./helpers/joinWorkspaces";
import { parseWorkspaceDefaultPlan } from "./helpers/parseWorkspaceDefaultPlan";

export function PrismaAdapter(p: PrismaClient): Adapter {
  return {
    createUser: async (data) => {
      if (!data.email) throw Error("Provider did not forward email but it is required");
      const user = { id: createId(), email: data.email as string };
      const { invitations, workspaceInvitations } = await getNewUserInvitations(user.email);
      if (
        process.env.DISABLE_SIGNUP &&
        process.env.ADMIN_EMAIL.split(",")?.every((email) => email !== user.email) &&
        invitations.length === 0 &&
        workspaceInvitations.length === 0
      )
        throw Error("New users are forbidden");

      const workspaceId = createId();
      const response = await fetch(`${process.env.PRO_URL}/api/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.ONE_API_TOKEN}`,
        },
        body: JSON.stringify({
          name: workspaceId,
          remain_quota: 500000,
          expired_time: -1,
          unlimited_quota: false,
          models: "",
          subnet: "",
        }),
      });

      const tokenRes = await response.json();
      let oneApiToken = "";
      if (tokenRes.success) {
        oneApiToken = `sk-${tokenRes.data.key}`;
      }

      const newWorkspaceData = {
        id: workspaceId,
        name: data.name ? `${data.name}'s workspace` : "My workspace",
        plan: parseWorkspaceDefaultPlan(data.email),
        oneApiToken,
        tokenId: tokenRes.data.id,
      };
      const createdUser = await p.user.create({
        data: {
          ...data,
          workspaces:
            workspaceInvitations.length > 0
              ? undefined
              : {
                  create: {
                    role: WorkspaceRole.ADMIN,
                    workspace: {
                      create: newWorkspaceData,
                    },
                  },
                },
        },
        include: {
          workspaces: { select: { workspaceId: true } },
        },
      });
      // const newWorkspaceId = createdUser.workspaces.pop()?.workspaceId;

      if (invitations.length > 0) await convertInvitationsToCollaborations(user, invitations);
      if (workspaceInvitations.length > 0) await joinWorkspaces(user, workspaceInvitations);
      return createdUser;
    },
    getUser: (id) => p.user.findUnique({ where: { id } }),
    getUserByEmail: (email) => p.user.findUnique({ where: { email } }),
    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: { user: true },
      });
      return account?.user ?? null;
    },
    updateUser: ({ id, ...data }) => p.user.update({ where: { id }, data }),
    deleteUser: (id) => p.user.delete({ where: { id } }),
    linkAccount: (data) => p.account.create({ data }) as unknown as AdapterAccount,
    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,
    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.session.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!userAndSession) return null;
      const { user, ...session } = userAndSession;
      return { user, session };
    },
    createSession: (data) => p.session.create({ data }),
    updateSession: (data) => p.session.update({ where: { sessionToken: data.sessionToken }, data }),
    deleteSession: (sessionToken) => p.session.delete({ where: { sessionToken } }),
    async createVerificationToken(data) {
      const verificationToken = await p.verificationToken.create({ data });
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      return verificationToken;
    },
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token },
        });

        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === "P2025") return null;
        throw error;
      }
    },
  };
}
