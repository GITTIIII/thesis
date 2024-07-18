import { IProgram } from "./program";
import { ISchool } from "./school";

export type IInstitute = {
	id: number;
	instituteName: string;

	schoolID: number;
	school: ISchool;
	programID: number;
	program: IProgram;
};
