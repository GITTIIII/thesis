/*
  Warnings:

  - You are about to drop the column `committeeInstituteComment` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `committeeInstituteID` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `committeeInstituteStatus` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `committeeOutlineComment` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `committeeOutlineID` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `committeeOutlineStatus` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `dateCommitteeInstituteSign` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `dateCommitteeOutlineSign` on the `OutlineForm` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `OutlineForm` DROP FOREIGN KEY `OutlineForm_committeeInstituteID_fkey`;

-- DropForeignKey
ALTER TABLE `OutlineForm` DROP FOREIGN KEY `OutlineForm_committeeOutlineID_fkey`;

-- AlterTable
ALTER TABLE `OutlineForm` DROP COLUMN `committeeInstituteComment`,
    DROP COLUMN `committeeInstituteID`,
    DROP COLUMN `committeeInstituteStatus`,
    DROP COLUMN `committeeOutlineComment`,
    DROP COLUMN `committeeOutlineID`,
    DROP COLUMN `committeeOutlineStatus`,
    DROP COLUMN `dateCommitteeInstituteSign`,
    DROP COLUMN `dateCommitteeOutlineSign`,
    ADD COLUMN `dateInstituteCommitteeSign` VARCHAR(191) NULL,
    ADD COLUMN `dateOutlineCommitteeSign` VARCHAR(191) NULL,
    ADD COLUMN `instituteCommitteeComment` VARCHAR(191) NULL,
    ADD COLUMN `instituteCommitteeID` INTEGER NULL,
    ADD COLUMN `instituteCommitteeStatus` BOOLEAN NULL,
    ADD COLUMN `outlineCommitteeComment` VARCHAR(191) NULL,
    ADD COLUMN `outlineCommitteeID` INTEGER NULL,
    ADD COLUMN `outlineCommitteeStatus` BOOLEAN NULL;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_outlineCommitteeID_fkey` FOREIGN KEY (`outlineCommitteeID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_instituteCommitteeID_fkey` FOREIGN KEY (`instituteCommitteeID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
