import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
	formId: number;
};

export async function GET(req: NextApiRequest, context: { params: Params }) {
	const formId = context.params.formId;;
	const session = await getServerSession(authOptions);

	if (!session) {
		return null;
	}

	const form1 = await db.form1.findUnique({
		where: {
			id: Number(formId),
		},
        include:{
            advisor: true,
            coAdvisor: true
        },
        
	});

	if (!form1) {
		return NextResponse.json({ error: "Form not found" }, { status: 404 });
	}

	return NextResponse.json(form1);
}
