import {
	IComprehensiveExamCommitteeForm,
	IQualificationExamCommitteeForm,
	IOutlineCommitteeForm,
	IExamCommitteeForm,
	IOutlineForm,
	IThesisProgressForm,
	IThesisExamAppointmentForm,
} from "@/interface/form";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const get01FormById = async (formId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form01 = await db.comprehensiveExamCommitteeForm.findUnique({
		where: {
			id: Number(formId),
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

	return form01 as IComprehensiveExamCommitteeForm;
};

export const get02FormById = async (formId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form02 = await db.qualificationExamCommitteeForm.findUnique({
		where: {
			id: Number(formId),
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

	return form02 as IQualificationExamCommitteeForm;
};

export const get03FormById = async (formId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form03 = await db.thesisOutlineCommitteeForm.findUnique({
		where: {
			id: Number(formId),
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

	return form03 as IOutlineCommitteeForm;
};

export const get04FormById = async (formId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form04 = await db.thesisExamCommitteeForm.findUnique({
		where: {
			id: Number(formId),
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

	return form04 as IExamCommitteeForm;
};

export const get05FormById = async (formId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form05 = await db.outlineForm.findUnique({
		where: {
			id: Number(formId),
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

	return form05 as IOutlineForm;
};

export const get06FormById = async (formId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form06 = await db.thesisProgressForm.findUnique({
		where: {
			id: Number(formId),
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

	return form06 as IThesisProgressForm;
};

export const get07FormById = async (formId: number) => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const form07 = await db.thesisExamAppointmentForm.findUnique({
		where: {
			id: Number(formId),
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

	return form07 as IThesisExamAppointmentForm;
};
