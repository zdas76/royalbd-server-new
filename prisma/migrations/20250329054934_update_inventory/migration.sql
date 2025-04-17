/*
  Warnings:

  - The values [SELL] on the enum `TransactionInfo_voucherType` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `paymentType` to the `inventories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TransactionInfo` MODIFY `voucherType` ENUM('SALES', 'PURCHASE', 'RECEIVED', 'PAYMENT', 'JOURNAL', 'CONTRA') NOT NULL;

-- AlterTable
ALTER TABLE `inventories` ADD COLUMN `paymentType` ENUM('PAID', 'DUE', 'PARTIAL') NOT NULL;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `itemType` ENUM('PRODUCT', 'RAW_MATERIAL') NOT NULL DEFAULT 'PRODUCT';

-- AlterTable
ALTER TABLE `raw_materials` ADD COLUMN `itemType` ENUM('PRODUCT', 'RAW_MATERIAL') NOT NULL DEFAULT 'RAW_MATERIAL';
