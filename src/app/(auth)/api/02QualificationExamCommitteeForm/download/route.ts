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
        headSchool: {
          include: {
            prefix: true,
            institute: true,
            school: true,
          },
        },
      },
    });

  if (!qualificationExamCommitteeForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  const examDay = new Date(qualificationExamCommitteeForm.examDay)
    .toLocaleDateString("th")
    .split("/");
  const data = {
    createdAt: dateShortTH(qualificationExamCommitteeForm.createdAt) || "",
    schoolName: qualificationExamCommitteeForm.student.school?.schoolNameTH || "",
    programNameTH: qualificationExamCommitteeForm.student.program?.programNameTH || "",
    programYear: qualificationExamCommitteeForm.student.program?.programYear || "",
    times: qualificationExamCommitteeForm.times || "",
    trimester: qualificationExamCommitteeForm.trimester || "",
    academicYear: qualificationExamCommitteeForm.academicYear || "",
    committeeName1: qualificationExamCommitteeForm.committeeName1 || "",
    committeeName2: qualificationExamCommitteeForm.committeeName2 || "",
    committeeName3: qualificationExamCommitteeForm.committeeName3 || "",
    committeeName4: qualificationExamCommitteeForm.committeeName4 || "",
    committeeName5: qualificationExamCommitteeForm.committeeName5 || "",
    prefix: qualificationExamCommitteeForm.student.prefix?.prefixTH || "",
    firstName: qualificationExamCommitteeForm.student.firstNameTH || "",
    lastName: qualificationExamCommitteeForm.student.lastNameTH || "",
    username: qualificationExamCommitteeForm.student.username || "",
    numberStudent: qualificationExamCommitteeForm.numberStudent || "",
    examDay: examDay[0] || "",
    examMonth: month[examDay[1]] || "",
    examYear: examDay[2] || "",
    headSignUrl: qualificationExamCommitteeForm.headSchoolSignUrl || "",
    headPrefix: qualificationExamCommitteeForm.headSchool?.prefix?.prefixTH || "",
    headFirstName: qualificationExamCommitteeForm.headSchool?.firstNameTH || "",
    headLastName: qualificationExamCommitteeForm.headSchool?.lastNameTH || "",
    headSchoolSchool:
      qualificationExamCommitteeForm.headSchool?.school?.schoolNameTH || "",
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
  "1": "มกราคม",
  "2": "กุมภาพันธ์",
  "3": "มีนาคม",
  "4": "เมษายน",
  "5": "พฤษภาคม",
  "6": "มิถุนายน",
  "7": "กรกฎาคม",
  "8": "สิงหาคม",
  "9": "กันยายน",
  "10": "ตุลาคม",
  "11": "พฤศจิกายน",
  "12": "ธันวาคม",
};
