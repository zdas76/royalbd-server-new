/*
  Warnings:

  - You are about to drop the column `partyId` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `paymentType` on the `inventories` table. All the data in the column will be lost.
  - Added the required column `closingStockId` to the `inventories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentType` to the `transaction_info` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `closing_stock` DROP FOREIGN KEY `closing_stock_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_partyId_fkey`;

-- DropIndex
DROP INDEX `inventories_partyId_fkey` ON `inventories`;

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `partyId`,
    DROP COLUMN `paymentType`,
    ADD COLUMN `closingStockId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `transaction_info` ADD COLUMN `paymentType` ENUM('PAID', 'DUE', 'PARTIAL') NOT NULL;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_closingStockId_fkey` FOREIGN KEY (`closingStockId`) REFERENCES `closing_stock`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
