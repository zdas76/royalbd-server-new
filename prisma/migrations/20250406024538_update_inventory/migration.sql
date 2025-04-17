/*
  Warnings:

  - You are about to drop the column `rawOrProductId` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the `ClosingStock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ClosingStock` DROP FOREIGN KEY `ClosingStock_inventoryItemId_fkey`;

-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_customerId_fk`;

-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_raw_materials_fk`;

-- DropIndex
DROP INDEX `inventories_customerId_fk` ON `inventories`;

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `rawOrProductId`,
    ADD COLUMN `productId` INTEGER NULL,
    ADD COLUMN `raWMaterialId` INTEGER NULL;

-- AlterTable
ALTER TABLE `journals` MODIFY `narration` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `ClosingStock`;

-- CreateTable
CREATE TABLE `closing_stock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventoryItemId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closingQuantity` INTEGER NOT NULL,
    `closingPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `closing_stock_inventoryItemId_key`(`inventoryItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `closing_stock` ADD CONSTRAINT `closing_stock_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_raw_materials_fk` FOREIGN KEY (`raWMaterialId`) REFERENCES `raw_materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_customerId_fk` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
