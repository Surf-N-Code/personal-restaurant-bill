import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({log: ["query"]});

async function seed() {
  const email = "ndilthey@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("Southpark1", 10);

  // await prisma.user.create({
  //   data: {
  //     email,
  //     name: "Norman",
  //     password: {
  //       create: {
  //         hash: hashedPassword,
  //       },
  //     },
  //     positions: {
  //       create: [
  //         {
  //           createdAt: new Date(),
  //           updatedAt: new Date(),
  //           products: {
  //             create: [
  //               {
  //                 name: "Cola",
  //                 price: 4,
  //               },
  //               {
  //                 name: "Wine",
  //                 price: 33,
  //               }
  //             ]
  //           },
  //         }
  //       ]
  //     }
  //   },
  // });

  await prisma.user.create({
    data: {
      email,
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
            products: {
              create: [
                {
                  name: "Cola",
                  price: 4,
                },
                {
                  name: "Wine",
                  price: 33,
                }
              ]
            },
          }
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
            products: {
              create: [
                {
                  name: "Cola",
                  price: 4,
                },
                {
                  name: "Fanta",
                  price: 3,
                },
              ]
            },
          }
        ],
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
