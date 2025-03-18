/*
  Warnings:

  - A unique constraint covering the columns `[subCategoryId]` on the table `sub_categoris` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `subCategoryId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryId` to the `sub_categoris` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `subCategoryId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `sub_categoris` ADD COLUMN `subCategoryId` VARCHAR(4) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `sub_categoris_subCategoryId_key` ON `sub_categoris`(`subCategoryId`);

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `sub_categoris`(`subCategoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;
