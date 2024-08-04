import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
	userId: number;
};

export async function GET(req: NextApiRequest, context: { params: Params }) {
	const userId = context.params.userId;
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ user: null, message: "Session not found" },
			{ status: 404 }
		);
	}

	const user = await db.user.findUnique({
		where: {
			id: Number(userId),
		},
		include:{
			prefix: true,
            institute:true,
            school:true,
            program:true,
            advisor:true,
            coAdvisors:true,
        }
	});

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	return NextResponse.json(user);
}
