/*
  Warnings:

  - You are about to drop the column `partyOrcustomerId` on the `TransactionInfo` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `TransactionInfo` DROP FOREIGN KEY `journals_customerId_fk`;

-- DropForeignKey
ALTER TABLE `TransactionInfo` DROP FOREIGN KEY `journals_partyId_fk`;

-- DropIndex
DROP INDEX `journals_customerId_fk` ON `TransactionInfo`;

-- AlterTable
ALTER TABLE `TransactionInfo` DROP COLUMN `partyOrcustomerId`,
    ADD COLUMN `customerId` INTEGER NULL,
    ADD COLUMN `partyId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `TransactionInfo` ADD CONSTRAINT `TransactionInfo_partyId_fkey` FOREIGN KEY (`partyId`) REFERENCES `parties`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TransactionInfo` ADD CONSTRAINT `TransactionInfo_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
