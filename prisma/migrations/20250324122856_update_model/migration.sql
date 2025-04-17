/*
  Warnings:

  - You are about to alter the column `closingAmount` on the `BankClosing` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `closingPrice` on the `ClosingStock` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `unitePrice` on the `inventories` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `quantityAdd` on the `inventories` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `quantityLess` on the `inventories` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to drop the column `bankTxId` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `creditAccountsItemId` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `debitAccountsItemId` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNo` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `partyOrcustomerId` on the `journals` table. All the data in the column will be lost.
  - You are about to drop the column `partyType` on the `journals` table. All the data in the column will be lost.
  - You are about to alter the column `creditAmount` on the `journals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - You are about to alter the column `debitAmount` on the `journals` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(10,2)`.
  - Added the required column `totalAmount` to the `journals` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transectionId` to the `journals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `BankClosing` DROP FOREIGN KEY `BankClosing_bankAccountId_fkey`;

-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_creditAccountsItemId_fkey`;

-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_customerId_fk`;

-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_debitAccountsItemId_fkey`;

-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_partyId_fk`;

-- DropIndex
DROP INDEX `journals_creditAccountsItemId_fkey` ON `journals`;

-- DropIndex
DROP INDEX `journals_customerId_fk` ON `journals`;

-- DropIndex
DROP INDEX `journals_debitAccountsItemId_fkey` ON `journals`;

-- DropIndex
DROP INDEX `journals_invoiceNo_key` ON `journals`;

-- AlterTable
ALTER TABLE `BankClosing` MODIFY `bankAccountId` INTEGER NULL,
    MODIFY `closingAmount` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `ClosingStock` MODIFY `closingPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `inventories` MODIFY `unitePrice` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    MODIFY `quantityAdd` DECIMAL(10, 2) NULL DEFAULT 0.00,
    MODIFY `quantityLess` DECIMAL(10, 2) NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `journals` DROP COLUMN `bankTxId`,
    DROP COLUMN `creditAccountsItemId`,
    DROP COLUMN `date`,
    DROP COLUMN `debitAccountsItemId`,
    DROP COLUMN `invoiceNo`,
    DROP COLUMN `partyOrcustomerId`,
    DROP COLUMN `partyType`,
    ADD COLUMN `accountsItemId` INTEGER NULL,
    ADD COLUMN `jurnaStatus` ENUM('UNCHECKED', 'CHECKED', 'CLOSED') NOT NULL DEFAULT 'UNCHECKED',
    ADD COLUMN `totalAmount` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `transectionId` INTEGER NOT NULL,
    MODIFY `creditAmount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    MODIFY `debitAmount` DECIMAL(10, 2) NULL DEFAULT 0.00;

-- CreateTable
CREATE TABLE `TransactionInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL,
    `invoiceNo` VARCHAR(191) NOT NULL,
    `bankTxId` VARCHAR(191) NULL,
    `partyType` ENUM('VENDOR', 'CUSTOMER', 'SUPPLIER') NULL,
    `partyOrcustomerId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TransactionInfo_invoiceNo_key`(`invoiceNo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BankClosing` ADD CONSTRAINT `BankClosing_bankAccountId_fkey` FOREIGN KEY (`bankAccountId`) REFERENCES `BankAccount`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionInfo` ADD CONSTRAINT `journals_partyId_fk` FOREIGN KEY (`partyOrcustomerId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionInfo` ADD CONSTRAINT `journals_customerId_fk` FOREIGN KEY (`partyOrcustomerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `TransactionInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_accountsItemId_fkey` FOREIGN KEY (`accountsItemId`) REFERENCES `account_items`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
