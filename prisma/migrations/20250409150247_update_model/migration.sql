/*
  Warnings:

  - You are about to drop the column `raWMaterialId` on the `inventories` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `inventories` DROP FOREIGN KEY `inventories_raw_materials_fk`;

-- DropIndex
DROP INDEX `inventories_raw_materials_fk` ON `inventories`;

-- AlterTable
ALTER TABLE `inventories` DROP COLUMN `raWMaterialId`,
    ADD COLUMN `rawId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `inventories` ADD CONSTRAINT `inventories_raw_materials_fk` FOREIGN KEY (`rawId`) REFERENCES `raw_materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
