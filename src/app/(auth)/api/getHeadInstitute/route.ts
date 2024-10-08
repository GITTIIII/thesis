import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const user = await db.user.findMany({
		where: {
			role: "ADMIN",
			position: "HEAD_OF_INSTITUTE",
		},
		include: {
			prefix: true,
			institute: true,
			school: true,
		},
	});

	return NextResponse.json(user);
}
