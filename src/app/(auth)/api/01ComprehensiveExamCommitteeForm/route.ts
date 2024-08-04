import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

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
			committeeName1,
			committeeName2,
			committeeName3,
			committeeName4,
			committeeName5,
			numberStudent,
			times,
			examDay,
			studentID,
		} = body;

		const newForm = await db.comprehensiveExamCommitteeForm.create({
			data: {
				date,
				trimester: trimester === 0 ? null : trimester,
				academicYear,
				committeeName1,
				committeeName2,
				committeeName3,
				committeeName4,
				committeeName5,
				numberStudent,
				times,
				examDay,
				studentID: studentID === 0 ? null : studentID,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const comprehensiveExamCommitteeForm = await db.comprehensiveExamCommitteeForm.findMany({
		include: {
			student: {
				include:{
					prefix:true,
				}
			},
		},
	});

	if (!comprehensiveExamCommitteeForm) {
		return NextResponse.json({ error: "Form not found" }, { status: 404 });
	}

	return NextResponse.json(comprehensiveExamCommitteeForm);
}

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
			committeeName1,
			committeeName2,
			committeeName3,
			committeeName4,
			committeeName5,
			numberStudent,
			times,
			examDay,
			studentID,
		} = body;

		if (!id) {
			return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
		}

		const existingComprehensiveExamCommitteeForm = await db.comprehensiveExamCommitteeForm.findUnique({
			where: { id: id },
		});

		if (!existingComprehensiveExamCommitteeForm) {
			return NextResponse.json({ user: null, message: "Form not found" }, { status: 404 });
		}

		const newForm = await db.comprehensiveExamCommitteeForm.update({
			where: { id: id },
			data: {
				date: date || existingComprehensiveExamCommitteeForm.date,
				trimester: trimester == 0 ? existingComprehensiveExamCommitteeForm.trimester : trimester,
				academicYear: academicYear || existingComprehensiveExamCommitteeForm.academicYear,
				committeeName1: committeeName1 || existingComprehensiveExamCommitteeForm.committeeName1,
				committeeName2: committeeName2 || existingComprehensiveExamCommitteeForm.committeeName2,
				committeeName3: committeeName3 || existingComprehensiveExamCommitteeForm.committeeName3,
				committeeName4: committeeName4 || existingComprehensiveExamCommitteeForm.committeeName4,
				committeeName5: committeeName5 || existingComprehensiveExamCommitteeForm.committeeName5,
				numberStudent,
				times: times == 0 ? existingComprehensiveExamCommitteeForm.times : times,
				examDay: examDay || existingComprehensiveExamCommitteeForm.examDay,
				studentID: studentID == 0 ? existingComprehensiveExamCommitteeForm.studentID : studentID,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
