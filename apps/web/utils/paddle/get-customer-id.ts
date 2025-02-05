import prisma from "@/backend/prisma";
import { auth } from "@/lib/auth";

export async function getCustomerId() {
  const session = await auth();

  const user = session?.user;
  if (user?.email) {
    const customersData = await prisma.customer.findFirst({
      where: {
        email: user.email,
      },
    });
    if (customersData?.customer_id) {
      return customersData?.customer_id as string;
    }
  }
  return "";
}
