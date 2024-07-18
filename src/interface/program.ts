import { ISchool } from "./school";

export type IProgram = {
	id: number;
	programName: string;
	programYear: string;
	schoolID: number;
	school: ISchool;
};
