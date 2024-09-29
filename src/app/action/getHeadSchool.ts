import { IUser } from "@/interface/user";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getHeadSchool = async () => {
	const session = await getServerSession(authOptions);

	if (!session) {
		return;
	}

	const headSchool = await db.user.findMany({
		where: {
			role: "ADMIN",
			position: "HEAD_OF_SCHOOL",
		},
		include: {
			prefix: true,
			institute: true,
			school: true,
		},
	});

	if (!headSchool) {
		return;
	}

	return headSchool as IUser[];
};
