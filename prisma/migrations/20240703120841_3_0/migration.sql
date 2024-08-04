/*
  Warnings:

  - You are about to drop the column `committeeInstituteSignature` on the `OutlineForm` table. All the data in the column will be lost.
  - You are about to drop the column `committeeOutlineSignature` on the `OutlineForm` table. All the data in the column will be lost.
  - The values [COMMOTTEE] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.
  - The values [COMMOTTEE_OUTLINE,COMMOTTEE_INSTITUTE,COMMOTTEE_EXAMING] on the enum `User_position` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `OutlineForm` DROP COLUMN `committeeInstituteSignature`,
    DROP COLUMN `committeeOutlineSignature`,
    ADD COLUMN `committeeInstituteID` INTEGER NULL,
    ADD COLUMN `committeeOutlineID` INTEGER NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('STUDENT', 'COMMITTEE', 'ADMIN', 'SUPER_ADMIN') NOT NULL,
    MODIFY `position` ENUM('NONE', 'ADVISOR', 'HEAD_INSTITUTE', 'COMMITTEE_OUTLINE', 'COMMITTEE_INSTITUTE', 'EXAMING_COMMITTEE') NOT NULL;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_committeeOutlineID_fkey` FOREIGN KEY (`committeeOutlineID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutlineForm` ADD CONSTRAINT `OutlineForm_committeeInstituteID_fkey` FOREIGN KEY (`committeeInstituteID`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
