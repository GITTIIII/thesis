import { IInstitute } from "./institute";

export type ISchool = {
	id: number;
	schoolName: string;

	instituteID: number;
	institute: IInstitute;
};
