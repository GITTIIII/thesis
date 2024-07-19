/*
  Warnings:

  - You are about to drop the column `instituteName` on the `Institute` table. All the data in the column will be lost.
  - You are about to drop the column `advisorID` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `coAdvisorID` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `programName` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `schoolID` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[instituteNameTH]` on the table `Institute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[instituteNameEN]` on the table `Institute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programNameTH]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programNameEN]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolNameTH]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolNameEN]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `instituteNameEN` to the `Institute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `instituteNameTH` to the `Institute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programNameEN` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `programNameTH` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolNameEN` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schoolNameTH` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OutlineForm` DROP FOREIGN KEY `OutlineForm_advisorID_fkey`;

-- DropForeignKey
ALTER TABLE `OutlineForm` DROP FOREIGN KEY `OutlineForm_coAdvisorID_fkey`;

-- DropForeignKey
ALTER TABLE `Program` DROP FOREIGN KEY `Program_schoolID_fkey`;

-- DropIndex
DROP INDEX `Institute_instituteName_key` ON `Institute`;

-- DropIndex
DROP INDEX `Program_programName_key` ON `Program`;

-- DropIndex
DROP INDEX `School_schoolName_key` ON `School`;

-- AlterTable
ALTER TABLE `Institute` DROP COLUMN `instituteName`,
    ADD COLUMN `instituteNameEN` VARCHAR(191) NOT NULL,
    ADD COLUMN `instituteNameTH` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `OutlineForm` DROP COLUMN `advisorID`,
    DROP COLUMN `coAdvisorID`;

-- AlterTable
ALTER TABLE `Program` DROP COLUMN `programName`,
    DROP COLUMN `schoolID`,
    ADD COLUMN `programNameEN` VARCHAR(191) NOT NULL,
    ADD COLUMN `programNameTH` VARCHAR(191) NOT NULL,
    MODIFY `programYear` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `School` DROP COLUMN `schoolName`,
    ADD COLUMN `schoolNameEN` VARCHAR(191) NOT NULL,
    ADD COLUMN `schoolNameTH` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `firstName`,
    DROP COLUMN `lastName`,
    ADD COLUMN `approvedExpert` VARCHAR(191) NULL,
    ADD COLUMN `coAdvisorID` INTEGER NULL,
    ADD COLUMN `committeeType` VARCHAR(191) NULL,
    ADD COLUMN `firstNameEN` VARCHAR(191) NULL,
    ADD COLUMN `firstNameTH` VARCHAR(191) NULL,
    ADD COLUMN `formLanguage` VARCHAR(191) NULL,
    ADD COLUMN `lastNameEN` VARCHAR(191) NULL,
    ADD COLUMN `lastNameTH` VARCHAR(191) NULL,
    MODIFY `sex` VARCHAR(191) NULL,
    MODIFY `phone` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Institute_instituteNameTH_key` ON `Institute`(`instituteNameTH`);

-- CreateIndex
CREATE UNIQUE INDEX `Institute_instituteNameEN_key` ON `Institute`(`instituteNameEN`);

-- CreateIndex
CREATE UNIQUE INDEX `Program_programNameTH_key` ON `Program`(`programNameTH`);

-- CreateIndex
CREATE UNIQUE INDEX `Program_programNameEN_key` ON `Program`(`programNameEN`);

-- CreateIndex
CREATE UNIQUE INDEX `School_schoolNameTH_key` ON `School`(`schoolNameTH`);

-- CreateIndex
CREATE UNIQUE INDEX `School_schoolNameEN_key` ON `School`(`schoolNameEN`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_coAdvisorID_fkey` FOREIGN KEY (`coAdvisorID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
