/*
  Warnings:

  - You are about to drop the column `sessionId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pollId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vote_sessionId_pollId_key";

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "sessionId",
ADD COLUMN     "createdById" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vote_pollId_key" ON "Vote"("pollId");

-- AddForeignKey
ALTER TABLE "Vote" ADD CONSTRAINT "Vote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
