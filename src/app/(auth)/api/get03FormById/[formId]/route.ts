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

	// if (!session) {
	// 	return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	// }

	const thesisOutlineCommitteeForm = await db.thesisOutlineCommitteeForm.findUnique({
		where: {
			id: Number(formId),
		},
		include: {
			student: {
				include: {
					prefix: true,
					institute: true,
					school: true,
					program: true,
					advisor: {
						include: {
							prefix: true,
						},
					},
					coAdvisors: {
						include: {
							coAdvisor: {
								include: {
									prefix: true,
								},
							},
						},
					},
				},
			},
		},
	});

	if (!thesisOutlineCommitteeForm) {
		return NextResponse.json({ error: "Form not found" }, { status: 404 });
	}

	return NextResponse.json(thesisOutlineCommitteeForm);
}
