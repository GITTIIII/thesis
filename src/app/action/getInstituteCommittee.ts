import { IUser } from "@/interface/user";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getInstituteCommittee = async () => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const user = await db.user.findMany({
		where: {
			role: "ADMIN",
			position: "HEAD_OF_INSTITUTE",
		},
		include: {
			prefix: true,
		},
	});

	if (!user) return;

	return user as IUser[];
};
