import { School } from "./school";

export type Program = {
	id: number;
	programName: string;
	programYear: string;
	schoolID: number;
	school: School;
};
