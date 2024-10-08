import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

type Params = {
	id: number;
};

export async function DELETE(req: NextRequest, context: { params: Params }) {
	const id = context.params.id;
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const user = await db.user.delete({
		where: {
			id: Number(id),
		},
	});

	return NextResponse.json(user);
}
