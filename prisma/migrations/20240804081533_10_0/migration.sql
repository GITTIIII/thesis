/*
  Warnings:

  - You are about to drop the column `approvedExpert` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `coAdvisorID` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `committeeType` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `formLanguage` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `prefix` on the `user` table. All the data in the column will be lost.
  - The values [COMMITTEE] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - The values [HEAD_INSTITUTE,COMMITTEE_OUTLINE,COMMITTEE_INSTITUTE,EXAMING_COMMITTEE] on the enum `User_position` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `thesisStartMonth` to the `OutlineForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thesisStartYear` to the `OutlineForm` table without a default value. This is not possible if the table is not empty.
  - Added the required column `times` to the `OutlineForm` table without a default value. This is not possible if the table is not empty.
  - Made the column `processPlan` on table `outlineform` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `outlineform` DROP FOREIGN KEY `OutlineForm_outlineCommitteeID_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_coAdvisorID_fkey`;

-- DropIndex
DROP INDEX `Institute_instituteNameEN_key` ON `institute`;

-- DropIndex
DROP INDEX `Institute_instituteNameTH_key` ON `institute`;

-- DropIndex
DROP INDEX `Program_programNameEN_key` ON `program`;

-- DropIndex
DROP INDEX `Program_programNameTH_key` ON `program`;

-- DropIndex
DROP INDEX `School_schoolNameEN_key` ON `school`;

-- DropIndex
DROP INDEX `School_schoolNameTH_key` ON `school`;

-- AlterTable
ALTER TABLE `outlineform` ADD COLUMN `thesisStartMonth` VARCHAR(191) NOT NULL,
    ADD COLUMN `thesisStartYear` VARCHAR(191) NOT NULL,
    ADD COLUMN `times` INTEGER NOT NULL,
    MODIFY `processPlan` JSON NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `approvedExpert`,
    DROP COLUMN `coAdvisorID`,
    DROP COLUMN `committeeType`,
    DROP COLUMN `formLanguage`,
    DROP COLUMN `prefix`,
    ADD COLUMN `prefixID` INTEGER NULL,
    MODIFY `role` ENUM('STUDENT', 'ADMIN', 'SUPER_ADMIN') NOT NULL,
    MODIFY `email` VARCHAR(191) NULL,
    MODIFY `position` ENUM('NONE', 'ADVISOR', 'HEAD_OF_SCHOOL', 'HEAD_OF_INSTITUTE') NOT NULL;

-- CreateTable
CREATE TABLE `Prefix` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefixTH` VARCHAR(191) NULL,
    `prefixEN` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComprehensiveExamCommitteeForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `times` INTEGER NOT NULL,
    `trimester` INTEGER NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `committeeName1` VARCHAR(191) NOT NULL,
    `committeeName2` VARCHAR(191) NOT NULL,
    `committeeName3` VARCHAR(191) NOT NULL,
    `committeeName4` VARCHAR(191) NOT NULL,
    `committeeName5` VARCHAR(191) NOT NULL,
    `numberStudent` INTEGER NOT NULL,
    `examDay` VARCHAR(191) NOT NULL,
    `studentID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QualificationExamCommitteeForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `times` INTEGER NOT NULL,
    `trimester` INTEGER NOT NULL,
    `academicYear` VARCHAR(191) NOT NULL,
    `committeeName1` VARCHAR(191) NOT NULL,
    `committeeName2` VARCHAR(191) NOT NULL,
    `committeeName3` VARCHAR(191) NOT NULL,
    `committeeName4` VARCHAR(191) NOT NULL,
    `committeeName5` VARCHAR(191) NOT NULL,
    `numberStudent` INTEGER NOT NULL,
    `examDay` VARCHAR(191) NOT NULL,
    `studentID` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ThesisProgressForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `times` INTEGER NOT NULL,
    `trimester` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `statusComment` VARCHAR(191) NULL,
    `percentage` INTEGER NOT NULL,
    `percentageComment` VARCHAR(191) NULL,
    `issues` VARCHAR(191) NULL,
    `date` VARCHAR(191) NOT NULL,
    `processPlan` JSON NOT NULL,
    `studentID` INTEGER NOT NULL,
    `assessmentResult` VARCHAR(191) NULL,
    `advisorSignUrl` LONGTEXT NULL,
    `dateAdvisor` VARCHAR(191) NULL,
    `headSchoolComment` VARCHAR(191) NULL,
    `headSchoolSignUrl` LONGTEXT NULL,
    `dateHeadSchool` VARCHAR(191) NULL,
    `headSchoolID` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Expert` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefix` VARCHAR(191) NULL,
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SchoolProgram` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SchoolProgram_AB_unique`(`A`, `B`),
    INDEX `_SchoolProgram_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_coAdvisor` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_coAdvisor_AB_unique`(`A`, `B`),
    INDEX `_coAdvisor_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_prefixID_fkey` FOREIGN KEY (`prefixID`) REFERENCES `Prefix`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComprehensiveExamCommitteeForm` ADD CONSTRAINT `ComprehensiveExamCommitteeForm_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QualificationExamCommitteeForm` ADD CONSTRAINT `QualificationExamCommitteeForm_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_outlineCommitteeID_fkey` FOREIGN KEY (`outlineCommitteeID`) REFERENCES `Expert`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThesisProgressForm` ADD CONSTRAINT `ThesisProgressForm_studentID_fkey` FOREIGN KEY (`studentID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ThesisProgressForm` ADD CONSTRAINT `ThesisProgressForm_headSchoolID_fkey` FOREIGN KEY (`headSchoolID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SchoolProgram` ADD CONSTRAINT `_SchoolProgram_A_fkey` FOREIGN KEY (`A`) REFERENCES `Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SchoolProgram` ADD CONSTRAINT `_SchoolProgram_B_fkey` FOREIGN KEY (`B`) REFERENCES `School`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_coAdvisor` ADD CONSTRAINT `_coAdvisor_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_coAdvisor` ADD CONSTRAINT `_coAdvisor_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
