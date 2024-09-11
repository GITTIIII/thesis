import { authOptions } from "@/lib/auth";
import { dateShortTH, dayOfMonth, monthTH, yearTH } from "@/lib/day";
import { db } from "@/lib/db";
import { genDocx } from "@/lib/formToDocx";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const thesisExamCommitteeFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Session not found" },
      { status: 404 }
    );
  }

  const thesisExamCommitteeForm = await db.thesisExamCommitteeForm.findFirst({
    where: {
      id: Number(thesisExamCommitteeFormId),
    },
    include: {
      student: {
        include: {
          prefix: true,
          school: true,
          program: true,
        },
      },
      advisor: {
        include: {
          prefix: true,
          institute: true,
        },
      },
      headSchool: {
        include: {
          prefix: true,
          school: true,
          institute: true,
        },
      },
    },
  });
  if (!thesisExamCommitteeForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  var degree = "";
  if (thesisExamCommitteeForm.student.degree?.toLowerCase() == "master") {
    degree = "ปริญญาโท";
  } else if (thesisExamCommitteeForm.student.degree?.toLowerCase() == "doctoral") {
    degree = "ปริญญาเอก";
  }
  const data = {
    createdAt: dateShortTH(thesisExamCommitteeForm.createdAt),
    advisorPrefix: thesisExamCommitteeForm.advisor.prefix?.prefixTH,
    advisorFirstName: thesisExamCommitteeForm.advisor.firstNameTH,
    advisorLastName: thesisExamCommitteeForm.advisor.lastNameTH,
    advisorSignUrl: thesisExamCommitteeForm.advisorSignUrl,
    stdPrefix: thesisExamCommitteeForm.student.prefix?.prefixTH,
    stdFirstName: thesisExamCommitteeForm.student.firstNameTH,
    stdLastName: thesisExamCommitteeForm.student.lastNameTH,
    studentId: thesisExamCommitteeForm.student.username,
    degree: degree,
    schoolName: thesisExamCommitteeForm.student.school?.schoolNameTH,
    programName: thesisExamCommitteeForm.student.program?.programNameTH,
    programYear: thesisExamCommitteeForm.student.program?.programYear,
    committeeMembers: thesisExamCommitteeForm.committeeMembers,
    examDay: dayOfMonth(thesisExamCommitteeForm.examDate),
    examMonth: monthTH(thesisExamCommitteeForm.examDate),
    examYear: yearTH(thesisExamCommitteeForm.examDate),
    headPrefix: thesisExamCommitteeForm.headSchool?.prefix?.prefixTH,
    headFirstName: thesisExamCommitteeForm.headSchool?.firstNameTH,
    headLastName: thesisExamCommitteeForm.headSchool?.lastNameTH,
    headSchool: thesisExamCommitteeForm.headSchool?.school?.schoolNameEN,
    headSignUrl: thesisExamCommitteeForm.headSchoolSignUrl,
  };

  try {
    const file = await genDocx("FM-ENG-GRD-04.docx", data);
    return new NextResponse(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-04.docx",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
