/*
  Warnings:

  - Made the column `schoolID` on table `Program` required. This step will fail if there are existing NULL values in that column.
  - Made the column `instituteID` on table `School` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Program` DROP FOREIGN KEY `Program_schoolID_fkey`;

-- DropForeignKey
ALTER TABLE `School` DROP FOREIGN KEY `School_instituteID_fkey`;

-- AlterTable
ALTER TABLE `Program` MODIFY `schoolID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `School` MODIFY `instituteID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_instituteID_fkey` FOREIGN KEY (`instituteID`) REFERENCES `Institute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Program` ADD CONSTRAINT `Program_schoolID_fkey` FOREIGN KEY (`schoolID`) REFERENCES `School`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
