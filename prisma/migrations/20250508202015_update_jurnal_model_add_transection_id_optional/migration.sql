-- DropForeignKey
ALTER TABLE `journals` DROP FOREIGN KEY `journals_transectionId_fkey`;

-- DropIndex
DROP INDEX `journals_transectionId_fkey` ON `journals`;

-- AlterTable
ALTER TABLE `journals` MODIFY `transectionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `journals` ADD CONSTRAINT `journals_transectionId_fkey` FOREIGN KEY (`transectionId`) REFERENCES `transaction_info`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
