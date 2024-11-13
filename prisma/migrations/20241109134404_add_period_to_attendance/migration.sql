/*
  Warnings:

  - You are about to drop the column `present` on the `Attendance` table. All the data in the column will be lost.
  - Added the required column `classId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gradeId` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `period` to the `Attendance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supervisorId` to the `Attendance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "present",
ADD COLUMN     "absentIds" TEXT[],
ADD COLUMN     "classId" INTEGER NOT NULL,
ADD COLUMN     "gradeId" INTEGER NOT NULL,
ADD COLUMN     "period" INTEGER NOT NULL,
ADD COLUMN     "presentIds" TEXT[],
ADD COLUMN     "supervisorId" TEXT NOT NULL,
ALTER COLUMN "studentId" DROP NOT NULL,
ALTER COLUMN "lessonId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
