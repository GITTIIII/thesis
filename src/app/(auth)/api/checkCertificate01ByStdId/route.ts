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

	const GetCertificate01 = await db.certificate.findMany({
		where: {
			userID: Number(userID),
			certificateType: "01",
		},
		include: {
			user: {
				include: {
					prefix: true,
				},
			},
		},
	});

	if (!GetCertificate01 || GetCertificate01.length === 0) {
		return NextResponse.json("not found");
	}

	return NextResponse.json("found");
}
