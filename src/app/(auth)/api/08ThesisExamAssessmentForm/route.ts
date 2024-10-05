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
		const { date, examDate, disClosed, studentID } = body;

		const newForm = await db.thesisExamAssessmentForm.create({
			data: {
				date,
				examDate,
				disClosed,
				studentID: studentID === 0 ? null : studentID,
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

	const thesisExamForms = await db.thesisExamAssessmentForm.findMany({
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
			headOfCommittee: true,
			instituteCommittee: {
				include: { prefix: true },
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
			date,
			examDate,
			disClosed,
			studentID,

			// ผลสอบ
			result,
			presentationComment,
			explanationComment,
			answerQuestionComment,
			failComment,

			// การเปลี่ยนชื่อ
			reviseTitle,
			newThesisNameTH,
			newThesisNameEN,

			// ลายเซ็นกรรมการ
			headOfCommitteeID,
			headOfCommitteeSignUrl,
			advisorSignUrl,
			coAdvisors,
			committees,

			// กรรมการสำนัก
			times,
			dateInstituteCommitteeSign,
			instituteCommitteeStatus,
			instituteCommitteeComment,
			instituteCommitteeSignUrl,
			instituteCommitteeID,
		} = body;

		if (!id) {
			return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
		}

		const existingThesisExamAssessmentForm = await db.thesisExamAssessmentForm.findUnique({
			where: { id },
		});

		if (!existingThesisExamAssessmentForm) {
			return NextResponse.json({ message: "Form not found" }, { status: 404 });
		}

		const updatedForm = await db.thesisExamAssessmentForm.update({
			where: { id },
			data: {
				date: date || existingThesisExamAssessmentForm.date,
				examDate: examDate || existingThesisExamAssessmentForm.examDate,
				disClosed: disClosed || existingThesisExamAssessmentForm.disClosed,
				studentID: studentID === 0 ? existingThesisExamAssessmentForm.studentID : studentID,

				result: result || existingThesisExamAssessmentForm.result,
				presentationComment: presentationComment || existingThesisExamAssessmentForm.presentationComment,
				explanationComment: explanationComment || existingThesisExamAssessmentForm.explanationComment,
				answerQuestionComment: answerQuestionComment || existingThesisExamAssessmentForm.answerQuestionComment,
				failComment: failComment || existingThesisExamAssessmentForm.failComment,

				reviseTitle: reviseTitle || existingThesisExamAssessmentForm.reviseTitle,
				newThesisNameTH: newThesisNameTH || existingThesisExamAssessmentForm.newThesisNameTH,
				newThesisNameEN: newThesisNameEN || existingThesisExamAssessmentForm.newThesisNameEN,

				headOfCommitteeID: headOfCommitteeID === 0 ? existingThesisExamAssessmentForm.headOfCommitteeID : headOfCommitteeID,
				headOfCommitteeSignUrl: headOfCommitteeSignUrl || existingThesisExamAssessmentForm.headOfCommitteeSignUrl,
				advisorSignUrl: advisorSignUrl || existingThesisExamAssessmentForm.advisorSignUrl,
				coAdvisors: coAdvisors || existingThesisExamAssessmentForm.coAdvisors,
				committees: committees || existingThesisExamAssessmentForm.committees,

				times: times || existingThesisExamAssessmentForm.times,
				dateInstituteCommitteeSign: dateInstituteCommitteeSign || existingThesisExamAssessmentForm.dateInstituteCommitteeSign,
				instituteCommitteeStatus: instituteCommitteeStatus || existingThesisExamAssessmentForm.instituteCommitteeStatus,
				instituteCommitteeComment: instituteCommitteeComment || existingThesisExamAssessmentForm.instituteCommitteeComment,
				instituteCommitteeSignUrl: instituteCommitteeSignUrl || existingThesisExamAssessmentForm.instituteCommitteeSignUrl,
				instituteCommitteeID:
					instituteCommitteeID === 0 ? existingThesisExamAssessmentForm.instituteCommitteeID : instituteCommitteeID,
			},
		});

		return NextResponse.json({ form: updatedForm, message: "Form Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
