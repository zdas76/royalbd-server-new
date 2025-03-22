/*
  Warnings:

  - You are about to drop the column `category` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `supplier` on the `inventories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[inventoryItemId]` on the table `ClosingStock` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `ClosingStock` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rawOrProductId` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `inventories_name_key` ON `inventories`;

-- AlterTable
ALTER TABLE `ClosingStock` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `category`,
    DROP COLUMN `name`,
    DROP COLUMN `supplier`,
    ADD COLUMN `partyId` INTEGER NULL,
    ADD COLUMN `rawOrProductId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `parties` MODIFY `partyType` ENUM('VENDOR', 'CUSTOMER', 'SUPPLIER') NOT NULL;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contactNumber` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `invoiceNo` VARCHAR(191) NOT NULL,
    `partyType` ENUM('VENDOR', 'CUSTOMER', 'SUPPLIER') NULL,
    `partyOrcustomerId` INTEGER NULL,
    `debitAccountsItemId` INTEGER NULL,
    `creditAccountsItemId` INTEGER NULL,
    `inventoryItemId` INTEGER NULL,
    `creditAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `debitAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `narration` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `ClosingStock_inventoryItemId_key` ON `ClosingStock`(`inventoryItemId`);

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_raw_materials_fk` FOREIGN KEY (`rawOrProductId`) REFERENCES `raw_materials`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_customerId_fk` FOREIGN KEY (`rawOrProductId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_partyId_fk` FOREIGN KEY (`partyOrcustomerId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_customerId_fk` FOREIGN KEY (`partyOrcustomerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_debitAccountsItemId_fkey` FOREIGN KEY (`debitAccountsItemId`) REFERENCES `account_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_creditAccountsItemId_fkey` FOREIGN KEY (`creditAccountsItemId`) REFERENCES `account_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_inventoryItemId_fk` FOREIGN KEY (`inventoryItemId`) REFERENCES `inventories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
