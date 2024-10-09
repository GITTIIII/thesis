"use server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const updateStdFormState = async (stdId: number) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return "Session not found";
		}

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

		if (!user) {
			return "Failed to update student form state";
		}

		return "Student form state updated successfully";
	} catch (error) {
		return `Error updating student form state: ${error instanceof Error ? error.message : "Unknown error"}`;
	}
};
