import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
  }

  const user = await db.user.findMany({
    where: {
      role: "STUDENT",
    },
    include: {
      prefix: true,
      school: true,
      institute: true,
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
  });

  return NextResponse.json(user);
}
