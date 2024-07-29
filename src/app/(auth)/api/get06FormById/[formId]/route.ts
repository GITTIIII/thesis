import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
	formId: number;
};

export async function GET(req: NextApiRequest, context: { params: Params }) {
	const formId = context.params.formId;
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const thesisProgressForm = await db.thesisProgressForm.findUnique({
		where: {
			id: Number(formId),
		},
		include: {
			student: {
				include: {
					institute: true,
					school: true,
					program: true,
					advisor: true,
					coAdvisor: true,
				},
			},
		},
	});

	if (!thesisProgressForm) {
		return NextResponse.json({ error: "Form not found" }, { status: 404 });
	}

	return NextResponse.json(thesisProgressForm);
}
