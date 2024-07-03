/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `institute` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `supervisorId` on the `User` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(1))`.
  - Added the required column `educationLevel` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_supervisorId_fkey`;

-- AlterTable
ALTER TABLE `User` DROP PRIMARY KEY,
    DROP COLUMN `institute`,
    DROP COLUMN `supervisorId`,
    ADD COLUMN `advisorID` INTEGER NULL,
    ADD COLUMN `educationLevel` VARCHAR(191) NOT NULL,
    ADD COLUMN `formState` INTEGER NULL,
    ADD COLUMN `position` ENUM('NONE', 'ADVISOR', 'HEAD_INSTITUTE', 'COMMOTTEE_OUTLINE', 'COMMOTTEE_INSTITUTE', 'COMMOTTEE_EXAMING') NOT NULL,
    ADD COLUMN `profileUrl` LONGTEXT NULL,
    ADD COLUMN `program` VARCHAR(191) NOT NULL,
    ADD COLUMN `programYear` VARCHAR(191) NULL,
    ADD COLUMN `signatureUrl` LONGTEXT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `role` ENUM('STUDENT', 'COMMOTTEE', 'ADMIN', 'SUPER_ADMIN') NOT NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- CreateTable
CREATE TABLE `OutlineForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `thesisNameTH` VARCHAR(191) NOT NULL,
    `thesisNameEN` VARCHAR(191) NOT NULL,
    `committeeOutlineStatus` VARCHAR(191) NULL,
    `committeeOutlineComment` VARCHAR(191) NULL,
    `committeeOutlineSignature` LONGTEXT NULL,
    `dateCommitteeOutlineSign` VARCHAR(191) NULL,
    `committeeInstituteStatus` VARCHAR(191) NULL,
    `committeeInstituteComment` VARCHAR(191) NULL,
    `committeeInstituteSignature` LONGTEXT NULL,
    `dateCommitteeInstituteSign` VARCHAR(191) NULL,
    `studentID` INTEGER NOT NULL,
    `advisorID` INTEGER NOT NULL,
    `coAdvisorID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_advisorID_fkey` FOREIGN KEY (`advisorID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_advisorID_fkey` FOREIGN KEY (`advisorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_coAdvisorID_fkey` FOREIGN KEY (`coAdvisorID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
