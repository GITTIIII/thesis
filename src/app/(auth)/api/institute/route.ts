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
		const { instituteNameTH, instituteNameEN } = body;

		const institute = await db.institute.create({
			data: {
				instituteNameTH,
				instituteNameEN,
			},
		});

		const { ...rest } = institute;

		return NextResponse.json({ form: rest, message: "Institute Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const institute = await db.institute.findMany({});

	return NextResponse.json(institute);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { id, instituteNameTH, instituteNameEN } = body;

		if (!id) {
			return NextResponse.json({ message: "Institute ID is required for update" }, { status: 400 });
		}

		const existingInstitute = await db.institute.findUnique({
			where: { id: id },
		});

		if (!existingInstitute) {
			return NextResponse.json({ user: null, message: "Institute not found" }, { status: 404 });
		}

		const institute = await db.institute.update({
			where: { id: id },
			data: {
				instituteNameTH: instituteNameTH == "" ? existingInstitute.instituteNameTH : instituteNameTH,
				instituteNameEN: instituteNameEN == "" ? existingInstitute.instituteNameEN : instituteNameEN,
			},
		});

		const { ...rest } = institute;

		return NextResponse.json({ form: rest, message: "institute Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
