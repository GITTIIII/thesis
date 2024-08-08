import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { useSearchParams } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { genDocx } from "@/lib/formToDocx/index";
import { dateShortTH, monthTH, dayOfMonth } from "@/lib/day";
export async function GET(request: NextRequest) {
  const comprehensiveExamCommitteeFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Session not found" },
      { status: 404 }
    );
  }
  const comprehensiveExamCommitteeForm =
    await db.comprehensiveExamCommitteeForm.findUnique({
      where: {
        id: Number(comprehensiveExamCommitteeFormId),
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

  if (!comprehensiveExamCommitteeForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  const examDay = comprehensiveExamCommitteeForm.examDay.split("/");
  const data = {
    createdAt: dateShortTH(comprehensiveExamCommitteeForm.createdAt),
    schoolName: comprehensiveExamCommitteeForm.student.school?.schoolNameTH,
    programNameTH: comprehensiveExamCommitteeForm.student.program?.programNameTH,
    programYear: comprehensiveExamCommitteeForm.student.program?.programYear,
    trimester: comprehensiveExamCommitteeForm.trimester,
    academicYear: comprehensiveExamCommitteeForm.academicYear,
    committeeName1: comprehensiveExamCommitteeForm.committeeName1,
    committeeName2: comprehensiveExamCommitteeForm.committeeName2,
    committeeName3: comprehensiveExamCommitteeForm.committeeName3,
    committeeName4: comprehensiveExamCommitteeForm.committeeName4,
    committeeName5: comprehensiveExamCommitteeForm.committeeName5,
    prefix: comprehensiveExamCommitteeForm.student.prefix?.prefixTH,
    firstName: comprehensiveExamCommitteeForm.student.firstNameTH,
    lastName: comprehensiveExamCommitteeForm.student.lastNameTH,
    username: comprehensiveExamCommitteeForm.student.username,
    numberStudent: comprehensiveExamCommitteeForm.numberStudent,
    examDay: examDay[0],
    examMonth: month[examDay[1] as string],
    examYear: Number(examDay[2]) + 543,
  };
  try {
    const file = await genDocx("src/lib/formToDocx/docTemplate/FM-ENG-GRD-01.docx", data);
    return new NextResponse(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-01.docx",
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
