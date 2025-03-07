/*
  Warnings:

  - You are about to alter the column `dob` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `VarChar(12)` to `Date`.

*/
-- AlterTable
ALTER TABLE `employees` MODIFY `nid` VARCHAR(20) NULL,
    MODIFY `dob` DATE NOT NULL,
    MODIFY `workingPlase` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `parties` MODIFY `isDeleted` BOOLEAN NOT NULL DEFAULT false;
