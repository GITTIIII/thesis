import { Institute } from "./institute";
import { School } from "./school";
import { Program } from "./program";

export type IUser = {
	id: number;
	firstName: string;
	lastName: string;
	username: string;
	password: string;
	email: string;
	phone: string;
	sex: string;
	degree: string;
	instituteID: number;
	institute: Institute;

	schoolID: number;
	school: School;

	programID: number;
	program: Program;
	position: Position | Position.NONE;
	role: Role | Role.STUDENT;
	formState: number;
	signatureUrl: string;
	profileUrl: string;
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
