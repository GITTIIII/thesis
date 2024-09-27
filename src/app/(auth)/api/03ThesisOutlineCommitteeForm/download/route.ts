import { authOptions } from "@/lib/auth";
import { dateShortTH, dayOfMonth, monthTH, yearTH } from "@/lib/day";
import { db } from "@/lib/db";
import { genDocx } from "@/lib/formToDocx";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const thesisOutlineCommitteeFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Session not found" },
      { status: 404 }
    );
  }

  const thesisOutlineCommitteeForm = await db.thesisOutlineCommitteeForm.findFirst({
    where: {
      id: Number(thesisOutlineCommitteeFormId),
    },
    include: {
      student: {
        include: {
          prefix: true,
          school: true,
          program: true,
          advisor: {
            include: {
              prefix: true,
              institute: true,
            },
          },
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
  if (!thesisOutlineCommitteeForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  var degree = "";
  if (thesisOutlineCommitteeForm.student.degree?.toLowerCase() == "master") {
    degree = "ปริญญาโท";
  } else if (thesisOutlineCommitteeForm.student.degree?.toLowerCase() == "doctoral") {
    degree = "ปริญญาเอก";
  }
  const data = {
    createdAt: dateShortTH(thesisOutlineCommitteeForm.createdAt) || "",
    advisorPrefix: thesisOutlineCommitteeForm.student.advisor?.prefix?.prefixTH || "",
    advisorFirstName: thesisOutlineCommitteeForm.student.advisor?.firstNameTH || "",
    advisorLastName: thesisOutlineCommitteeForm.student.advisor?.lastNameTH || "",
    advisorSignUrl: thesisOutlineCommitteeForm.advisorSignUrl || "",
    stdPrefix: thesisOutlineCommitteeForm.student.prefix?.prefixTH || "",
    stdFirstName: thesisOutlineCommitteeForm.student.firstNameTH || "",
    stdLastName: thesisOutlineCommitteeForm.student.lastNameTH || "",
    studentId: thesisOutlineCommitteeForm.student.username || "",
    degree: degree,
    schoolName: thesisOutlineCommitteeForm.student.school?.schoolNameTH || "",
    programName: thesisOutlineCommitteeForm.student.program?.programNameTH || "",
    programYear: thesisOutlineCommitteeForm.student.program?.programYear || "",
    committeeMembers: thesisOutlineCommitteeForm.committeeMembers || "",
    examDay: dayOfMonth(thesisOutlineCommitteeForm.examDate) || "",
    examMonth: monthTH(thesisOutlineCommitteeForm.examDate) || "",
    examYear: yearTH(thesisOutlineCommitteeForm.examDate) || "",
    headPrefix: thesisOutlineCommitteeForm.headSchool?.prefix?.prefixTH || "",
    headFirstName: thesisOutlineCommitteeForm.headSchool?.firstNameTH || "",
    headLastName: thesisOutlineCommitteeForm.headSchool?.lastNameTH || "",
    headSchool: thesisOutlineCommitteeForm.headSchool?.school?.schoolNameEN || "",
    headSignUrl: thesisOutlineCommitteeForm.headSchoolSignUrl || "",
  };

  try {
    const file = await genDocx("FM-ENG-GRD-03.docx", data);
    return new NextResponse(file, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-03.docx",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
