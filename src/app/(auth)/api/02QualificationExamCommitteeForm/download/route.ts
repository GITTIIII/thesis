import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { genDocx } from "@/lib/formToDocx/index";
import { dateShortTH, monthTH, dayOfMonth } from "@/lib/day";
export async function GET(request: NextRequest) {
  const qualificationExamCommitteeFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  // if (!session) {
  //   return NextResponse.json(
  //     { user: null, message: "Session not found" },
  //     { status: 404 }
  //   );
  // }
  const qualificationExamCommitteeForm =
    await db.qualificationExamCommitteeForm.findUnique({
      where: {
        id: Number(qualificationExamCommitteeFormId),
      },
      include: {
        student: {
          include: {
            prefix: true,
            school: true,
            program: true,
          },
        },
      },
    });

  if (!qualificationExamCommitteeForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  const examDay = qualificationExamCommitteeForm.examDay.split("/");
  const data = {
    createdAt: dateShortTH(qualificationExamCommitteeForm.createdAt),
    schoolName: qualificationExamCommitteeForm.student.school?.schoolNameTH,
    programNameTH: qualificationExamCommitteeForm.student.program?.programNameTH,
    programYear: qualificationExamCommitteeForm.student.program?.programYear,
    trimester: qualificationExamCommitteeForm.trimester,
    academicYear: qualificationExamCommitteeForm.academicYear,
    committeeName1: qualificationExamCommitteeForm.committeeName1,
    committeeName2: qualificationExamCommitteeForm.committeeName2,
    committeeName3: qualificationExamCommitteeForm.committeeName3,
    committeeName4: qualificationExamCommitteeForm.committeeName4,
    committeeName5: qualificationExamCommitteeForm.committeeName5,
    prefix: qualificationExamCommitteeForm.student.prefix?.prefixTH,
    firstName: qualificationExamCommitteeForm.student.firstNameTH,
    lastName: qualificationExamCommitteeForm.student.lastNameTH,
    username: qualificationExamCommitteeForm.student.username,
    numberStudent: qualificationExamCommitteeForm.numberStudent,
    examDay: examDay[0],
    examMonth: month[examDay[1] as string],
    examYear: Number(examDay[2]) + 543,
  };
  try {
    const file = await genDocx("FM-ENG-GRD-02.docx", data);
    return new NextResponse(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-02.docx",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 505 });
  }
}
const month: Record<string, string> = {
  "01": "มกราคม",
  "02": "กุมภาพันธ์",
  "03": "มีนาคม",
  "04": "เมษายน",
  "05": "พฤษภาคม",
  "06": "มิถุนายน",
  "07": "กรกฎาคม",
  "08": "สิงหาคม",
  "09": "กันยายน",
  "10": "ตุลาคม",
  "11": "พฤศจิกายน",
  "12": "ธันวาคม",
};
