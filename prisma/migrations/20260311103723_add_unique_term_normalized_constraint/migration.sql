/*
  Warnings:

  - A unique constraint covering the columns `[userId,termNormalized]` on the table `Entry` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Entry_userId_termNormalized_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Entry_userId_termNormalized_key" ON "Entry"("userId", "termNormalized");
