-- DropForeignKey
ALTER TABLE "ContentMeta" DROP CONSTRAINT "ContentMeta_contentId_fkey";

-- AddForeignKey
ALTER TABLE "ContentMeta" ADD CONSTRAINT "ContentMeta_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE CASCADE ON UPDATE CASCADE;
