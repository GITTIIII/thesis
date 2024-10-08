import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
	formId: number;
};

export async function DELETE(req: NextRequest, context: { params: Params }) {
	const formId = context.params.formId;
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const thesisProgressForm = await db.thesisProgressForm.delete({
		where: {
			id: Number(formId),
		},
	});

	return NextResponse.json(thesisProgressForm);
}
