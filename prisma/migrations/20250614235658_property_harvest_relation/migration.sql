/*
  Warnings:

  - A unique constraint covering the columns `[year,propertyId]` on the table `Harvest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyId` to the `Harvest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Harvest_year_key";

-- AlterTable
ALTER TABLE "Harvest" ADD COLUMN     "propertyId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Harvest_year_propertyId_key" ON "Harvest"("year", "propertyId");

-- AddForeignKey
ALTER TABLE "Harvest" ADD CONSTRAINT "Harvest_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
