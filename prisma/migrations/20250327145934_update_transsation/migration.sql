/*
  Warnings:

  - Added the required column `voucherType` to the `TransactionInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TransactionInfo` ADD COLUMN `voucherType` ENUM('SELL', 'PURCHASE', 'RECEIVED', 'PAYMENT', 'JOURNAL', 'CONTRA') NOT NULL;
