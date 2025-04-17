/*
  Warnings:

  - You are about to alter the column `bankTxId` on the `TransactionInfo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `TransactionInfo` MODIFY `bankTxId` INTEGER NULL;

-- AlterTable
ALTER TABLE `employees` MODIFY `dob` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `TransactionInfo` ADD CONSTRAINT `TransactionInfo_bankTxId_fkey` FOREIGN KEY (`bankTxId`) REFERENCES `BankTransaction`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
