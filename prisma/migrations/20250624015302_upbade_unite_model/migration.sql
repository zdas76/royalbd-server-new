/*
  Warnings:

  - You are about to drop the column `unitId` on the `logGrades` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `logGrades` DROP FOREIGN KEY `logGrades_unitId_fkey`;

-- DropIndex
DROP INDEX `logGrades_unitId_fkey` ON `logGrades`;

-- AlterTable
ALTER TABLE `logGrades` DROP COLUMN `unitId`;
