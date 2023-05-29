/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Theme` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `meta` to the `Theme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Theme" ADD COLUMN     "meta" JSONB NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Theme_name_key" ON "Theme"("name");
