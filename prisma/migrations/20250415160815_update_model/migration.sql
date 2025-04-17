-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_closingStockId_fkey`;

-- DropIndex
DROP INDEX `inventories_closingStockId_fkey` ON `inventories`;

-- AlterTable
ALTER TABLE `inventories` MODIFY `closingStockId` INTEGER NULL;

-- AlterTable
ALTER TABLE `transaction_info` MODIFY `paymentType` ENUM('PAID', 'DUE', 'PARTIAL') NOT NULL DEFAULT 'PAID';

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_closingStockId_fkey` FOREIGN KEY (`closingStockId`) REFERENCES `closing_stock`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
