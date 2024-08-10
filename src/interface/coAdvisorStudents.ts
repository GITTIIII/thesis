import { IUser } from "./user";

export type ICoAdvisorStudents = {
    studentID: number;
    student: IUser;
    coAdvisorID: number;
    coAdvisor: IUser;
}