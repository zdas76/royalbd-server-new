/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `inventories` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `inventories` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[voucherNo]` on the table `TransactionInfo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voucherNo` to the `TransactionInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `itemType` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `TransactionInfo_invoiceNo_key` ON `TransactionInfo`;

-- AlterTable
ALTER TABLE `TransactionInfo` ADD COLUMN `voucherNo` VARCHAR(191) NOT NULL,
    MODIFY `invoiceNo` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `discountAmount`,
    DROP COLUMN `type`,
    ADD COLUMN `discount` DECIMAL(10, 2) NULL DEFAULT 0.00,
    ADD COLUMN `itemType` ENUM('PRODUCT', 'RAW_MATERIAL') NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `TransactionInfo_voucherNo_key` ON `TransactionInfo`(`voucherNo`);
