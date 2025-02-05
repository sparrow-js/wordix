import { Plan } from "@prisma/client";

export const parseWorkspaceDefaultPlan = (userEmail: string) => {
  if (process.env.ADMIN_EMAIL.split(",")?.some((email) => email === userEmail)) return Plan.UNLIMITED;
  const defaultPlan = process.env.DEFAULT_WORKSPACE_PLAN as Plan;
  if (defaultPlan && Object.values(Plan).includes(defaultPlan)) return defaultPlan;
  return Plan.FREE;
};
