import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { StdId: string } }) {
	const session = await getServerSession(authOptions);
	const StdId = params.StdId;
	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const form = await db.thesisProgressForm.findFirst({
		where: {
			studentID: parseInt(StdId),
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (!form) {
		return NextResponse.json({ error: "Form not found" }, { status: 404 });
	}

	return NextResponse.json(form);
}
