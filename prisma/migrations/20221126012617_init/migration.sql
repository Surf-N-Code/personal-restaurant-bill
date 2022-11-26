-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Password" (
    "hash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Password_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Position" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "productId" TEXT NOT NULL,
    "totalPrice" REAL NOT NULL,
    CONSTRAINT "Position_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Position_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "isCustom" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Password_userId_key" ON "Password"("userId");

INSERT INTO User (id, email, name, createdAt, updatedAt) VALUES ('clax890np0000knszqrv2y2qq', 'ndilthey@gmail.com', 'Norman', '1669424510870', '1669424510870');
INSERT INTO User (id, email, name, createdAt, updatedAt) VALUES ('clax890ns000gknszzyu15xx4', 'anna@diltheymedia.com', 'Anna', '1669424510872', '1669424510872');

INSERT INTO Product (id, name, price, isCustom) VALUES ('clax88mvs0005knsiz8zjd1jc', 'Weißwein', 33, 0);
INSERT INTO Product (id, name, price, isCustom) VALUES ('clax88mvs0005qnsiz8zjd1jc', 'Rotwein', 27.5, 0);
INSERT INTO Product (id, name, price, isCustom) VALUES ('clax88mvs0002knsa3c128e9j', 'Cola', 4, 0);
INSERT INTO Product (id, name, price, isCustom) VALUES ('clax890ns000iknsd69x9ykho', 'Fanta', 4, 0);
INSERT INTO Product (id, name, price, isCustom) VALUES ('clax890ns000iknsf69x9ykho', 'Wasser', 4, 0);
INSERT INTO Product (id, name, price, isCustom) VALUES ('clax890ns000iknse69x9ykho', 'Peroni', 5, 0);
INSERT INTO Product (id, name, price, isCustom) VALUES ('clax890ns000iknsw69x9ykho', 'Gin Tonic', 9, 0);
