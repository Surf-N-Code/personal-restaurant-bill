import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({log: ["query"]});

async function seed() {
  await prisma.user.deleteMany({}).catch(() => {});

  const hashedPassword = await bcrypt.hash("Southpark1", 10);

  await prisma.user.create({
    data: {
      email: "ndilthey@gmail.com",
      name: "Norman",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      positions: {
        create: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            quantity: 2,
            product: {
              create:
                {
                  name: "Cola",
                  price: 4,
                },
            },
            totalPrice: 8
          },
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            quantity: 1,
            product: {
              create:
                {
                  name: "Weißwein",
                  price: 33,
                },
            },
            totalPrice: 33
          },
        ],
      }
    },
  });

  await prisma.user.create({
    data: {
      email: "anna@diltheymedia.com",
      name: "Anna",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      positions: {
        create: [
          {
            createdAt: new Date(),
            updatedAt: new Date(),
            quantity: 1,
            product: {
              create:
                {
                  name: "Cola",
                  price: 4,
                },
            },
            totalPrice: 4
          },
        ],
      }
    }
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
