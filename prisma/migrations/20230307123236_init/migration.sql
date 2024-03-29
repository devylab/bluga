-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PRIVATE', 'PUBLIC');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "avatar" VARCHAR(255),
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "thumbnail" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "rawContent" JSONB NOT NULL,
    "content" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
