-- CreateTable
CREATE TABLE `employees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(30) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `nid` VARCHAR(20) NULL,
    `dob` DATE NOT NULL,
    `workingPlase` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(14) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    `status` ENUM('ACTIVE', 'BLOCK', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `employees_id_key`(`id`),
    UNIQUE INDEX `employees_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `contactNo` VARCHAR(15) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `partyType` ENUM('VENDOR', 'CUSTOMER') NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `categoris_id_key`(`id`),
    UNIQUE INDEX `categoris_categoryName_key`(`categoryName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_categoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subCategoryName` VARCHAR(200) NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sub_categoris_id_key`(`id`),
    UNIQUE INDEX `sub_categoris_subCategoryName_key`(`subCategoryName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_pillers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pillerName` VARCHAR(191) NOT NULL,
    `pillerId` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `account_pillers_id_key`(`id`),
    UNIQUE INDEX `account_pillers_pillerId_key`(`pillerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `accountsItemName` VARCHAR(191) NOT NULL,
    `accountMainPillerId` VARCHAR(2) NOT NULL,
    `accountsItemId` VARCHAR(4) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unites` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(250) NOT NULL,
    `subCategoryId` INTEGER NOT NULL,
    `minPrice` INTEGER NULL,
    `color` VARCHAR(191) NULL,
    `size` VARCHAR(191) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raw_materials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(250) NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('PRODUCT', 'RAW_MATERIAL') NOT NULL,
    `category` VARCHAR(191) NULL,
    `supplier` VARCHAR(191) NULL,
    `unitePrice` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `quantity` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `totalCost` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `inventories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClosingStock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `inventoryItemId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closingQuantity` INTEGER NOT NULL,
    `closingPrice` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sub_categoris` ADD CONSTRAINT `sub_categoris_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_items` ADD CONSTRAINT `account_items_accountMainPillerId_fkey` FOREIGN KEY (`accountMainPillerId`) REFERENCES `account_pillers`(`pillerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `sub_categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClosingStock` ADD CONSTRAINT `ClosingStock_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `inventories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
