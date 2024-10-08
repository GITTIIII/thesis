import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// POST: สร้างข้อมูลใหม่โดยไม่ต้องใส่ headSchoolID, headSchoolSignUrl, advisorID, advisorSignUrl
export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { date, trimester, academicYear, committeeMembers, examDate, times, studentID, OROG } = body;

		const newForm = await db.thesisOutlineCommitteeForm.create({
			data: {
				date,
				trimester: trimester === 0 ? null : trimester,
				times,
				academicYear,
				committeeMembers,
				examDate,
				studentID: studentID === 0 ? null : studentID,
				OROG,
			},
		});

		return NextResponse.json({ form: newForm, message: "Form Created" }, { status: 200 });
	} catch (error) {
		const err = error as Error;
		console.log(err);
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
			times,
			academicYear,
			committeeMembers,
			examDate,
			studentID,
			advisorSignUrl,
			headSchoolID,
			headSchoolSignUrl,
			instituteComSignUrl,
			addNotes,
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
				date: date || existingOutlineCommitteeForm.date,
				trimester: trimester == 0 ? existingOutlineCommitteeForm.trimester : trimester,
				academicYear: academicYear || existingOutlineCommitteeForm.academicYear,
				committeeMembers: committeeMembers || existingOutlineCommitteeForm.committeeMembers,
				times: times == 0 ? existingOutlineCommitteeForm.times : times,
				examDate: examDate || existingOutlineCommitteeForm.examDate,
				studentID: studentID == 0 ? existingOutlineCommitteeForm.studentID : studentID,
				advisorSignUrl: advisorSignUrl || existingOutlineCommitteeForm.advisorSignUrl,
				headSchoolID: headSchoolID == 0 ? existingOutlineCommitteeForm.headSchoolID : headSchoolID,
				headSchoolSignUrl: headSchoolSignUrl || existingOutlineCommitteeForm.headSchoolSignUrl,
				instituteComSignUrl: instituteComSignUrl || existingOutlineCommitteeForm.instituteComSignUrl,
				addNotes: addNotes || existingOutlineCommitteeForm.addNotes,
			},
		});

		return NextResponse.json({ form: updatedForm, message: "Form Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
