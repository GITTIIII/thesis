import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// POST: สร้างข้อมูลใหม่โดยไม่ต้องใส่ headSchoolID, headSchoolSignUrl, advisorID, advisorSignUrl
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // if (!session) {
        //     return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
        // }

        const body = await req.json();
        const {
                date,
                studentID,
                headCommitteeName,
                thesisNameTH,
                thesisNameEN,
                startDate,
                endDate,
                studentSignUrl,
                publishmentName,
        } = body;

        const newForm = await db.delayThesisForm.create({
            data: {
                date,
                studentID,
                headCommitteeName,
                thesisNameTH,
                thesisNameEN,
                startDate,
                endDate,
                studentSignUrl,
                publishmentName,
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

    const thesisExamForms = await db.delayThesisForm.findMany({
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
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
        }

        const body = await req.json();
        const {
            id,
            instituteSignUrl,
            instituteID,
            approve,
            dayApprove,
            timeApprove,
            disapproveComment,
        } = body;

        if (!id) {
            return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
        }

        const existingDelayThesisForm = await db.delayThesisForm.findUnique({
            where: { id },
        });

        if (!existingDelayThesisForm
) {
            return NextResponse.json({ message: "Form not found" }, { status: 404 });
        }

        const updatedForm = await db.delayThesisForm.update({
            where: { id },
            data: {
                instituteSignUrl: instituteSignUrl !== undefined ? instituteSignUrl : existingDelayThesisForm.instituteSignUrl,
                instituteID: instituteID !== undefined ? instituteID : existingDelayThesisForm.instituteID,
                approve: approve ?? existingDelayThesisForm.approve,
                dayApprove: dayApprove !== undefined ? dayApprove : existingDelayThesisForm.dayApprove,
                timeApprove: timeApprove ?? existingDelayThesisForm.timeApprove,
                disapproveComment: disapproveComment ?? existingDelayThesisForm.disapproveComment,
            },
        });

        return NextResponse.json({ form: updatedForm, message: "Form Updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}
