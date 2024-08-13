import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);
    const username = session?.user.username

    if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

    const user = await db.user.
    findUnique({
        where: {
            username: username
        },
        include:{
            prefix: true,
            institute:true,
            school:true,
            program:true,
            advisor:{
                include:{
                    prefix:true
                }
            },
            coAdvisedStudents:{
                include:{
                    coAdvisor:{
                        include:{
                            prefix:true
                        }
                    }
                }
            },
            certificate: true,
        }
    });

    if (!user) {
        return NextResponse.json(null);
    }
    
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
}