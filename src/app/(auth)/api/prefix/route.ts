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
		const { prefixTH, prefixEN } = body;

		const prefix = await db.prefix.create({
			data: {
				prefixTH,
				prefixEN,
			},
		});

		const { ...rest } = prefix;

		return NextResponse.json({ form: rest, message: "Prefix Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const prefix = await db.prefix.findMany({});

	return NextResponse.json(prefix);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { id, prefixTH, prefixEN } = body;

		if (!id) {
			return NextResponse.json({ message: "Prefix ID is required for update" }, { status: 400 });
		}

		const existingPrefix = await db.prefix.findUnique({
			where: { id: id },
		});

		if (!existingPrefix) {
			return NextResponse.json({ user: null, message: "Prefix not found" }, { status: 404 });
		}

		const prefix = await db.prefix.update({
			where: { id: id },
			data: {
				prefixTH:  existingPrefix.prefixTH || prefixTH,
				prefixEN:  existingPrefix.prefixEN || prefixEN,
			},
		});

		const { ...rest } = prefix;

		return NextResponse.json({ form: rest, message: "Prefix Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
