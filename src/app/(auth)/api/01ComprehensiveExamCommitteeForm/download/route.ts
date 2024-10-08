import { authOptions } from "@/lib/auth";
import { dateShortTH, dayOfMonth, monthTH, yearTH } from "@/lib/day";
import { db } from "@/lib/db";
import { genDocx } from "@/lib/formToDocx";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

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
        headSchool: {
          include: {
            prefix: true,
            institute: true,
            school: true,
          },
        },
      },
    });

  if (!comprehensiveExamCommitteeForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  // const examDay = comprehensiveExamCommitteeForm.examDay.split("/");
  const data = {
    createdAt: dateShortTH(comprehensiveExamCommitteeForm.createdAt) || "",
    schoolName: comprehensiveExamCommitteeForm.student.school?.schoolNameTH || "",
    programNameTH: comprehensiveExamCommitteeForm.student.program?.programNameTH || "",
    programYear: comprehensiveExamCommitteeForm.student.program?.programYear || "",
    times: comprehensiveExamCommitteeForm.times || "",
    trimester: comprehensiveExamCommitteeForm.trimester || "",
    academicYear: comprehensiveExamCommitteeForm.academicYear || "",
    committeeName1: comprehensiveExamCommitteeForm.committeeName1 || "",
    committeeName2: comprehensiveExamCommitteeForm.committeeName2 || "",
    committeeName3: comprehensiveExamCommitteeForm.committeeName3 || "",
    committeeName4: comprehensiveExamCommitteeForm.committeeName4 || "",
    committeeName5: comprehensiveExamCommitteeForm.committeeName5 || "",
    stdPrefix: comprehensiveExamCommitteeForm.student.prefix?.prefixTH || "",
    stdFirstName: comprehensiveExamCommitteeForm.student.firstNameTH || "",
    stdLastName: comprehensiveExamCommitteeForm.student.lastNameTH || "",
    username: comprehensiveExamCommitteeForm.student.username || "",
    numberStudent: comprehensiveExamCommitteeForm.numberStudent || "",
    examDay: dayOfMonth(comprehensiveExamCommitteeForm.examDay) || "",
    examMonth: monthTH(comprehensiveExamCommitteeForm.examDay) || "",
    examYear: yearTH(comprehensiveExamCommitteeForm.examDay) || "",
    headSignUrl: comprehensiveExamCommitteeForm.headSchoolSignUrl || "",
    headPrefix: comprehensiveExamCommitteeForm.headSchool?.prefix?.prefixTH || "",
    headFirstName: comprehensiveExamCommitteeForm.headSchool?.firstNameTH || "",
    headLastName: comprehensiveExamCommitteeForm.headSchool?.lastNameTH || "",
    headSchoolSchool:
      comprehensiveExamCommitteeForm.headSchool?.school?.schoolNameTH || "",
  };

  try {
    const file = await genDocx("FM-ENG-GRD-01.docx", data);
    return new NextResponse(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-01.docx",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
