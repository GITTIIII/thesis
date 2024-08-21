import { IInstitute } from "./institute";
import { ISchool } from "./school";
import { IProgram } from "./program";
import { IPrefix } from "./prefix";
import { ICoAdvisorStudents } from "./coAdvisorStudents";
import { ICertificate } from "./certificate";

export type IUser = {
	name: string;
	map(arg0: (data: IUser) => import("react").JSX.Element): import("react").ReactNode;
	id: number;
	prefixID: number;
	prefix :IPrefix
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
	certificate: ICertificate;

	instituteID: number;
	institute: IInstitute;

	schoolID: number;
	school: ISchool;

	programID: number;
	program: IProgram;

	position: Position;
	role: Role;
	formState: number;
	signatureUrl: string;
	profileUrl: string;

	advisorID: number;
	advisor: IUser;

	coAdvisedStudents: ICoAdvisorStudents
};

enum Position {
	NONE,
	ADVISOR,
	HEAD_OF_SCHOOL,
	HEAD_OF_INSTITUTE
}

enum Role {
	STUDENT,
	ADMIN,
	SUPER_ADMIN,
}
