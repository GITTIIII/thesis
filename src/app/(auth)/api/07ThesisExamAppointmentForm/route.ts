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
		const { trimester, academicYear, gpa, credits, date, dateExam, studentID } = body;

		const newForm = await db.thesisExamAppointmentForm.create({
			data: {
				trimester,
				academicYear,
				gpa,
				credits,
				date,
				dateExam,
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

	const thesisExamAppointmentForm = await db.thesisExamAppointmentForm.findMany({
		include: {
			student: {
				include: {
					prefix: true,
					institute: true,
					school: true,
					program: true,
					advisor: {
						include: {
							prefix: true,
						},
					},
					coAdvisedStudents: {
						include: {
							coAdvisor: {
								include: {
									prefix: true,
								},
							},
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

	return NextResponse.json(thesisExamAppointmentForm);
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
			trimester,
			academicYear,
			gpa,
			credits,
			date,
			dateExam,
			studentID,

			turnitinApproval,
			advisorSignUrl,
			dateAdvisor,

			headSchoolComment,
			headSchoolSignUrl,
			dateHeadSchool,
			headSchoolID,
		} = body;

		if (!id) {
			return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
		}

		const existingThesisExamAppointmentForm = await db.thesisExamAppointmentForm.findUnique({
			where: { id: id },
		});

		if (!existingThesisExamAppointmentForm) {
			return NextResponse.json({ user: null, message: "Form not found" }, { status: 404 });
		}

		const newForm = await db.thesisExamAppointmentForm.update({
			where: { id: id },
			data: {
				trimester: trimester === 0 ? existingThesisExamAppointmentForm.trimester : trimester,
				academicYear: academicYear || existingThesisExamAppointmentForm.academicYear,
				gpa: gpa || existingThesisExamAppointmentForm.gpa,
				credits: credits === 0 ? existingThesisExamAppointmentForm.credits : credits,
				date: date || existingThesisExamAppointmentForm.date,
				dateExam: dateExam || existingThesisExamAppointmentForm.dateExam,
				studentID: studentID === 0 ? existingThesisExamAppointmentForm.studentID : studentID,

				turnitinApproval: turnitinApproval || existingThesisExamAppointmentForm.turnitinApproval,
				advisorSignUrl: advisorSignUrl || existingThesisExamAppointmentForm.advisorSignUrl,
				dateAdvisor: dateAdvisor || existingThesisExamAppointmentForm.dateAdvisor,

				headSchoolComment: headSchoolComment || existingThesisExamAppointmentForm.headSchoolComment,
				headSchoolSignUrl: headSchoolSignUrl || existingThesisExamAppointmentForm.headSchoolSignUrl,
				dateHeadSchool: dateHeadSchool || existingThesisExamAppointmentForm.dateHeadSchool,
				headSchoolID: headSchoolID === 0 ? existingThesisExamAppointmentForm.headSchoolID : headSchoolID,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
