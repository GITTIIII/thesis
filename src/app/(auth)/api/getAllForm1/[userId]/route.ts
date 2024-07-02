import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest){
    const userId = req.query
    const session = await getServerSession(authOptions);

    if(!session) {
        return null;
    }

    const form1 = await db.form1.
    findMany({
        where: {
            studentID: userId
        }
    });
    
    return NextResponse.json(form1);
} 