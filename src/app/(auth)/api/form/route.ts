import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const {
			date,
			fullname,
			username,
			education_level,
			school,
			program,
			program_year,
			thesisNameTH,
			thesisNameEN,
			advisorID,
			co_advisorID,
			studentID,
			student_signature,
		} = body;

		const newForm = await db.form1.create({
			data: {
				date,
				fullname,
				username,
				education_level,
				school,
				program,
				program_year,
				thesisNameTH,
				thesisNameEN,
				advisorID: advisorID === 0 ? null : advisorID,
				co_advisorID: co_advisorID === 0 ? null : co_advisorID,
				studentID: studentID === 0 ? null : studentID,
				student_signature,
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
