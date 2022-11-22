import { prisma } from "~/db.server";

export const getUsers = async () => {
  return await prisma.user.findMany();
}
