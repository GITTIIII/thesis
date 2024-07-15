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
		const { schoolName, instituteID } = body;

		const school = await db.school.create({
			data: {
				schoolName,
				instituteID: instituteID == 0 ? null : instituteID,
			},
		});

		const { ...rest } = school;

		return NextResponse.json(
			{ form: rest, message: "School Created" },
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
	const school = await db.school.findMany({
		include: {
			program: true,
		},
	});

	return NextResponse.json(school);
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
		const { id, schoolName, instituteID } = body;

		if (!id) {
			return NextResponse.json(
				{ message: "School ID is required for update" },
				{ status: 400 }
			);
		}

		const existingSchool = await db.school.findUnique({
			where: { id: id },
		});

		if (!existingSchool) {
			return NextResponse.json(
				{ user: null, message: "School not found" },
				{ status: 404 }
			);
		}

		const school = await db.school.update({
			where: { id: id },
			data: {
				schoolName: schoolName == "" ? existingSchool.schoolName : schoolName,
				instituteID:
					instituteID == 0 ? existingSchool.instituteID : instituteID,
			},
		});

		const { ...rest } = school;

		return NextResponse.json(
			{ form: rest, message: "School Updated" },
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
