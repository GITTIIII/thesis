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
		return null;
	}

	const outlineForm = await db.outlineForm.findUnique({
		where: {
			id: Number(formId),
		},
		include: {
			student: true,
			advisor: true,
			coAdvisor: true,
			outlineCommittee: true,
			instituteCommittee: true,
		},
	});

	if (!outlineForm) {
		return NextResponse.json({ error: "Form not found" }, { status: 404 });
	}

	return NextResponse.json(outlineForm);
}