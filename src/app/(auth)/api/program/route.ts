import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ user: null, message: "Session not found" },
				{ status: 404 }
			);
		}

		const body = await req.json();
		const { programName, programYear, schoolID } = body;

		const program = await db.program.create({
			data: {
				programName,
				programYear,
				schoolID: schoolID == 0 ? null : schoolID,
			},
		});

		const { ...rest } = program;

		return NextResponse.json(
			{ form: rest, message: "program Created" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ user: null, message: "Session not found" },
			{ status: 404 }
		);
	}

	const program = await db.program.findMany({});

	return NextResponse.json(program);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json(
				{ user: null, message: "Session not found" },
				{ status: 404 }
			);
		}

		const body = await req.json();
		const { id, programName, programYear, schoolID } = body;

		if (!id) {
			return NextResponse.json(
				{ message: "Program ID is required for update" },
				{ status: 400 }
			);
		}

		const existingProgram = await db.program.findUnique({
			where: { id: id },
		});

		if (!existingProgram) {
			return NextResponse.json(
				{ user: null, message: "Program not found" },
				{ status: 404 }
			);
		}

		const program = await db.program.update({
			where: { id: id },
			data: {
				programName:
					programName == "" ? existingProgram.programName : programName,
				programYear:
					programYear == "" ? existingProgram.programYear : programYear,
				schoolID: schoolID == 0 ? existingProgram.schoolID : schoolID,
			},
		});

		const { ...rest } = program;

		return NextResponse.json(
			{ form: rest, message: "Program Updated" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
