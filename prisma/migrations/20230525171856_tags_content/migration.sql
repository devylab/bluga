/*
  Warnings:

  - Added the required column `tags` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "tags" TEXT NOT NULL;
