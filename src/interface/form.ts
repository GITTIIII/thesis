import {IUser} from "./user"

export type IOutlineForm ={
    id: number;
	date: string;
	thesisNameTH: string;
	thesisNameEN: string;

	studentID: number;
	student: IUser;
	advisorID: number;
	advisor: IUser;
	coAdvisorID: number;
	coAdvisor: IUser;

	outlineCommitteeID: number;
	outlineCommittee: IUser;
	outlineCommitteeStatus: string;
	outlineCommitteeComment: string;
	dateOutlineCommitteeSign: string;

	instituteCommitteeID: number;
	instituteCommittee: IUser;
	instituteCommitteeStatus: string;
	instituteCommitteeComment: string;
	dateInstituteCommitteeSign: string;
}