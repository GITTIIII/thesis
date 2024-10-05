import { date, number, string } from "zod";
import { IExpert } from "./expert";
import { IUser } from "./user";

export interface IProcessPlan {
	step: string;
	months: number[];
}

export interface addNotes {
	committeeNumber?: number;
	meetingNumber?: number;
	date?: Date;
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
	headSchoolID?: number;
	headSchoolSignUrl?: string;
	headSchool?: IUser;

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
	headSchoolID?: number;
	headSchoolSignUrl?: string;
	headSchool?: IUser;

	studentID: number;
	student: IUser;
};

//03
export type IOutlineCommitteeForm = {
	id: number;
	date: Date;
	trimester: number;
	academicYear: string;
	committeeMembers: Array<any>;
	times: number;
	examDate: Date;

	studentID: number;
	student: IUser;

	advisorSignUrl?: string;

	headSchoolID?: number;
	headSchoolSignUrl?: string;
	headSchool?: IUser;

	instituteComSignUrl?: string;

	addNotes?: Array<addNotes>;
};

//04
export type IExamCommitteeForm = {
	id: number;
	date: Date;
	trimester: number;
	academicYear: string;
	committeeMembers: Array<any>;
	times: number;
	examDate: Date;

	studentID: number;
	student: IUser;

	advisorID?: number;
	advisor?: IUser;
	advisorSignUrl?: string;

	headSchoolID?: number;
	headSchoolSignUrl?: string;
	headSchool?: IUser;

	instituteComSignUrl?: string;

	addNotes?: Array<addNotes>;
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
	formStatus: string;
	editComment?: string;

	studentID: number;
	student: IUser;

	outlineCommitteeID?: number;
	outlineCommittee?: IExpert;
	outlineCommitteeStatus?: string;
	outlineCommitteeComment?: string;
	outlineCommitteeSignUrl?: string;
	dateOutlineCommitteeSign?: Date;

	instituteCommitteeID?: number;
	instituteCommittee?: IUser;
	instituteCommitteeStatus?: string;
	instituteCommitteeComment?: string;
	instituteCommitteeSignUrl?: string;
	dateInstituteCommitteeSign?: Date;
};

// 06
export type IThesisProgressForm = {
	id: number;
	times: number;
	trimester: number;
	status: string;
	statusComment?: string;
	percentage: number;
	percentageComment?: string;
	issues?: string;
	date: Date;
	processPlan: Array<any>;
	studentID: number;
	student: IUser;

	assessmentResult?: string;
	advisorSignUrl?: string;
	dateAdvisor?: Date;

	headSchoolComment?: string;
	headSchoolSignUrl?: string;
	dateHeadSchool?: Date;
	headSchoolID?: number;
	headSchool?: IUser;
};

// 07
export type IThesisExamAppointmentForm = {
	id: number;
	trimester: number;
	academicYear: string;
	gpa: string;
	credits: number;
	date: Date;
	dateExam: Date;
	studentID: number;
	student: IUser;

	has01Certificate?: boolean;
	has02Certificate?: boolean;
	has03Certificate?: boolean;
	hasOtherCertificate?: boolean;

	presentationFund?: boolean;
	presentationFundSignUrl?: string;
	researchProjectFund?: boolean;
	researchProjectFundSignUrl?: string;
	turnitinVerified?: boolean;
	turnitinVerifiedSignUrl?: string;

	advisorSignUrl?: string;
	dateAdvisor?: Date;

	headSchoolComment?: string;
	headSchoolSignUrl?: string;
	dateHeadSchool?: Date;
	headSchoolID?: number;
	headSchool?: IUser;
};

export type IThesisExamAssessmentForm = {
	id: number;
	date: Date;
	examDate: Date;
	disClosed: boolean;
	studentID: number;
	student: IUser;

	// ผลสอบ
	result?: string;
	presentationComment?: string;
	explanationComment?: string;
	answerQuestionComment?: string;
	failComment?: string;

	// การเปลี่ยนชื่อ
	reviseTitle?: boolean;
	newThesisNameTH?: string;
	newThesisNameEN?: string;

	// ลายเซ็นกรรมการ
	headOfCommitteeID?: number;
	headOfCommittee?: IExpert;
	headOfCommitteeSignUrl?: string;
	advisorSignUrl?: string;
	coAdvisors?: Array<any>;
	committees?: Array<any>;

	// กรรมการสำนัก
	times?: string;
	dateInstituteCommitteeSign?: Date;
	instituteCommitteeStatus?: string;
	instituteCommitteeComment?: string;
	instituteCommitteeSignUrl?: string;
	instituteCommitteeID?: number;
	instituteCommittee?: IUser;
};

export type IDelayThesisForm = {
	id: number;
	headCommitteeName: string;
	startDate: Date;
	endDate: Date;
	studentSignUrl: string;
	thesisNameTH: string;
	thesisNameEN: string;
	date: Date;
	publishmentName: string;

	instituteSignUrl?: string;
	instituteID?: number;
	approve?: string;
	timeApprove: number;
	dayApprove?: Date;
	studentID: number;
	student: IUser;
	institute: IUser;
	disapproveComment?: string;
};
