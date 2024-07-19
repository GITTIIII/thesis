import { ISchool } from "./school";

export type IInstitute = {
	id: number;
	instituteNameTH: string;
	instituteNameEN: string;

	schoolID: number;
	school: ISchool;
};
