import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { db } from "@/lib/db";
import { IUser } from "@/interface/user";

export const currentUser = async () => {
	const session = await getServerSession(authOptions);
	const username = session?.user.username;

	if (!session) {
		return;
	}

	const user = await db.user.findUnique({
		where: {
			username: username,
		},
		include: {
			prefix: true,
			institute: true,
			school: true,
			program: true,
			advisor: {
				include: {
					prefix: true,
				},
			},
			coAdvisedStudents: {
				include: {
					coAdvisor: {
						include: {
							prefix: true,
						},
					},
				},
			},
			certificate: true,
		},
	});

	if (!user) {
		return;
	}

	return user as IUser;
};
