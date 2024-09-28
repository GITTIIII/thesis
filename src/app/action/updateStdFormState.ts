"use server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const updateStdFormState = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const user = await db.user.update({
		where: {
			id: Number(stdId),
		},
		data: {
			formState: {
				increment: 1,
			},
		},
	});

	if (!user) return;

	return "Updated Student Form State";
};
