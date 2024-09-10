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

        const newForm = await db.thesisOutlineCommitteeForm.create({
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

    const thesisOutlineCommitteeForms = await db.thesisOutlineCommitteeForm.findMany({
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

    return NextResponse.json(thesisOutlineCommitteeForms);
}

// PATCH: อัปเดตข้อมูลที่ต้องการ
export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
        }

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
            instituteComSignUrl,
            addNotes
        } = body;

        if (!id) {
            return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
        }

        const existingOutlineCommitteeForm = await db.thesisOutlineCommitteeForm.findUnique({
            where: { id },
        });

        if (!existingOutlineCommitteeForm) {
            return NextResponse.json({ message: "Form not found" }, { status: 404 });
        }

        const updatedForm = await db.thesisOutlineCommitteeForm.update({
            where: { id },
            data: {
                date: date ?? existingOutlineCommitteeForm.date,
                trimester: trimester !== undefined ? trimester : existingOutlineCommitteeForm.trimester,
                academicYear: academicYear ?? existingOutlineCommitteeForm.academicYear,
                committeeMembers: committeeMembers ?? existingOutlineCommitteeForm.committeeMembers,
                times: times !== undefined ? times : existingOutlineCommitteeForm.times,
                examDate: examDate ?? existingOutlineCommitteeForm.examDate,
                studentID: studentID !== undefined ? studentID : existingOutlineCommitteeForm.studentID,
                headSchoolID: headSchoolID !== undefined ? headSchoolID : existingOutlineCommitteeForm.headSchoolID,
                headSchoolSignUrl: headSchoolSignUrl ?? existingOutlineCommitteeForm.headSchoolSignUrl,
                advisorID: advisorID !== undefined ? advisorID : existingOutlineCommitteeForm.advisorID,
                advisorSignUrl: advisorSignUrl ?? existingOutlineCommitteeForm.advisorSignUrl,
                instituteComSignUrl: instituteComSignUrl ?? existingOutlineCommitteeForm.instituteComSignUrl,
                addNotes: addNotes ?? existingOutlineCommitteeForm.addNotes
            },
        });

        return NextResponse.json({ form: updatedForm, message: "Form Updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
