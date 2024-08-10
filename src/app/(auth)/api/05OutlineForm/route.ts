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
		const { date, thesisNameTH, thesisNameEN, abstract, processPlan, thesisStartMonth, thesisStartYear, studentID } = body;

		const newForm = await db.outlineForm.create({
			data: {
				date,
				thesisNameTH,
				thesisNameEN,
				abstract,
				processPlan,
				thesisStartMonth,
				thesisStartYear,
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

	const outlineForm = await db.outlineForm.findMany({
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
			outlineCommittee: true,
			instituteCommittee: {
				include: {
					prefix: true,
				},
			},
		},
	});

	return NextResponse.json(outlineForm);
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
			thesisNameTH,
			thesisNameEN,
			abstract,
			processPlan,
			times,
			thesisStartMonth,
			thesisStartYear,
			studentID,
			outlineCommitteeID,
			outlineCommitteeStatus,
			outlineCommitteeComment,
			outlineCommitteeSignUrl,
			dateOutlineCommitteeSign,
			instituteCommitteeID,
			instituteCommitteeStatus,
			instituteCommitteeComment,
			instituteCommitteeSignUrl,
			dateInstituteCommitteeSign,
		} = body;

		if (!id) {
			return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
		}

		const existingOutlineForm = await db.outlineForm.findUnique({
			where: { id: id },
		});

		if (!existingOutlineForm) {
			return NextResponse.json({ user: null, message: "Form not found" }, { status: 404 });
		}

		const newForm = await db.outlineForm.update({
			where: { id: id },
			data: {
				date,
				thesisNameTH: thesisNameTH || existingOutlineForm.thesisNameTH,
				thesisNameEN: thesisNameEN || existingOutlineForm.thesisNameEN,
				abstract: abstract || existingOutlineForm.abstract,
				processPlan: processPlan || existingOutlineForm.processPlan,
				times: times || existingOutlineForm.times,
				thesisStartMonth: thesisStartMonth || existingOutlineForm.thesisStartMonth,
				thesisStartYear: thesisStartYear || existingOutlineForm.thesisStartYear,
				studentID: studentID === 0 ? existingOutlineForm.studentID : studentID,

				outlineCommitteeID: outlineCommitteeID == 0 ? existingOutlineForm.outlineCommitteeID : outlineCommitteeID,
				outlineCommitteeStatus: outlineCommitteeStatus || existingOutlineForm.outlineCommitteeStatus,
				outlineCommitteeComment: outlineCommitteeComment || existingOutlineForm.outlineCommitteeComment,
				outlineCommitteeSignUrl: outlineCommitteeSignUrl || existingOutlineForm.outlineCommitteeSignUrl,
				dateOutlineCommitteeSign: dateOutlineCommitteeSign || existingOutlineForm.dateOutlineCommitteeSign,
				instituteCommitteeID: instituteCommitteeID == 0 ? existingOutlineForm.instituteCommitteeID : instituteCommitteeID,
				instituteCommitteeStatus: instituteCommitteeStatus || existingOutlineForm.instituteCommitteeStatus,
				instituteCommitteeComment: instituteCommitteeComment || existingOutlineForm.instituteCommitteeComment,
				instituteCommitteeSignUrl: instituteCommitteeSignUrl || existingOutlineForm.instituteCommitteeSignUrl,
				dateInstituteCommitteeSign: dateInstituteCommitteeSign || existingOutlineForm.dateInstituteCommitteeSign,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
