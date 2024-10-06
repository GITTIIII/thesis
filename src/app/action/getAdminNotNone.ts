import { IUser } from "@/interface/user";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getAdminNotNone = async () => {
	const session = await getServerSession(authOptions);

	if (!session) {
		return;
	}

	const adminNotNone = await db.user.findMany({
		where: {
			role: "ADMIN",
			position: {
				not: "NONE",
			},
		},
		include: {
			prefix: true,
		},
	});

	return adminNotNone as IUser[];
};
