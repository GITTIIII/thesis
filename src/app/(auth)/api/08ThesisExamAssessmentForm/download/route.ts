import { authOptions } from "@/lib/auth";
import { dateLongTH, dateShortTH } from "@/lib/day";
import { db } from "@/lib/db";
import { genDocx } from "@/lib/formToDocx";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log(123);
  const thesisExamAssessmentFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Session not found" },
      { status: 404 }
    );
  }

  const thesisExamAssessmentForm = await db.thesisExamAssessmentForm.findFirst({
    where: {
      id: Number(thesisExamAssessmentFormId),
    },
    include: {
      student: {
        include: {
          prefix: true,
          school: true,
          program: true,
          institute: true,
          advisor: {
            include: {
              prefix: true,
            },
          },
        },
      },
      headOfCommittee: true,
      instituteCommittee: {
        include: {
          prefix: true,
        },
      },
    },
  });

  if (!thesisExamAssessmentForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  const outlineForm = await db.outlineForm.findFirst({
    where: {
      studentID: thesisExamAssessmentForm?.student.id,
      formStatus: "อนุมัติ",
    },
  });
  const committees = thesisExamAssessmentForm.committees as any[];
  const expert = await db.expert.findMany({
    where: {
      id: {
        in: [
          committees[0].committee.committeeID,
          committees[1].committee.committeeID,
          committees[2].committee.committeeID,
        ],
      },
    },
  });
  const sortedExperts = [
    committees[0].committee.committeeID,
    committees[1].committee.committeeID,
    committees[2].committee.committeeID,
  ].map((id) => expert.find((expert) => expert.id === id));
  const data = {
    studentName: `${thesisExamAssessmentForm.student.prefix?.prefixTH}${thesisExamAssessmentForm.student.firstNameTH} ${thesisExamAssessmentForm.student.lastNameTH}`,
    studentId: thesisExamAssessmentForm.student.username || "",
    studentEmail: thesisExamAssessmentForm.student.email || "",
    studentTelephone: thesisExamAssessmentForm.student.phone || "",
    studentSchool: thesisExamAssessmentForm.student.school?.schoolNameTH || "",
    studentInstitute: thesisExamAssessmentForm.student.institute?.instituteNameTH || "",
    thesisTH: outlineForm?.thesisNameTH || "",
    thesisEN: outlineForm?.thesisNameEN || "",
    disclosed: thesisExamAssessmentForm.disClosed ? "☑" : "☐",
    nondisclosure: !thesisExamAssessmentForm.disClosed ? "☑" : "☐",
    examinationDate: dateLongTH(thesisExamAssessmentForm.examDate),
    excellent: thesisExamAssessmentForm.result === "ดีมาก" ? "☑" : "☐",
    pass: thesisExamAssessmentForm.result === "ผ่าน" ? "☑" : "☐",
    fail: thesisExamAssessmentForm.result === "ไม่ผ่าน" ? "☑" : "☐",
    revise: thesisExamAssessmentForm.reviseTitle ? "☑" : "☐",
    newThesisTH: thesisExamAssessmentForm.newThesisNameTH || "",
    newThesisEN: thesisExamAssessmentForm.newThesisNameEN || "",
    Comments:
      thesisExamAssessmentForm.result === "ดีมาก"
        ? `การนำเสนอ: ${thesisExamAssessmentForm.presentationComment} / การอธิบาย: ${thesisExamAssessmentForm.explanationComment} / การตอบคำถาม: ${thesisExamAssessmentForm.answerQuestionComment}`
        : thesisExamAssessmentForm.failComment || "",
    headComSignUrl: thesisExamAssessmentForm.headOfCommitteeSignUrl || "",
    headComName: `${thesisExamAssessmentForm.headOfCommittee?.prefix}${thesisExamAssessmentForm.headOfCommittee?.firstName} ${thesisExamAssessmentForm.headOfCommittee?.lastName}`,
    advisorSignUrl: thesisExamAssessmentForm.advisorSignUrl,
    advisorName: `${thesisExamAssessmentForm.student.advisor?.prefix?.prefixTH}${thesisExamAssessmentForm.student.advisor?.firstNameTH} ${thesisExamAssessmentForm.student.advisor?.lastNameTH}`,
    Committee: [
      {
        signUrl: committees[0].committee.signatureUrl || "",
        name: `${sortedExperts[0]!.prefix}${sortedExperts[0]!.firstName} ${
          sortedExperts[0]!.lastName
        }`,
      },
      {
        signUrl: committees[1].committee.signatureUrl || "",
        name: `${sortedExperts[1]!.prefix}${sortedExperts[1]!.firstName} ${
          sortedExperts[1]!.lastName
        }`,
      },
      {
        signUrl: committees[2].committee.signatureUrl || "",
        name: `${sortedExperts[2]!.prefix}${sortedExperts[2]!.firstName} ${
          sortedExperts[2]!.lastName
        }`,
      },
    ],
    meetingNo: thesisExamAssessmentForm.times || "",
    date: dateLongTH(thesisExamAssessmentForm.date),
    instituteCommitteeComment: thesisExamAssessmentForm.instituteCommitteeComment || "",
    approve: thesisExamAssessmentForm.instituteCommitteeStatus === "เห็นชอบ" ? "☑" : "☐",
    disapprove:
      thesisExamAssessmentForm.instituteCommitteeStatus === "ไม่เห็นชอบ" ? "☑" : "☐",
    instituteComSignUrl: thesisExamAssessmentForm.instituteCommitteeSignUrl || "",
    instituteComName: `${thesisExamAssessmentForm.instituteCommittee?.prefix?.prefixTH}${thesisExamAssessmentForm.instituteCommittee?.firstNameTH} ${thesisExamAssessmentForm.instituteCommittee?.lastNameTH}`,
    dateInstituteComSign:
      dateLongTH(thesisExamAssessmentForm.dateInstituteCommitteeSign!) || "",
  };
  try {
    const doc = await genDocx(
      "23-Thesis-Examination-Assessment Form.docx",
      data,
      5 / 1.5,
      2 / 1.5
    );

    return new NextResponse(doc, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition":
          "attachment; filename=23-Thesis-Examination-Assessment Form.doc",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
