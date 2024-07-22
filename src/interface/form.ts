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

export type IComprehensiveExamCommitteeForm = {
	id: number;
	date: string;
	trimester: number;
	academicYear: string;
	committeeName1: string;
	committeeName2: string;
	committeeName3: string;
	committeeName4: string;
	committeeName5: string;
	numberStudent: number;
	times: number;
	examDay: string;

	studentID: number;
	student: IUser;
};

export type IQualificationExamCommitteeForm = {
	id: number;
	date: string;
	trimester: number;
	academicYear: string;
	committeeName1: string;
	committeeName2: string;
	committeeName3: string;
	committeeName4: string;	
	committeeName5: string;
	numberStudent: number;
	times: number;
	examDay: string;

	studentID: number;
	student: IUser;
};
