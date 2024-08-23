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
      		times,
      		academicYear,
      		committeeMembers, // ตรวจสอบว่าเป็น JSON ที่ถูกต้อง
      		examDate,
      		studentID,
		} = body;

		const newForm = await db.thesisOutlineCommittee.create({
			data: {
			  date,
			  trimester,
			  academicYear,
			  committeeMembers,  // ข้อมูล JSON
			  times,
			  examDate,
			  studentID,
			},
		  });

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

// export async function GET() {
// 	const session = await getServerSession(authOptions);

// 	if (!session) {
// 		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
// 	}

// 	const qualificationExamCommitteeForm = await db.qualificationExamCommitteeForm.findMany({
// 		include: {
// 			student: {
// 				include: {
// 					prefix: true,
// 				},
// 			},
// 			headSchool: {
// 				include: {
// 					prefix: true,
// 				},
// 			},
// 		},
// 	});

// 	return NextResponse.json(qualificationExamCommitteeForm);
// }

// export async function PATCH(req: Request) {
// 	try {
// 		const session = await getServerSession(authOptions);

// 		if (!session) {
// 			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
// 		}

// 		const body = await req.json();
// 		const {
// 			id,
// 			date,
// 			trimester,
// 			academicYear,
// 			committeeName1,
// 			committeeName2,
// 			committeeName3,
// 			committeeName4,
// 			committeeName5,
// 			numberStudent,
// 			times,
// 			examDay,
// 			studentID,
// 			headSchoolID,
// 			headSchoolSignUrl,
// 		} = body;

// 		if (!id) {
// 			return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
// 		}

// 		const existingQualificationExamCommitteeForm = await db.qualificationExamCommitteeForm.findUnique({
// 			where: { id: id },
// 		});

// 		if (!existingQualificationExamCommitteeForm) {
// 			return NextResponse.json({ user: null, message: "Form not found" }, { status: 404 });
// 		}

// 		const newForm = await db.comprehensiveExamCommitteeForm.update({
// 			where: { id: id },
// 			data: {
// 				date: date || existingQualificationExamCommitteeForm.date,
// 				trimester: trimester == 0 ? existingQualificationExamCommitteeForm.trimester : trimester,
// 				academicYear: academicYear || existingQualificationExamCommitteeForm.academicYear,
// 				committeeName1: committeeName1 || existingQualificationExamCommitteeForm.committeeName1,
// 				committeeName2: committeeName2 || existingQualificationExamCommitteeForm.committeeName2,
// 				committeeName3: committeeName3 || existingQualificationExamCommitteeForm.committeeName3,
// 				committeeName4: committeeName4 || existingQualificationExamCommitteeForm.committeeName4,
// 				committeeName5: committeeName5 || existingQualificationExamCommitteeForm.committeeName5,
// 				numberStudent,
// 				times: times == 0 ? existingQualificationExamCommitteeForm.times : times,
// 				examDay: examDay || existingQualificationExamCommitteeForm.examDay,
// 				studentID: studentID == 0 ? existingQualificationExamCommitteeForm.studentID : studentID,
// 				headSchoolID: headSchoolID == 0 ? existingQualificationExamCommitteeForm.headSchoolID : headSchoolID,
// 				headSchoolSignUrl: headSchoolSignUrl || existingQualificationExamCommitteeForm.headSchoolSignUrl,
// 			},
// 		});

// 		const { ...rest } = newForm;

// 		return NextResponse.json({ form: rest, message: "Form Updated" }, { status: 200 });
// 	} catch (error) {
// 		return NextResponse.json({ message: error }, { status: 500 });
// 	}
// }
