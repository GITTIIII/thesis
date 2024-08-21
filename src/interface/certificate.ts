import { IUser } from "./user";

export type ICertificate = {
	id: number;
	certificateType: string;
	fileName: string;
	fileType: string;
    description: string;

	userID: number;
	user: IUser;
};
