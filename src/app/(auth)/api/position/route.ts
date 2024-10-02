import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, position } = body;

    if (!id) {
      return NextResponse.json({ message: "User ID is required for update" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { id: id },
    });

    if (!existingUser) {
      return NextResponse.json({ user: null, message: "User not found" }, { status: 404 });
    }

    const updatedUser = await db.user.update({
      where: { id: id },
      data: {
        position: position,
      },
    });

    return NextResponse.json({ user: updatedUser, message: "User Updated" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      console.log({ error: error.message });
    }
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
