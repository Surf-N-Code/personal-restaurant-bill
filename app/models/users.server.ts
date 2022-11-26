import { prisma } from "~/db.server";
import type { User } from "@prisma/client";
export type { User } from "@prisma/client";

export const getUsers = async () => {
  return await prisma.user.findMany();
}

export const getUser = async (id: string): Promise<User|null> => {
  return await prisma.user.findUnique({
    where: { id },include: { positions: { include: {product: true } }, }
  });
}
