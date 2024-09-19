import { IThesisProgressForm } from "@/interface/form";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getLast06FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form06 = await db.thesisProgressForm.findFirst({
		where: {
			studentID: Number(stdId),
		},
		include: {
			student: {
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
			},
			headSchool: {
				include: {
					prefix: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	if (!form06) return;

	return form06 as IThesisProgressForm;
};
