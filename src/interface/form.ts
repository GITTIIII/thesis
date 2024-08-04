import { IExpert } from "./expert";
import { IUser } from "./user";

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

export type IOutlineForm = {
	id: number;
	date: string;
	thesisNameTH: string;
	thesisNameEN: string;
	abstract: string;
	processPlan: Array<any>;
	times: number;
	thesisStartMonth: string;
	thesisStartYear: string;

	studentID: number;
	student: IUser;

	outlineCommitteeID: number;
	outlineCommittee: IExpert;
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

export type IThesisProgressForm = {
	id: number;
	times: number;
	trimester: number;
	status: string;
	statusComment: string;
	percentage: number;
	percentageComment: string;
	issues: string;
	date: string;
	processPlan: Array<any>;
	studentID: number;
	student: IUser;

	assessmentResult: string;
	advisorSignUrl: string;
	dateAdvisor: string;

	headSchoolComment: string;
	headSchoolSignUrl: string;
	dateHeadSchool: string;
	headSchoolID: number;
	headSchool: IUser;
};
