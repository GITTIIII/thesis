import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

type Params = {
  id: number;
};

export async function DELETE(req: NextApiRequest, context: { params: Params }) {
  const formId = context.params.id;
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
  }

  const expert = await db.expert.delete({
    where: {
      id: Number(formId),
    },
  });

  return NextResponse.json(expert);
}