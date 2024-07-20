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
		const { programNameTH, programNameEN, programYear } = body;

		const program = await db.program.create({
			data: {
				programNameTH,
				programNameEN,
				programYear,
			},
		});

		const { ...rest } = program;

		return NextResponse.json({ form: rest, message: "program Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const program = await db.program.findMany({});

	return NextResponse.json(program);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { id, programNameTH, programNameEN, programYear } = body;

		if (!id) {
			return NextResponse.json({ message: "Program ID is required for update" }, { status: 400 });
		}

		const existingProgram = await db.program.findUnique({
			where: { id: id },
		});

		if (!existingProgram) {
			return NextResponse.json({ user: null, message: "Program not found" }, { status: 404 });
		}

		const program = await db.program.update({
			where: { id: id },
			data: {
				programNameTH: programNameTH == "" ? existingProgram.programNameTH : programNameTH,
				programNameEN: programNameEN == "" ? existingProgram.programNameEN : programNameEN,
				programYear: programYear == "" ? existingProgram.programYear : programYear,
			},
		});

		const { ...rest } = program;

		return NextResponse.json({ form: rest, message: "Program Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
