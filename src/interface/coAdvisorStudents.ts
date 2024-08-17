import { IUser } from "./user";

export type ICoAdvisorStudents = {
	[x: string]: any;
    studentID: number;
    student: IUser;
    coAdvisorID: number;
    coAdvisor: IUser;
}