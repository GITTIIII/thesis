import { authOptions } from "@/lib/auth";
import { dateShortTH } from "@/lib/day";
import { db } from "@/lib/db";
import { genDocx } from "@/lib/formToDocx";
import { genDocProcessPlan } from "@/lib/formToDocx/processPlan";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";

export async function GET(request: NextRequest) {
  const outlineFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
  }
  const outlineForm = await db.outlineForm.findFirst({
    where: {
      id: Number(outlineFormId),
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
      outlineCommittee: true,
      instituteCommittee: {
        include: {
          prefix: true,
        },
      },
    },
  });
  if (!outlineForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  var degree = "";
  if (outlineForm.student.degree?.toLowerCase() == "master") {
    degree = "ปริญญาโท";
  } else if (outlineForm.student.degree?.toLowerCase() == "doctoral") {
    degree = "ปริญญาเอก";
  }

  const outlineCommitteeCommentP = {
    status: outlineForm.outlineCommitteeStatus === "อนุมัติ" ? "☑" : "☐",
    comment: outlineForm.outlineCommitteeStatus === "อนุมัติ" ? outlineForm.outlineCommitteeComment : "",
  };
  const outlineCommitteeCommentF = {
    status: outlineForm.outlineCommitteeStatus !== "อนุมัติ" ? "☑" : "☐",
    comment: outlineForm.outlineCommitteeStatus !== "อนุมัติ" ? outlineForm.outlineCommitteeComment : "",
  };
  const data = {
    createdAt: dateShortTH(outlineForm.createdAt) || "",
    advisorPrefix: outlineForm.student.prefix?.prefixTH || "",
    advisorFirstName: outlineForm.student.advisor?.firstNameTH || "",
    advisorLastName: outlineForm.student.advisor?.lastNameTH || "",
    advisorSignUrl: outlineForm.student.advisor?.signatureUrl || "",
    stdPrefix: outlineForm.student.prefix?.prefixTH || "",
    stdFirstName: outlineForm.student.firstNameTH || "",
    stdLastName: outlineForm.student.lastNameTH || "",
    studentId: outlineForm.student.username || "",
    stdSignUrl: outlineForm.student.signatureUrl || "",
    degree: degree || "",
    schoolName: outlineForm.student.school?.schoolNameTH || "",
    programName: outlineForm.student.program?.programNameTH,
    programYear: outlineForm.student.program?.programYear || "",
    thesisNameTH: outlineForm.thesisNameTH || "",
    thesisNameEN: outlineForm.thesisNameEN || "",
    occP: outlineCommitteeCommentP || "",
    occF: outlineCommitteeCommentF || "",
    OCSignUrl: outlineForm.outlineCommitteeSignUrl || "",
    outlineCommitteeName:
      `${outlineForm.outlineCommittee?.prefix} ${outlineForm.outlineCommittee?.firstName} ${outlineForm.outlineCommittee?.lastName}` || "",
    dateOutlineCommitteeSign: dateShortTH(outlineForm.dateOutlineCommitteeSign!) || "",
    date: dateShortTH(outlineForm.date) || "",
    times: outlineForm.times || "",
    instituteCommitteeStatus:
      `${outlineForm.instituteCommitteeStatus === "อนุมัติ" ? "☑" : "☐"} อนุมัติ ${
        outlineForm.instituteCommitteeStatus !== "อนุมัติ" ? "☑" : "☐"
      } ไม่อนุมัติ` || "",
    instituteCommitteeComment: outlineForm.instituteCommitteeComment || "",
    ICSignUrl: outlineForm.instituteCommitteeSignUrl || "",
    instituteCommitteeName:
      `${outlineForm.instituteCommittee?.prefix?.prefixTH} ${outlineForm.instituteCommittee?.firstNameTH} ${outlineForm.instituteCommittee?.lastNameTH}` ||
      "",
    dateInstituteCommitteeSign: dateShortTH(outlineForm.dateInstituteCommitteeSign!) || "",
    thesisStartMonth: outlineForm.thesisStartMonth || "",
    thesisStartYear: outlineForm.thesisStartYear || "",
  };
  try {
    const doc1 = await genDocx("FM-ENG-GRD-05-01.docx", data);
    var doc2;
    if (outlineForm.processPlan && typeof outlineForm.processPlan === "object" && Array.isArray(outlineForm.processPlan)) {
      const processPlanObject = outlineForm.processPlan as Prisma.JsonArray;
      doc2 = await genDocProcessPlan(
        {
          date: {
            month: outlineForm.thesisStartMonth,
            year: outlineForm.thesisStartYear,
          },
          signature: {
            img: outlineForm.student.signatureUrl,
            name: `${data.stdPrefix}${data.stdFirstName} ${data.stdLastName}`,
            date: dateShortTH(outlineForm.date),
          },
          processPlan: processPlanObject,
        },
        "FM-ENG-GRD-05-00"
      );
    }
    const zip = new JSZip();
    zip.file(`${"FM-ENG-GRD-05_1"}.docx`, doc1);
    zip.file(`${"FM-ENG-GRD-05_2"}.docx`, doc2!);
    const filezip = await zip.generateAsync({ type: "blob" }).then((content) => {
      return content;
    });
    return new NextResponse(filezip, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-05.zip",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
