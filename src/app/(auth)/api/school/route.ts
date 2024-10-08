import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { NextApiRequest } from "next";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { schoolNameTH, schoolNameEN, instituteID } = body;

		const school = await db.school.create({
			data: {
				schoolNameTH,
				schoolNameEN,
				instituteID: Number(instituteID),
			},
		});

		const { ...rest } = school;

		return NextResponse.json({ form: rest, message: "School Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}
	const school = await db.school.findMany({
		include: {
			programs: true,
		},
	});

	return NextResponse.json(school);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { id, schoolNameTH, schoolNameEN, instituteID } = body;

		if (!id) {
			return NextResponse.json({ message: "School ID is required for update" }, { status: 400 });
		}

		const existingSchool = await db.school.findUnique({
			where: { id: id },
		});

		if (!existingSchool) {
			return NextResponse.json({ user: null, message: "School not found" }, { status: 404 });
		}

		const school = await db.school.update({
			where: { id: id },
			data: {
				schoolNameTH: schoolNameTH == "" ? existingSchool.schoolNameTH : schoolNameTH,
				schoolNameEN: schoolNameEN == "" ? existingSchool.schoolNameEN : schoolNameEN,
				instituteID: instituteID == 0 ? existingSchool.instituteID : instituteID,
			},
		});

		const { ...rest } = school;

		return NextResponse.json({ form: rest, message: "School Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
