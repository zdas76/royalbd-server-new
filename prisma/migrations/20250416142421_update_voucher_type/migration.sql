/*
  Warnings:

  - The values [RECEIVED] on the enum `transaction_info_voucherType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `transaction_info` MODIFY `voucherType` ENUM('SALES', 'PURCHASE', 'RECEIPT', 'PAYMENT', 'JOURNAL', 'CONTRA') NOT NULL,
    MODIFY `paymentType` ENUM('PAID', 'DUE', 'PARTIAL') NULL;
