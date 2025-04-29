/*
  Warnings:

  - A unique constraint covering the columns `[contactNumber]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `bank_transactions` table without a default value. This is not possible if the table is not empty.
  - Made the column `contactNumber` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `bank_transactions` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `customers` MODIFY `contactNumber` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `customers_contactNumber_key` ON `customers`(`contactNumber`);
