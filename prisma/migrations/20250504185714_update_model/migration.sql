/*
  Warnings:

  - You are about to alter the column `unitePrice` on the `inventories` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.
  - You are about to alter the column `quantityAdd` on the `inventories` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.
  - You are about to alter the column `quantityLess` on the `inventories` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.
  - You are about to alter the column `discount` on the `inventories` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Double`.

*/
-- AlterTable
ALTER TABLE `inventories` ADD COLUMN `creditAmount` DOUBLE NULL,
    ADD COLUMN `debitAmount` DOUBLE NULL,
    MODIFY `unitePrice` DOUBLE NOT NULL DEFAULT 0.00,
    MODIFY `quantityAdd` DOUBLE NULL DEFAULT 0.00,
    MODIFY `quantityLess` DOUBLE NULL DEFAULT 0.00,
    MODIFY `discount` DOUBLE NULL DEFAULT 0.00;
