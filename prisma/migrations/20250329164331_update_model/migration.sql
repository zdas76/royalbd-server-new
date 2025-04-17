/*
  Warnings:

  - You are about to drop the column `totalAmount` on the `journals` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `inventories` ADD COLUMN `discountAmount` DECIMAL(10, 2) NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `journals` DROP COLUMN `totalAmount`;
