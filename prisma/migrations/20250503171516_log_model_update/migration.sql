-- DropForeignKey
ALTER TABLE `log_Order_Items` DROP FOREIGN KEY `log_Order_Items_logCategoryId_fkey`;

-- DropIndex
DROP INDEX `log_Order_Items_logCategoryId_fkey` ON `log_Order_Items`;

-- AlterTable
ALTER TABLE `journals` ADD COLUMN `logOrderId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_logOrderId_fkey` FOREIGN KEY (`logOrderId`) REFERENCES `log_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
