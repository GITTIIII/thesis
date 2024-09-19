import { IInstitute } from "./institute";
import { ISchool } from "./school";
import { IProgram } from "./program";
import { IPrefix } from "./prefix";
import { ICoAdvisorStudents } from "./coAdvisorStudents";
import { ICertificate } from "./certificate";

export type IUser = {
	id: number;
	prefixID: number;
	prefix?: IPrefix ;
	firstNameTH: string;
	lastNameTH: string;
	firstNameEN: string;
	lastNameEN: string;
	username: string;
	password?: string;
	email: string;
	phone: string;
	sex: string;
	degree: string;
	certificate?: ICertificate[]; 

	instituteID: number;
	institute?: IInstitute;

	schoolID: number;
	school?: ISchool;

	programID: number;
	program?: IProgram | null ;

	position: string;
	role: string;
	formState: number;
	signatureUrl: string;
	profileUrl: string;

	advisorID: number;
	advisor?: IUser | null ;

	coAdvisedStudents?: ICoAdvisorStudents[] | null ;
};
