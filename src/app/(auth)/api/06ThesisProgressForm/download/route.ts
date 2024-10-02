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
  const thesisProgressFormId = request.nextUrl.searchParams.get("id");
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { user: null, message: "Session not found" },
      { status: 404 }
    );
  }
  const thesisProgressForm = await db.thesisProgressForm.findFirst({
    where: {
      id: Number(thesisProgressFormId),
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
  if (!thesisProgressForm) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 });
  }
  var degree = "";
  if (thesisProgressForm.student.degree?.toLowerCase() == "master") {
    degree = "ปริญญาโท";
  } else if (thesisProgressForm.student.degree?.toLowerCase() == "doctoral") {
    degree = "ปริญญาเอก";
  }

  const data = {
    times: thesisProgressForm.times || "",
    trimester: thesisProgressForm.trimester || "",
    nameAdv:
      `${thesisProgressForm.student.advisor?.prefix?.prefixTH}${thesisProgressForm.student.advisor?.firstNameTH} ${thesisProgressForm.student.advisor?.lastNameTH}` ||
      "",
    nameStd:
      `${thesisProgressForm.student.prefix?.prefixTH}${thesisProgressForm.student.firstNameTH} ${thesisProgressForm.student.lastNameTH}` ||
      "",
    stdId: thesisProgressForm.student.username || "",
    schoolName: thesisProgressForm.student.school?.schoolNameTH || "",
    programName: thesisProgressForm.student.program?.programNameTH || "",
    programYear: thesisProgressForm.student.program?.programYear || "",
    degree: degree,
    status1: thesisProgressForm.status === "เป็นไปตามแผนที่วางไว้ทุกประการ" ? "☑" : "☐",
    status2: thesisProgressForm.status === "มีการเปลี่ยนแผนที่วางไว้" ? "☑" : "☐",
    statusComment:
      thesisProgressForm.status === "มีการเปลี่ยนแผนที่วางไว้"
        ? thesisProgressForm.statusComment
        : " ",
    percentage: thesisProgressForm.percentage || "",
    percentageComment: thesisProgressForm.percentageComment || "",
    issues: thesisProgressForm.issues || "",
    stdSignUrl: thesisProgressForm.student.signatureUrl || "",
    dateStd: dateShortTH(thesisProgressForm.date) || "",
    assessmentResult: thesisProgressForm.assessmentResult || "",
    advSignUrl: thesisProgressForm.advisorSignUrl || "",
    dateadv: dateShortTH(thesisProgressForm.dateAdvisor!) || "",
    headSchoolComment: thesisProgressForm.headSchoolComment || "",
    headSignUrl: thesisProgressForm.headSchoolSignUrl || "",
    nameHead:
      `${thesisProgressForm.headSchool?.prefix?.prefixTH}${thesisProgressForm.headSchool?.firstNameTH} ${thesisProgressForm.headSchool?.lastNameTH}` ||
      "",
    dateHead: dateShortTH(thesisProgressForm.dateHeadSchool!) || "",
  };
  try {
    const doc1 = await genDocx("FM-ENG-GRD-06.docx", data);
    var doc2;
    if (
      thesisProgressForm.processPlan &&
      typeof thesisProgressForm.processPlan === "object" &&
      Array.isArray(thesisProgressForm.processPlan)
    ) {
      const processPlanObject = thesisProgressForm.processPlan as Prisma.JsonArray;
      doc2 = await genDocProcessPlan(
        {
          date: {
            month: "",
            year: "",
          },
          signature: {
            img: thesisProgressForm.student.signatureUrl,
            name: data.nameStd,
            date: dateShortTH(thesisProgressForm.date),
          },
          processPlan: processPlanObject,
        },
        "FM-ENG-GRD-05-00"
      );
    }
    const zip = new JSZip();
    zip.file(`${"FM-ENG-GRD-06_1"}.docx`, doc1);
    zip.file(`${"FM-ENG-GRD-06_2"}.docx`, doc2!);
    const filezip = await zip.generateAsync({ type: "blob" }).then((content) => {
      return content;
    });
    return new NextResponse(filezip, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=FM-ENG-GRD-06.zip",
      },
    });
  } catch (error) {
    console.error("Error generating DOCX:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
