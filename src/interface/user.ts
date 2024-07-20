import { IInstitute } from "./institute";
import { ISchool } from "./school";
import { IProgram } from "./program";

export type IUser = {
	id: number;
	formLanguage: string;
	prefix: string;
	firstNameTH: string;
	lastNameTH: string;
	firstNameEN: string;
	lastNameEN: string;
	username: string;
	password: string;
	email: string;
	phone: string;
	sex: string;
	degree: string;

	instituteID: number;
	institute: IInstitute;

	schoolID: number;
	school: ISchool;

	programID: number;
	program: IProgram;

	position: Position | Position.NONE;
	role: Role | Role.STUDENT;
	formState: number;
	signatureUrl: string;
	profileUrl: string;
	approvedExpert: string;
	committeeType: string;

	advisorID: number;
	advisor: IUser;

	coAdvisorID: number;
	coAdvisor: IUser;
};

enum Position {
	NONE,
	ADVISOR,
	HEAD_INSTITUTE,
	COMMOTTEE_OUTLINE,
	COMMOTTEE_INSTITUTE,
	COMMOTTEE_EXAMING,
}

enum Role {
	STUDENT,
	COMMOTTEE,
	ADMIN,
	SUPER_ADMIN,
}
