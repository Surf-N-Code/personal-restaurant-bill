import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "ndilthey@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("Southpark1", 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: "Niklas",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const whiteWine = {
      name: "Weißwein",
      price: 33,
    };

  const cola = {
      name: "Cola",
      price: 4,
    }

  const position = await prisma.position.create({
    data: {
      createdAt: new Date(),
      updatedAt: new Date(),
      user: { connect: {email: "ndilthey@gmail.com"}},
      userId: user.id,
      products: {
        create: [
          whiteWine, cola
        ]
      }
    },
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
