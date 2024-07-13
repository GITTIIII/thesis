/*
  Warnings:

  - You are about to alter the column `instituteCommitteeStatus` on the `OutlineForm` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `outlineCommitteeStatus` on the `OutlineForm` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - Added the required column `abstract` to the `OutlineForm` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OutlineForm` ADD COLUMN `abstract` VARCHAR(191) NOT NULL,
    MODIFY `instituteCommitteeStatus` VARCHAR(191) NULL,
    MODIFY `outlineCommitteeStatus` VARCHAR(191) NULL;
