/*
  Warnings:

  - You are about to drop the `LogGrades` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LogGrades` DROP FOREIGN KEY `LogGrades_categoryId_fkey`;

-- DropTable
DROP TABLE `LogGrades`;

-- CreateTable
CREATE TABLE `logGrades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `gradeName` VARCHAR(50) NOT NULL,
    `minRadius` FLOAT NOT NULL,
    `maxRadius` FLOAT NOT NULL,
    `unitePrice` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `logGrades` ADD CONSTRAINT `logGrades_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `logcategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
