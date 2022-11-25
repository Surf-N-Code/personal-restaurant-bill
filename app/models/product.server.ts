import { prisma } from "~/db.server";
import type { Product } from "@prisma/client";
export type { Product } from "@prisma/client";

export const getProducts = async (): Promise<Product[]> => {
  return await prisma.product.findMany({where: {isCustom: false}, distinct: ["name"]});
}
