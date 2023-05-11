-- CreateTable
CREATE TABLE "ContentMeta" (
    "id" TEXT NOT NULL,
    "time" INTEGER NOT NULL,
    "views" INTEGER NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "contentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContentMeta_contentId_key" ON "ContentMeta"("contentId");

-- AddForeignKey
ALTER TABLE "ContentMeta" ADD CONSTRAINT "ContentMeta_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
