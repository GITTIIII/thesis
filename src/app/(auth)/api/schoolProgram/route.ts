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
		const { schoolID, programID } = body;

		const schoolProgram = await db.schoolProgram.create({
			data: {
				schoolID: schoolID == 0 ? null : schoolID,
				programID: programID == 0 ? null : programID,
			},
		});

		const { ...rest } = schoolProgram;

		return NextResponse.json({ form: rest, message: "CchoolProgram Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}
	const schoolProgram = await db.schoolProgram.findMany({
		include: {
			school: true,
			program: true,
		},
	});

	return NextResponse.json(schoolProgram);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { schoolID, programID, action } = body;

		if (!schoolID) {
			return NextResponse.json({ message: "School ID is required" }, { status: 400 });
		}

		if (!programID) {
			return NextResponse.json({ message: "Program ID is required" }, { status: 400 });
		}

		const existingSchoolProgram = await db.schoolProgram.findUnique({
			where: { 
				schoolID_programID: {
					schoolID: Number(schoolID),
					programID: Number(programID),
				},
			}
		});

		if (action === 'add') {
			if (existingSchoolProgram) {
				return NextResponse.json({ message: "SchoolProgram relationship already exists" }, { status: 409 });
			}

			// Create a new relationship
			await db.schoolProgram.create({
				data: {
					schoolID: Number(schoolID),
					programID: Number(programID),
				},
			});

			return NextResponse.json({ message: "SchoolProgram relationship added" }, { status: 201 });

		} else if (action === 'remove') {
			if (!existingSchoolProgram) {
				return NextResponse.json({ message: "SchoolProgram relationship not found" }, { status: 404 });
			}

			// Delete the existing relationship
			await db.schoolProgram.delete({
				where: {
					schoolID_programID: {
						schoolID: Number(schoolID),
						programID: Number(programID),
					},
				},
			});

			return NextResponse.json({ message: "SchoolProgram relationship removed" }, { status: 200 });

		} else {
			return NextResponse.json({ message: "Invalid action" }, { status: 400 });
		}

	} catch (error) {
		return NextResponse.json({ message: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
	}
}

