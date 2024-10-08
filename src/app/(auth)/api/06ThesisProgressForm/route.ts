import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { times, trimester, status, statusComment, percentage, percentageComment, issues, date, processPlan, studentID } = body;

		const newForm = await db.thesisProgressForm.create({
			data: {
				times,
				trimester,
				status,
				statusComment,
				percentage,
				percentageComment,
				issues,
				date,
				processPlan,
				studentID: studentID === 0 ? null : studentID,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Created" }, { status: 200 });
	} catch (error) {
		const err = error as Error;
		console.log(err);
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const thesisProgressForm = await db.thesisProgressForm.findMany({
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
		},
	});

	return NextResponse.json(thesisProgressForm);
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
			times,
			trimester,
			status,
			statusComment,
			percentage,
			percentageComment,
			issues,
			date,
			processPlan,
			studentID,

			assessmentResult,
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

		const existingThesisProgressForm = await db.thesisProgressForm.findUnique({
			where: { id: id },
		});

		if (!existingThesisProgressForm) {
			return NextResponse.json({ user: null, message: "Form not found" }, { status: 404 });
		}

		const newForm = await db.thesisProgressForm.update({
			where: { id: id },
			data: {
				times: times === 0 ? existingThesisProgressForm.times : times,
				trimester: trimester === 0 ? existingThesisProgressForm.trimester : trimester,
				status: status || existingThesisProgressForm.status,
				statusComment: statusComment || existingThesisProgressForm.statusComment,
				percentage: percentage === 0 ? existingThesisProgressForm.percentage : percentage,
				percentageComment: percentageComment || existingThesisProgressForm.percentageComment,
				issues: issues || existingThesisProgressForm.issues,
				date: date || existingThesisProgressForm.date,
				processPlan: processPlan || existingThesisProgressForm.processPlan,
				studentID: studentID === 0 ? existingThesisProgressForm.studentID : studentID,

				assessmentResult: assessmentResult || existingThesisProgressForm.assessmentResult,
				advisorSignUrl: advisorSignUrl || existingThesisProgressForm.advisorSignUrl,
				dateAdvisor: dateAdvisor || existingThesisProgressForm.dateAdvisor,

				headSchoolComment: headSchoolComment || existingThesisProgressForm.headSchoolComment,
				headSchoolSignUrl: headSchoolSignUrl || existingThesisProgressForm.headSchoolSignUrl,
				dateHeadSchool: dateHeadSchool || existingThesisProgressForm.dateHeadSchool,
				headSchoolID: headSchoolID === 0 ? existingThesisProgressForm.headSchoolID : headSchoolID,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
