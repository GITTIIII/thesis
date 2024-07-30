import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
	StdId: number;
};

export async function GET(req: NextApiRequest, context: { params: Params }){
    const StdId = context.params.StdId;
    const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json(
			{ user: null, message: "Session not found" },
			{ status: 404 }
		);
	}
    const form = await db.outlineForm.
    findFirst({
        where: {
            studentID: Number(StdId),
            outlineCommitteeStatus: "APPROVED",
            instituteCommitteeStatus: "APPROVED",
        }
    });
    
    return NextResponse.json(form);
} 