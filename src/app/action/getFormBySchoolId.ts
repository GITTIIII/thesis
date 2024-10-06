import {
	IComprehensiveExamCommitteeForm,
	IQualificationExamCommitteeForm,
	IOutlineCommitteeForm,
	IExamCommitteeForm,
	IOutlineForm,
	IThesisProgressForm,
	IThesisExamAppointmentForm,
	IThesisExamAssessmentForm,
} from "@/interface/form";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const get01FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form01 = await db.comprehensiveExamCommitteeForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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

export const get02FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form02 = await db.qualificationExamCommitteeForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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

export const get03FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form03 = await db.thesisOutlineCommitteeForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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

export const get04FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form04 = await db.thesisExamCommitteeForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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

export const get05FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form05 = await db.outlineForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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

export const get06FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form06 = await db.thesisProgressForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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

export const get07FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form07 = await db.thesisExamAppointmentForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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

export const get08FormBySchoolId = async (schoolId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form08 = await db.thesisExamAssessmentForm.findMany({
		where: {
			student: {
				schoolID: Number(schoolId),
			},
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
