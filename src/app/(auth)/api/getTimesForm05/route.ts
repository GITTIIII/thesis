import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const username = session.user?.username;

	if (!username) {
		return NextResponse.json({ user: null, message: "Username not found in session" }, { status: 400 });
	}

	const form = await db.outlineForm.findMany({
		where: {
			student: {
				username: username,
			},
			instituteCommitteeID: {
				not: null,
			},
		},
	});

	const formCount = form.length;

	return NextResponse.json({ formCount });
}
