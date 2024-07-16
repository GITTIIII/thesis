import { Institute } from "./institute";

export type School = {
	id: number;
	schoolName: string;

	instituteID: number;
	institute: Institute;
};
