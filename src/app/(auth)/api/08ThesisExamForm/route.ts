import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// POST: สร้างข้อมูลใหม่โดยไม่ต้องใส่ headSchoolID, headSchoolSignUrl, advisorID, advisorSignUrl
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
        }

        const body = await req.json();
        const {
                date,
                studentID,
                examinationDate,
                thesisNameTH,
                thesisNameEN,
                disClosed,
                reviseTitle,
                newNameTH,
                newNameEN,
        } = body;

        const newForm = await db.thesisExamForm.create({
            data: {
                date,
                studentID,
                examinationDate,
                thesisNameTH,
                thesisNameEN,
                disClosed,
                reviseTitle,
                newNameTH,
                newNameEN,
            },
        });

        return NextResponse.json({ form: newForm, message: "Form Created" }, { status: 200 });
    } catch (error) {
        const err = error as Error;
		console.log(err)
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

// GET: ดึงข้อมูลทั้งหมด
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
    }

    const thesisExamForms = await db.thesisExamForm.findMany({
        include: {
            student: {
                include: {
                    prefix: true,
                },
            },
            
        },
    });

    return NextResponse.json(thesisExamForms);
}

// PATCH: อัปเดตข้อมูลที่ต้องการ
export async function PATCH(req: Request) {
    try {
        // const session = await getServerSession(authOptions);

        // if (!session) {
        //     return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
        // }

        const body = await req.json();
        const {
                id,
                studentID,
                examinationDate,
                committeeSignUrl,
                resultExam,
                presentationComment,
                explanationComment,
                answerQuestionsCooment,
                approve,
                headOfCommitteeSignUrl,
                dateOfDecision,
                meetingNo,
                meetingDate,
                headOfCommitteeName

        } = body;

        if (!id) {
            return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
        }

        const existingThesisExamForm = await db.thesisExamForm.findUnique({
            where: { id },
        });

        if (!existingThesisExamForm) {
            return NextResponse.json({ message: "Form not found" }, { status: 404 });
        }

        const updatedForm = await db.thesisExamForm.update({
            where: { id },
            data: {
                studentID: studentID !== undefined ? studentID : existingThesisExamForm.studentID,
                examinationDate: examinationDate !== undefined ? examinationDate : existingThesisExamForm.examinationDate,
                committeeSignUrl: committeeSignUrl !== undefined ? committeeSignUrl : existingThesisExamForm.committeeSignUrl,
                resultExam: resultExam ?? existingThesisExamForm.resultExam,
                presentationComment: presentationComment !== undefined ? presentationComment : existingThesisExamForm.presentationComment,
                explanationComment: explanationComment ?? existingThesisExamForm.explanationComment,
                answerQuestionsCooment: answerQuestionsCooment ?? existingThesisExamForm.answerQuestionsCooment,
                
                headOfCommitteeName: headOfCommitteeName ?? existingThesisExamForm.headOfCommitteeName,
                approve: approve ?? existingThesisExamForm.approve,
                headOfCommitteeSignUrl: headOfCommitteeSignUrl ?? existingThesisExamForm.headOfCommitteeSignUrl,
                dateOfDecision: dateOfDecision ?? existingThesisExamForm.dateOfDecision,
                meetingNo: meetingNo ?? existingThesisExamForm.meetingNo,
                meetingDate: meetingDate ?? existingThesisExamForm.meetingDate,
            },
        });

        return NextResponse.json({ form: updatedForm, message: "Form Updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
