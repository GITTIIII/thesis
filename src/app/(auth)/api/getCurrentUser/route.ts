import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
	userId: number;
};

export async function GET(){
    const session = await getServerSession(authOptions);
    const username = session?.user.username

    if(!session) {
        return null;
    }

    const user = await db.user.
    findUnique({
        where: {
            username: username
        }
    });

    return NextResponse.json(user);
}