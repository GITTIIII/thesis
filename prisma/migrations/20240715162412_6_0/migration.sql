/*
  Warnings:

  - You are about to drop the column `educationLevel` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `programYear` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[instituteID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prefix` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `OutlineForm` ADD COLUMN `instituteCommitteeSignUrl` LONGTEXT NULL,
    ADD COLUMN `outlineCommitteeSignUrl` LONGTEXT NULL,
    ADD COLUMN `processPlan` JSON NULL,
    MODIFY `abstract` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `educationLevel`,
    DROP COLUMN `program`,
    DROP COLUMN `programYear`,
    DROP COLUMN `school`,
    ADD COLUMN `degree` VARCHAR(191) NULL,
    ADD COLUMN `instituteID` INTEGER NULL,
    ADD COLUMN `prefix` VARCHAR(191) NOT NULL,
    ADD COLUMN `programID` INTEGER NULL,
    ADD COLUMN `schoolID` INTEGER NULL,
    MODIFY `phone` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Institute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `instituteName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `School` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `schoolName` VARCHAR(191) NOT NULL,
    `instituteID` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Program` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `programName` VARCHAR(191) NOT NULL,
    `programYear` VARCHAR(191) NOT NULL,
    `schoolID` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_instituteID_key` ON `User`(`instituteID`);

-- CreateIndex
CREATE UNIQUE INDEX `User_schoolID_key` ON `User`(`schoolID`);

-- CreateIndex
CREATE UNIQUE INDEX `User_programID_key` ON `User`(`programID`);

-- AddForeignKey
ALTER TABLE `School` ADD CONSTRAINT `School_instituteID_fkey` FOREIGN KEY (`instituteID`) REFERENCES `Institute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Program` ADD CONSTRAINT `Program_schoolID_fkey` FOREIGN KEY (`schoolID`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_instituteID_fkey` FOREIGN KEY (`instituteID`) REFERENCES `Institute`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_schoolID_fkey` FOREIGN KEY (`schoolID`) REFERENCES `School`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_programID_fkey` FOREIGN KEY (`programID`) REFERENCES `Program`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
