import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const expert = await db.expert.findMany({});

	return NextResponse.json(expert);
}
