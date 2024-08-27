import { IExpert } from "./expert";
import { IUser } from "./user";

export interface IProcessPlan {
	step: string;
	months: number[];
}

// 01
export type IComprehensiveExamCommitteeForm = {
	id: number;
	date: Date;
	trimester: number;
	academicYear: string;
	committeeName1: string;
	committeeName2: string;
	committeeName3: string;
	committeeName4: string;
	committeeName5: string;
	numberStudent: number;
	times: number;
	examDay: Date;
	headSchoolID: number;
	headSchoolSignUrl: string;
	headSchool: IUser;

	studentID: number;
	student: IUser;
};

// 02
export type IQualificationExamCommitteeForm = {
	id: number;
	date: Date;
	trimester: number;
	academicYear: string;
	committeeName1: string;
	committeeName2: string;
	committeeName3: string;
	committeeName4: string;
	committeeName5: string;
	numberStudent: number;
	times: number;
	examDay: Date;
	headSchoolID: number;
	headSchoolSignUrl: string;
	headSchool: IUser;

	studentID: number;
	student: IUser;
};

//03
export type IOutlineCommitteeForm = {
	id: number;
	date: Date;
	trimester: number;
	academicYear: string;
	committeeMembers: { name: string }[];
	times: number;
	examDate: Date;
	headSchoolID: number;
	headSchoolSignUrl: string;
	headSchool: IUser;

	studentID: number;
	student: IUser;
};
// 05
export type IOutlineForm = {
	id: number;
	date: Date;
	thesisNameTH: string;
	thesisNameEN: string;
	abstract: string;
	processPlan: Array<any>;
	times: string;
	thesisStartMonth: string;
	thesisStartYear: string;

	studentID: number;
	student: IUser;

	outlineCommitteeID: number;
	outlineCommittee: IExpert;
	outlineCommitteeStatus: string;
	outlineCommitteeComment: string;
	outlineCommitteeSignUrl: string;
	dateOutlineCommitteeSign: Date;

	instituteCommitteeID: number;
	instituteCommittee: IUser;
	instituteCommitteeStatus: string;
	instituteCommitteeComment: string;
	instituteCommitteeSignUrl: string;
	dateInstituteCommitteeSign: Date;
};

// 06
export type IThesisProgressForm = {
	id: number;
	times: number;
	trimester: number;
	status: string;
	statusComment: string;
	percentage: number;
	percentageComment: string;
	issues: string;
	date: Date;
	processPlan: Array<any>;
	studentID: number;
	student: IUser;

	assessmentResult: string;
	advisorSignUrl: string;
	dateAdvisor: Date;

	headSchoolComment: string;
	headSchoolSignUrl: string;
	dateHeadSchool: Date;
	headSchoolID: number;
	headSchool: IUser;
};

// 07
export type IThesisExamAppointmentForm = {
	id: number;
	trimester: number;
	academicYear: String;
	gpa: String;
	credits: number;
	date: Date;
  dateExam: Date;
	studentID: number;
  student: IUser;

	turnitinApproval: Boolean;
	advisorSignUrl: string;
	dateAdvisor: Date;

	headSchoolComment: string;
	headSchoolSignUrl: string;
	dateHeadSchool: Date;
	headSchoolID: number;
	headSchool: IUser;
};
