/*
  Warnings:

  - A unique constraint covering the columns `[createdById,pollId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Vote_pollId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_createdById_pollId_key" ON "Vote"("createdById", "pollId");
