/*
  Warnings:

  - You are about to drop the `AccountMainPiller` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `account_items` DROP FOREIGN KEY `account_items_accountMainPillerId_fkey`;

-- DropIndex
DROP INDEX `account_items_accountMainPillerId_fkey` ON `account_items`;

-- DropTable
DROP TABLE `AccountMainPiller`;

-- CreateTable
CREATE TABLE `account_pillers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pillerName` VARCHAR(191) NOT NULL,
    `pillerId` VARCHAR(2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `account_pillers_id_key`(`id`),
    UNIQUE INDEX `account_pillers_pillerId_key`(`pillerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `account_items` ADD CONSTRAINT `account_items_accountMainPillerId_fkey` FOREIGN KEY (`accountMainPillerId`) REFERENCES `account_pillers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
