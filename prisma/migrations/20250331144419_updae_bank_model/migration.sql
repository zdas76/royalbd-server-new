/*
  Warnings:

  - You are about to drop the `BankAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BankClosing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BankTransaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionInfo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BankClosing` DROP FOREIGN KEY `BankClosing_bankAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `BankTransaction` DROP FOREIGN KEY `BankTransaction_bankAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `TransactionInfo` DROP FOREIGN KEY `TransactionInfo_bankTxId_fkey`;

-- DropForeignKey
ALTER TABLE `TransactionInfo` DROP FOREIGN KEY `TransactionInfo_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `TransactionInfo` DROP FOREIGN KEY `TransactionInfo_partyId_fkey`;

-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_transectionId_fkey`;

-- DropIndex
DROP INDEX `journals_transectionId_fkey` ON `journals`;

-- DropTable
DROP TABLE `BankAccount`;

-- DropTable
DROP TABLE `BankClosing`;

-- DropTable
DROP TABLE `BankTransaction`;

-- DropTable
DROP TABLE `TransactionInfo`;

-- CreateTable
CREATE TABLE `bank_accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(191) NOT NULL,
    `branceName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_closing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankAccountId` INTEGER NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closingAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `bank_closing_bankAccountId_key`(`bankAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bank_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankAccountId` INTEGER NOT NULL,
    `debitAmount` INTEGER NOT NULL,
    `creditAmount` INTEGER NOT NULL,
    `transectionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `voucherNo` VARCHAR(191) NOT NULL,
    `invoiceNo` VARCHAR(191) NULL,
    `partyType` ENUM('VENDOR', 'CUSTOMER', 'SUPPLIER') NULL,
    `partyId` INTEGER NULL,
    `customerId` INTEGER NULL,
    `voucherType` ENUM('SALES', 'PURCHASE', 'RECEIVED', 'PAYMENT', 'JOURNAL', 'CONTRA') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `transaction_info_voucherNo_key`(`voucherNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bank_closing` ADD CONSTRAINT `bank_closing_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `bank_accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_transactions` ADD CONSTRAINT `bank_transactions_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `bank_accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bank_transactions` ADD CONSTRAINT `bank_transactions_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `transaction_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_info` ADD CONSTRAINT `transaction_info_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction_info` ADD CONSTRAINT `transaction_info_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `transaction_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
