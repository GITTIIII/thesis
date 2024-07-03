import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
	const userId = req.query;
	const session = await getServerSession(authOptions);

	if (!session) {
		return null;
	}

	const outlineForm = await db.outlineForm.findMany({
		where: {
			studentID: userId,
		},
		include: {
			student: true,
			advisor: true,
			coAdvisor: true,
		},
	});

	return NextResponse.json(outlineForm);
}
