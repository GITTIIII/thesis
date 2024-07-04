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
			advisorID,
			coAdvisorID,
			studentID,
		} = body;

		const newForm = await db.outlineForm.create({
			data: {
				date,
				thesisNameTH,
				thesisNameEN,
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
			advisorID,
			coAdvisorID,
			studentID,
			committeeOutlineID,
			committeeOutlineStatus,
			committeeOutlineComment,
			dateCommitteeOutlineSign,
			committeeInstituteID,
			committeeInstituteStatus,
			committeeInstituteComment,
			dateCommitteeInstituteSign,
		} = body;

		const newForm = await db.outlineForm.update({
			where: { id: id },
			data: {
				date,
				thesisNameTH,
				thesisNameEN,
				advisorID: advisorID === 0 ? null : advisorID,
				coAdvisorID: coAdvisorID === 0 ? null : coAdvisorID,
				studentID: studentID === 0 ? null : studentID,
				committeeOutlineID: committeeOutlineID === 0 ? null : committeeOutlineID,
				committeeOutlineStatus,
				committeeOutlineComment,
				dateCommitteeOutlineSign,
				committeeInstituteID:  committeeInstituteID === 0 ? null : committeeInstituteID,
				committeeInstituteStatus,
				committeeInstituteComment,
				dateCommitteeInstituteSign,
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
