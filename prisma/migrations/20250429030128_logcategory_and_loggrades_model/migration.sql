-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_customerId_fk`;

-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_raw_materials_fk`;

-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_inventoryItemId_fk`;

-- AlterTable
ALTER TABLE `products` MODIFY `status` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `raw_materials` MODIFY `status` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE `logcategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogGrades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `gradeName` VARCHAR(50) NOT NULL,
    `minRadius` FLOAT NOT NULL,
    `maxRadius` FLOAT NOT NULL,
    `unitePrice` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_rawId_fkey` FOREIGN KEY (`rawId`) REFERENCES `raw_materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `inventories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LogGrades` ADD CONSTRAINT `LogGrades_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `logcategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
