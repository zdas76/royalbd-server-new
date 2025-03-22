/*
  Warnings:

  - You are about to drop the column `quantity` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `totalCost` on the `inventories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[invoiceNo]` on the table `journals` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bankTxId` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `customers` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `contactNumber` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `quantity`,
    DROP COLUMN `totalCost`,
    ADD COLUMN `quantityAdd` DECIMAL(65, 30) NULL DEFAULT 0.00,
    ADD COLUMN `quantityLess` DECIMAL(65, 30) NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `journals` ADD COLUMN `bankTxId` VARCHAR(191) NOT NULL,
    MODIFY `creditAmount` DECIMAL(65, 30) NULL DEFAULT 0.00,
    MODIFY `debitAmount` DECIMAL(65, 30) NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE `BankAccount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` VARCHAR(191) NOT NULL,
    `branceName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankClosing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankAccountId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `closingAmount` DECIMAL(65, 30) NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BankClosing_bankAccountId_key`(`bankAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BankTransaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankAccountId` INTEGER NOT NULL,
    `debitAmount` INTEGER NOT NULL,
    `creditAmount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `journals_invoiceNo_key` ON `journals`(`invoiceNo`);

-- AddForeignKey
ALTER TABLE `BankClosing` ADD CONSTRAINT `BankClosing_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `BankAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BankTransaction` ADD CONSTRAINT `BankTransaction_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `BankAccount`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
