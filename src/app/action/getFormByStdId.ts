import {
	IComprehensiveExamCommitteeForm,
	IQualificationExamCommitteeForm,
	IOutlineCommitteeForm,
	IExamCommitteeForm,
	IOutlineForm,
	IThesisProgressForm,
	IThesisExamAppointmentForm,
	IDelayThesisForm,
	IThesisExamAssessmentForm,
} from "@/interface/form";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const get01FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form01 = await db.comprehensiveExamCommitteeForm.findMany({
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
					coAdvisedStudents: {
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
					institute: true,
					school: true,
				},
			},
		},
	});

	if (!form01) return;

	return form01 as IComprehensiveExamCommitteeForm[];
};

export const get02FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form02 = await db.qualificationExamCommitteeForm.findMany({
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
					coAdvisedStudents: {
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
					institute: true,
					school: true,
				},
			},
		},
	});

	if (!form02) return;

	return form02 as IQualificationExamCommitteeForm[];
};

export const get03FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form03 = await db.thesisOutlineCommitteeForm.findMany({
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
					institute: true,
					school: true,
				},
			},
		},
	});

	if (!form03) return;

	return form03 as IOutlineCommitteeForm[];
};

export const get04FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form04 = await db.thesisExamCommitteeForm.findMany({
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
					institute: true,
					school: true,
				},
			},
		},
	});

	if (!form04) return;

	return form04 as IExamCommitteeForm[];
};

export const get05FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form05 = await db.outlineForm.findMany({
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
			outlineCommittee: true,
			instituteCommittee: {
				include: {
					prefix: true,
				},
			},
		},
	});

	if (!form05) return;

	return form05 as IOutlineForm[];
};

export const get06FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form06 = await db.thesisProgressForm.findMany({
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
	});

	if (!form06) return;

	return form06 as IThesisProgressForm[];
};

export const get07FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form07 = await db.thesisExamAppointmentForm.findMany({
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
					certificate: true,
				},
			},
			headSchool: {
				include: {
					prefix: true,
				},
			},
		},
	});

	if (!form07) return;

	return form07 as IThesisExamAppointmentForm[];
};

export const get08FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form08 = await db.thesisExamAssessmentForm.findMany({
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
				},
			},
		},
	});

	if (!form08) return;

	return form08 as IThesisExamAssessmentForm[];
};

export const get09FormByStdId = async (stdId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form09 = await db.delayThesisForm.findMany({
		where: {
			studentID: Number(stdId),
		},
		include: {
			student: {
				include: {
					prefix: true,
					institute: true, // รวมข้อมูล institute ด้วย
				},
			},
			institute:{
				include: {
					prefix: true,
				},
			}
		},
	});

	if (!form09) return;

	return form09 as IDelayThesisForm[];
};
