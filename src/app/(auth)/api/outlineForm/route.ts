import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return null;
		}

		const body = await req.json();
		const {
			date,
			thesisNameTH,
			thesisNameEN,
			abstract,
			advisorID,
			coAdvisorID,
			studentID,
		} = body;

		const newForm = await db.outlineForm.create({
			data: {
				date,
				thesisNameTH,
				thesisNameEN,
				abstract,
				advisorID: advisorID === 0 ? null : advisorID,
				coAdvisorID: coAdvisorID === 0 ? null : coAdvisorID,
				studentID: studentID === 0 ? null : studentID,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json(
			{ form: rest, message: "Form Created" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return null;
	}

	const outlineForm = await db.outlineForm.findMany({
		include: {
			student: true,
			advisor: true,
			coAdvisor: true,
		},
	});

	return NextResponse.json(outlineForm);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return null;
		}

		const body = await req.json();
		const {
			id,
			date,
			thesisNameTH,
			thesisNameEN,
			abstract,
			advisorID,
			coAdvisorID,
			studentID,
			outlineCommitteeID,
			outlineCommitteeStatus,
			outlineCommitteeComment,
			dateOutlineCommitteeSign,
			instituteCommitteeID,
			instituteCommitteeStatus,
			instituteCommitteeComment,
			dateInstituteCommitteeSign,
		} = body;

		if (!id) {
			return NextResponse.json(
				{ message: "Form ID is required for update" },
				{ status: 400 }
			);
		}

		const existingOutlineForm = await db.outlineForm.findUnique({
			where: { id: id },
		});

		if (!existingOutlineForm) {
			return NextResponse.json(
				{ user: null, message: "Form not found" },
				{ status: 404 }
			);
		}

		const newForm = await db.outlineForm.update({
			where: { id: id },
			data: {
				date,
				thesisNameTH,
				thesisNameEN,
				abstract,
				advisorID: advisorID === 0 ? null : advisorID,
				coAdvisorID: coAdvisorID === 0 ? null : coAdvisorID,
				studentID: studentID === 0 ? null : studentID,

				outlineCommitteeID:
					outlineCommitteeID == 0
						? existingOutlineForm.outlineCommitteeID
						: outlineCommitteeID,
				outlineCommitteeStatus:
					outlineCommitteeStatus == ""
						? existingOutlineForm.outlineCommitteeStatus
						: outlineCommitteeStatus,
				outlineCommitteeComment:
					outlineCommitteeComment == ""
						? existingOutlineForm.outlineCommitteeComment
						: outlineCommitteeComment,
				dateOutlineCommitteeSign:
					dateOutlineCommitteeSign == ""
						? existingOutlineForm.dateOutlineCommitteeSign
						: dateOutlineCommitteeSign,
				instituteCommitteeID:
					instituteCommitteeID == 0
						? existingOutlineForm.instituteCommitteeID
						: instituteCommitteeID,
				instituteCommitteeStatus:
					instituteCommitteeStatus == ""
						? existingOutlineForm.instituteCommitteeStatus
						: instituteCommitteeStatus,
				instituteCommitteeComment:
					instituteCommitteeComment == ""
						? existingOutlineForm.instituteCommitteeComment
						: instituteCommitteeComment,
				dateInstituteCommitteeSign:
					dateInstituteCommitteeSign == ""
						? existingOutlineForm.dateInstituteCommitteeSign
						: dateInstituteCommitteeSign,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json(
			{ form: rest, message: "Form Updated" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
