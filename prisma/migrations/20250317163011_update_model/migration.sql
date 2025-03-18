/*
  Warnings:

  - You are about to alter the column `subCategoryId` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `categorryId` on the `sub_categoris` table. All the data in the column will be lost.
  - You are about to drop the column `subCategoryId` on the `sub_categoris` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `sub_categoris` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_subCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `sub_categoris` DROP FOREIGN KEY `sub_categoris_categorryId_fkey`;

-- DropIndex
DROP INDEX `products_subCategoryId_fkey` ON `products`;

-- DropIndex
DROP INDEX `sub_categoris_categorryId_fkey` ON `sub_categoris`;

-- DropIndex
DROP INDEX `sub_categoris_subCategoryId_key` ON `sub_categoris`;

-- AlterTable
ALTER TABLE `products` MODIFY `subCategoryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `sub_categoris` DROP COLUMN `categorryId`,
    DROP COLUMN `subCategoryId`,
    ADD COLUMN `categoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `sub_categoris` ADD CONSTRAINT `sub_categoris_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `sub_categoris`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
