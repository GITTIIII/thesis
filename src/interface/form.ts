import { IUser } from "./user";

export type IOutlineForm = {
	id: number;
	date: string;
	thesisNameTH: string;
	thesisNameEN: string;
	abstract: string;
	processPlan: JSON;

	studentID: number;
	student: IUser;

	outlineCommitteeID: number;
	outlineCommittee: IUser;
	outlineCommitteeStatus: string;
	outlineCommitteeComment: string;
	outlineCommitteeSignUrl: string;
	dateOutlineCommitteeSign: string;

	instituteCommitteeID: number;
	instituteCommittee: IUser;
	instituteCommitteeStatus: string;
	instituteCommitteeComment: string;
	instituteCommitteeSignUrl: string;
	dateInstituteCommitteeSign: string;
};
export interface IProcessPlan {
	step: string;
	months: number[];
}
