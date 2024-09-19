import { IOutlineForm } from "@/interface/form";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const get05ApprovedFormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form05 = await db.outlineForm.findFirst({
		where: {
			studentID: Number(stdId),
			formStatus: "อนุมัติ"
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
			outlineCommittee: true,
			instituteCommittee: {
				include:{
					prefix: true,
				}
			},
		},
	});

	if (!form05) return;

	return form05 as IOutlineForm;
};