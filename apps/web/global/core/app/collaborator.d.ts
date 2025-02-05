import type { UpdateClbPermissionProps } from "../../support/permission/collaborator";

export type UpdateAppCollaboratorBody = UpdateClbPermissionProps & {
  appId: string;
};

export type AppCollaboratorDeleteParams = {
  appId: string;
  tmbId: string;
};
