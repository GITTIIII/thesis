import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);

    if(!session) {
        return null;
    }

    const user = await db.user.
    findMany({
        where: {
            role: "ADMIN"
        }
    });
    console.log(user);
    return NextResponse.json(user);
} 