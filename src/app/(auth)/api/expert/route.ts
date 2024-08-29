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
		const { prefix, firstName, lastName } = body;

		const expert = await db.expert.create({
			data: {
				prefix,
				firstName,
				lastName,
			},
		});

		const { ...rest } = expert;

		return NextResponse.json({ form: rest, message: "Expert Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const expert = await db.expert.findMany({});

	return NextResponse.json(expert);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { id, prefix, firstName, lastName } = body;

		if (!id) {
			return NextResponse.json({ message: "Expert ID is required for update" }, { status: 400 });
		}

		const existingExpert = await db.expert.findUnique({
			where: { id: id },
		});

		if (!existingExpert) {
			return NextResponse.json({ user: null, message: "Expert not found" }, { status: 404 });
		}

		const expert = await db.expert.update({
			where: { id: id },
			data: {
				prefix: existingExpert.prefix || prefix,
				firstName: existingExpert.firstName || firstName,
				lastName: existingExpert.lastName || lastName,
			},
		});

		const { ...rest } = expert;

		return NextResponse.json({ form: rest, message: "Expert Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
