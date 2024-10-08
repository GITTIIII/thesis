import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		throw new Error("User is not authenticated");
	}

	const userID = session.user.id;
	if (!userID) {
		throw new Error("User ID not found in session");
	}

	const delayThesisForm = await db.delayThesisForm.findMany({
		where: {
			studentID: Number(userID),
		},
		include: {
			student: {
				include: {
					prefix: true,
				},
			},
		},
	});

	if (!delayThesisForm || delayThesisForm.length === 0) {
		return NextResponse.json(null);
	}

	return NextResponse.json("found");
}
