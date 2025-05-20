/*
  Warnings:

  - You are about to drop the column `amount` on the `log_Order_Items` table. All the data in the column will be lost.
  - You are about to drop the column `logCategoryId` on the `log_Order_Items` table. All the data in the column will be lost.
  - You are about to drop the column `quantity_area` on the `log_Order_Items` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `log_Order_Items` DROP FOREIGN KEY `log_Order_Items_logOrderId_fkey`;

-- DropIndex
DROP INDEX `log_Order_Items_logOrderId_fkey` ON `log_Order_Items`;

-- AlterTable
ALTER TABLE `log_Order_Items` DROP COLUMN `amount`,
    DROP COLUMN `logCategoryId`,
    DROP COLUMN `quantity_area`,
    ADD COLUMN `addQuantity` DOUBLE NULL,
    ADD COLUMN `craditAmount` DOUBLE NULL,
    ADD COLUMN `debitAmount` DOUBLE NULL,
    ADD COLUMN `lessQuantity` DOUBLE NULL,
    ADD COLUMN `logGradesId` INTEGER NULL,
    MODIFY `logOrderId` INTEGER NULL,
    MODIFY `radis` DOUBLE NULL,
    MODIFY `height` DOUBLE NULL;

-- AlterTable
ALTER TABLE `log_orders` MODIFY `chalanNo` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `log_grade_closing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `logGradesId` INTEGER NOT NULL,
    `closingArea` DOUBLE NOT NULL DEFAULT 0.00,
    `closingAmount` DOUBLE NOT NULL DEFAULT 0.00,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `log_grade_closing_logGradesId_key`(`logGradesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `log_grade_closing` ADD CONSTRAINT `log_grade_closing_logGradesId_fkey` FOREIGN KEY (`logGradesId`) REFERENCES `logGrades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_Order_Items` ADD CONSTRAINT `log_Order_Items_logGradesId_fkey` FOREIGN KEY (`logGradesId`) REFERENCES `logGrades`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `log_Order_Items` ADD CONSTRAINT `log_Order_Items_logOrderId_fkey` FOREIGN KEY (`logOrderId`) REFERENCES `log_orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
