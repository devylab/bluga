/*
  Warnings:

  - Added the required column `description` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thumbnail` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "description" VARCHAR(255) NOT NULL,
ADD COLUMN     "slug" VARCHAR(255) NOT NULL,
ADD COLUMN     "thumbnail" VARCHAR(255) NOT NULL;

-- CreateTable
CREATE TABLE "Theme" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);
