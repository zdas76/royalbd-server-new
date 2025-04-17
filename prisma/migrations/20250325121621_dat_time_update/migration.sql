/*
  Warnings:

  - You are about to alter the column `dob` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `employees` MODIFY `dob` DATETIME NOT NULL;
