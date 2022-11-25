import { prisma } from "~/db.server";
import type { Position } from "@prisma/client";
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

export const getPositions = async (userId: string): Promise<Position[]> => {
  return await prisma.position.findMany({where: {userId},include: { products: true }});
}

export const createPosition = async (positions: OrderPosition[]): Promise<void> => {
  console.log("persistPositions", positions);
  let inserts = [];
  for (const position of positions) {
      inserts.push(prisma.position.create({
          data: {
            userId: position.userId,
            quantity: position.quantity,
            products: {
              create: {
                name: position.product.name,
                price: position.product.price,
                isCustom: position.product.isCustom,
              }
            }
          }
        }
      )
    )
  }
  await prisma.$transaction(inserts)
}
