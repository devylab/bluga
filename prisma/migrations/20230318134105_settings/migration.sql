-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "favicon" VARCHAR(255),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);
