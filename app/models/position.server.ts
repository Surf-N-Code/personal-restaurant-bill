import { prisma } from "~/db.server";
import type { Prisma } from "@prisma/client";
export type { Position } from "@prisma/client";

export type OrderPosition = {
  id: string;
  userId: string;
  product: {
    id: string;
    name: string;
    price: number;
    isCustom: boolean;
  }
  quantity: number;
  totalPrice: number;
}

export type PositionWithProduct = Prisma.PositionGetPayload<{
  include: { product: true };
}>

export const getPositions = async (userId: string): Promise<PositionWithProduct[]> => {
  return await prisma.position.findMany({where: {userId},include: { product: true }});
}

export const createPosition = async (positions: PositionWithProduct[]): Promise<void> => {
  console.log("persistPositions", positions);
  let inserts = [];
  for (const position of positions) {
      inserts.push(prisma.position.create({
          data: {
            user: {
              connect: {
                id: position.userId
              }
            },
            quantity: position.quantity,
            product: {
              create: {
                name: position.product.name,
                price: position.product.price,
                isCustom: position.product.isCustom,
              }
            },
            totalPrice: position.totalPrice,
          }
        }
      )
    )
  }
  await prisma.$transaction(inserts)
}
