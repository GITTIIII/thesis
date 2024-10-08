import { authOptions } from "@/lib/auth";
import { dateLongTH, dateShortTH } from "@/lib/day";
import { db } from "@/lib/db";
import { genDocx } from "@/lib/formToDocx";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const thesisExamAppointmentFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Session not found" },
      { status: 404 }
    );
  }

  const thesisExamAppointmentForm = await db.thesisExamAppointmentForm.findFirst({
    where: {
      id: Number(thesisExamAppointmentFormId),
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
            },
          },
        },
      },
      headSchool: {
        include: {
          prefix: true,
        },
      },
    },
  });
  const outlineForm = await db.outlineForm.findFirst({
    where: {
      studentID: thesisExamAppointmentForm?.student.id,
      formStatus: "อนุมัติ",
    },
  });
  if (!thesisExamAppointmentForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }

  const data = {
    advName:
      `${thesisExamAppointmentForm.student.advisor?.prefix?.prefixTH}${thesisExamAppointmentForm.student.advisor?.firstNameTH} ${thesisExamAppointmentForm.student.advisor?.lastNameTH}` ||
      "",
    nameStd:
      `${thesisExamAppointmentForm.student.prefix?.prefixTH}${thesisExamAppointmentForm.student.firstNameTH} ${thesisExamAppointmentForm.student.lastNameTH}` ||
      "",
    stdId: thesisExamAppointmentForm.student.username || "",
    schoolName: thesisExamAppointmentForm.student.school?.schoolNameTH || "",
    programName: thesisExamAppointmentForm.student.program?.programNameTH || "",
    trimester: thesisExamAppointmentForm.trimester || "",
    AY: thesisExamAppointmentForm.academicYear || "",
    GPA: thesisExamAppointmentForm.gpa || "",
    credits: thesisExamAppointmentForm.credits || "",
    date: dateLongTH(thesisExamAppointmentForm.date) || "",
    thesisNameTH: outlineForm?.thesisNameTH || "",
    thesisNameEN: outlineForm?.thesisNameEN || "",
    dateExam: dateLongTH(thesisExamAppointmentForm.dateExam) || "",
    stdSignUrl: thesisExamAppointmentForm.student.signatureUrl || "",
    stddate: dateShortTH(thesisExamAppointmentForm.createdAt),
    has01: thesisExamAppointmentForm.has01Certificate ? "☑" : "☐",
    has02: thesisExamAppointmentForm.has02Certificate ? "☑" : "☐",
    has03: thesisExamAppointmentForm.has03Certificate ? "☑" : "☐",
    hasOther: thesisExamAppointmentForm.hasOtherCertificate ? "☑" : "☐",
    presentation: thesisExamAppointmentForm.presentationFund ? "☑" : "☐",
    researchProject: thesisExamAppointmentForm.researchProjectFund ? "☑" : "☐",
    Turnitin: thesisExamAppointmentForm.turnitinVerified ? "☑" : "☐",
    advSign: thesisExamAppointmentForm.advisorSignUrl || "",
    dateAdvisor: dateShortTH(thesisExamAppointmentForm.dateAdvisor!) || "",
    headComment: thesisExamAppointmentForm.headSchoolComment || "",
    headSign: thesisExamAppointmentForm.headSchoolSignUrl || "",
    headName:
      `${thesisExamAppointmentForm.headSchool?.prefix?.prefixTH}${thesisExamAppointmentForm.headSchool?.firstNameTH} ${thesisExamAppointmentForm.headSchool?.lastNameTH}` ||
      "",
    headdate: dateShortTH(thesisExamAppointmentForm.dateHeadSchool!) || "",
  };
  console.log(thesisExamAppointmentFormId);
  try {
    const doc = await genDocx("FM-ENG-GRD-07.docx", data, 5 / 1.5, 2 / 1.5);

    return new NextResponse(doc, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-07.doc",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
