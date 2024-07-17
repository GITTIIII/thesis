/*
  Warnings:

  - A unique constraint covering the columns `[instituteName]` on the table `Institute` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[programName]` on the table `Program` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[schoolName]` on the table `School` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Institute_instituteName_key` ON `Institute`(`instituteName`);

-- CreateIndex
CREATE UNIQUE INDEX `Program_programName_key` ON `Program`(`programName`);

-- CreateIndex
CREATE UNIQUE INDEX `School_schoolName_key` ON `School`(`schoolName`);
