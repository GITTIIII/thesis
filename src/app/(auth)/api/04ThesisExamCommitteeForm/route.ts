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
            trimester,
            academicYear,
            committeeMembers,
            examDate,
            times,
            studentID,
            advisorID
        } = body;

        const newForm = await db.thesisExamCommitteeForm.create({
            data: {
                date,
                trimester,
                academicYear,
                committeeMembers,
                examDate,
                times,
                studentID,
                advisorID,
            },
        });

        return NextResponse.json({ form: newForm, message: "Form Created" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}

// GET: ดึงข้อมูลทั้งหมด
export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
    }

    const thesisExamCommitteeForms = await db.thesisExamCommitteeForm.findMany({
        include: {
            student: {
                include: {
                    prefix: true,
                },
            },
            headSchool: {
                include: {
                    prefix: true,
                },
            },
            advisor: {
                include: {
                    prefix: true,
                },
            },
        },
    });

    return NextResponse.json(thesisExamCommitteeForms);
}

// PATCH: อัปเดตข้อมูลที่ต้องการ
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // if (!session) {
        //     return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
        // }

        const body = await req.json();
        const {
            id,
            date,
            trimester,
            academicYear,
            committeeMembers,
            examDate,
            times,
            studentID,
            headSchoolID,
            headSchoolSignUrl,
            advisorID,
            advisorSignUrl,
            chairOfAcademicSignUrl,
            addNotes
        } = body;

        if (!id) {
            return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
        }

        const existingExamCommitteeForm = await db.thesisExamCommitteeForm.findUnique({
            where: { id },
        });

        if (!existingExamCommitteeForm) {
            return NextResponse.json({ message: "Form not found" }, { status: 404 });
        }

        const updatedForm = await db.thesisExamCommitteeForm.update({
            where: { id },
            data: {
                date: date ?? existingExamCommitteeForm.date,
                trimester: trimester !== undefined ? trimester : existingExamCommitteeForm.trimester,
                academicYear: academicYear ?? existingExamCommitteeForm.academicYear,
                committeeMembers: committeeMembers ?? existingExamCommitteeForm.committeeMembers,
                times: times !== undefined ? times : existingExamCommitteeForm.times,
                examDate: examDate ?? existingExamCommitteeForm.examDate,
                studentID: studentID !== undefined ? studentID : existingExamCommitteeForm.studentID,
                headSchoolID: headSchoolID !== undefined ? headSchoolID : existingExamCommitteeForm.headSchoolID,
                headSchoolSignUrl: headSchoolSignUrl ?? existingExamCommitteeForm.headSchoolSignUrl,
                advisorID: advisorID !== undefined ? advisorID : existingExamCommitteeForm.advisorID,
                advisorSignUrl: advisorSignUrl ?? existingExamCommitteeForm.advisorSignUrl,
                chairOfAcademicSignUrl: chairOfAcademicSignUrl ?? existingExamCommitteeForm.chairOfAcademicSignUrl,
                addNotes: addNotes ?? existingExamCommitteeForm.addNotes
            },
        });

        return NextResponse.json({ form: updatedForm, message: "Form Updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
