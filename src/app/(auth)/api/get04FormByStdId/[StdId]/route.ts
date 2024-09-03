import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
	StdId: number;
};

export async function GET(req: NextApiRequest, context: { params: Params }) {
	const StdId = context.params.StdId;
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const formData = await db.thesisExamCommitteeForm.findMany({
		where: {
			studentID: Number(StdId),
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

	if (!formData) {
		return NextResponse.json({ error: "Form not found" }, { status: 404 });
	}

	return NextResponse.json(formData);
}
