-- CreateTable
CREATE TABLE `categoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryName` VARCHAR(200) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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

    UNIQUE INDEX `sub_categoris_subCategoryName_key`(`subCategoryName`),
    INDEX `sub_categoris_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `units` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account_pillers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pillerName` VARCHAR(191) NOT NULL,
    `pillerId` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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

    UNIQUE INDEX `employees_email_key`(`email`),
    INDEX `employees_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parties` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `contactNo` VARCHAR(15) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `partyType` ENUM('VENDOR', 'CUSTOMER', 'SUPPLIER') NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

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
    `unitId` INTEGER NOT NULL,
    `itemType` ENUM('PRODUCT', 'RAW_MATERIAL') NOT NULL DEFAULT 'PRODUCT',
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    INDEX `products_subCategoryId_name_idx`(`subCategoryId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `raw_materials` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `description` VARCHAR(250) NULL,
    `unitId` INTEGER NOT NULL,
    `itemType` ENUM('PRODUCT', 'RAW_MATERIAL') NOT NULL DEFAULT 'RAW_MATERIAL',
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `contactNumber` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NULL,
    `status` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `customers_contactNumber_key`(`contactNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(191) NOT NULL,
    `branceName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `status` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bank_accounts_bankName_accountNumber_key`(`bankName`, `accountNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `bankAccountId` INTEGER NOT NULL,
    `debitAmount` INTEGER NULL,
    `creditAmount` INTEGER NULL,
    `transectionId` INTEGER NULL,
    `isClosing` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inventories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `productId` INTEGER NULL,
    `rawId` INTEGER NULL,
    `createProductId` INTEGER NULL,
    `logToRawId` INTEGER NULL,
    `unitPrice` DOUBLE NOT NULL DEFAULT 0.00,
    `quantityAdd` DOUBLE NULL DEFAULT 0.00,
    `quantityLess` DOUBLE NULL DEFAULT 0.00,
    `discount` DOUBLE NULL DEFAULT 0.00,
    `isClosing` BOOLEAN NOT NULL DEFAULT false,
    `jurnaStatus` ENUM('UNCHECKED', 'CHECKED', 'CLOSED') NOT NULL DEFAULT 'UNCHECKED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `inventories_productId_rawId_createProductId_idx`(`productId`, `rawId`, `createProductId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `voucherNo` VARCHAR(191) NOT NULL,
    `invoiceNo` VARCHAR(191) NULL,
    `partyId` INTEGER NULL,
    `customerId` INTEGER NULL,
    `jurnaStatus` ENUM('UNCHECKED', 'CHECKED', 'CLOSED') NOT NULL DEFAULT 'UNCHECKED',
    `voucherType` ENUM('SALES', 'PURCHASE', 'RECEIPT', 'PAYMENT', 'JOURNAL', 'CONTRA') NOT NULL,
    `paymentType` ENUM('PAID', 'DUE', 'PARTIAL') NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transaction_info_voucherNo_key`(`voucherNo`),
    INDEX `transaction_info_date_voucherNo_voucherType_idx`(`date`, `voucherNo`, `voucherType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `journals` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transectionId` INTEGER NULL,
    `accountsItemId` INTEGER NULL,
    `inventoryItemId` INTEGER NULL,
    `logOrderId` INTEGER NULL,
    `createProductId` INTEGER NULL,
    `date` DATETIME(3) NOT NULL,
    `creditAmount` DOUBLE NULL DEFAULT 0.00,
    `debitAmount` DOUBLE NULL DEFAULT 0.00,
    `narration` VARCHAR(191) NULL,
    `isClosing` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `journals_inventoryItemId_accountsItemId_idx`(`inventoryItemId`, `accountsItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logcategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `logcategories_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logGrades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `gradeName` VARCHAR(50) NOT NULL,
    `minRadius` FLOAT NOT NULL,
    `maxRadius` FLOAT NOT NULL,
    `unitPrice` FLOAT NOT NULL,
    `status` ENUM('IN_STOCK', 'OUT_OF_STOCK', 'ACTIVE', 'DELETED', 'PUSH', 'BLOCK') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `logGrades_categoryId_idx`(`categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `supplierId` INTEGER NULL,
    `chalanNo` VARCHAR(100) NULL,
    `date` DATETIME(3) NOT NULL,
    `voucherNo` VARCHAR(36) NULL DEFAULT '00',
    `status` ENUM('UNCHECKED', 'CHECKED', 'CLOSED') NOT NULL DEFAULT 'UNCHECKED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `log_orders_voucherNo_key`(`voucherNo`),
    INDEX `log_orders_supplierId_date_voucherNo_idx`(`supplierId`, `date`, `voucherNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_Order_Items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logOrderId` INTEGER NOT NULL,
    `logGradeId` INTEGER NOT NULL,
    `radis` DOUBLE NOT NULL,
    `height` DOUBLE NOT NULL,
    `quantity` DOUBLE NOT NULL,
    `u_price` DOUBLE NOT NULL,
    `amount` DOUBLE NOT NULL,

    INDEX `log_Order_Items_logGradeId_idx`(`logGradeId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_order_by_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logOrderId` INTEGER NULL,
    `logToRawId` INTEGER NULL,
    `logCategoryId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `unitPrice` DOUBLE NOT NULL,
    `quantityAdd` DOUBLE NULL,
    `quantityLess` DOUBLE NULL,
    `debitAmount` DOUBLE NULL,
    `creditAmount` DOUBLE NULL,
    `status` ENUM('PENDING', 'CONVERTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `log_order_by_category_logCategoryId_idx`(`logCategoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `createProduct` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voucherNo` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `createProduct_voucherNo_key`(`voucherNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_to_raw` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voucherNo` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `log_to_raw_voucherNo_key`(`voucherNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sub_categoris` ADD CONSTRAINT `sub_categoris_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account_items` ADD CONSTRAINT `account_items_accountMainPillerId_fkey` FOREIGN KEY (`accountMainPillerId`) REFERENCES `account_pillers`(`pillerId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `sub_categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `raw_materials` ADD CONSTRAINT `raw_materials_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `units`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_transactions` ADD CONSTRAINT `bank_transactions_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `bank_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_transactions` ADD CONSTRAINT `bank_transactions_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `transaction_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_rawId_fkey` FOREIGN KEY (`rawId`) REFERENCES `raw_materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_createProductId_fkey` FOREIGN KEY (`createProductId`) REFERENCES `createProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_logToRawId_fkey` FOREIGN KEY (`logToRawId`) REFERENCES `log_to_raw`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_info` ADD CONSTRAINT `transaction_info_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_info` ADD CONSTRAINT `transaction_info_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `transaction_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_accountsItemId_fkey` FOREIGN KEY (`accountsItemId`) REFERENCES `account_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_inventoryItemId_fkey` FOREIGN KEY (`inventoryItemId`) REFERENCES `inventories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_logOrderId_fkey` FOREIGN KEY (`logOrderId`) REFERENCES `log_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_createProductId_fkey` FOREIGN KEY (`createProductId`) REFERENCES `createProduct`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logGrades` ADD CONSTRAINT `logGrades_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `logcategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_orders` ADD CONSTRAINT `log_orders_supplierId_fkey` FOREIGN KEY (`supplierId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_Order_Items` ADD CONSTRAINT `log_Order_Items_logOrderId_fkey` FOREIGN KEY (`logOrderId`) REFERENCES `log_orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_order_by_category` ADD CONSTRAINT `log_order_by_category_logToRawId_fkey` FOREIGN KEY (`logToRawId`) REFERENCES `log_to_raw`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_order_by_category` ADD CONSTRAINT `log_order_by_category_logOrderId_fkey` FOREIGN KEY (`logOrderId`) REFERENCES `log_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
