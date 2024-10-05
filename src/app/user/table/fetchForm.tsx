import {
	get01FormByStdId,
	get02FormByStdId,
	get03FormByStdId,
	get04FormByStdId,
	get05FormByStdId,
	get06FormByStdId,
	get07FormByStdId,
	get08FormByStdId,
	get09FormByStdId,
} from "@/app/action/getFormByStdId";
import {
	get01FormBySchoolId,
	get02FormBySchoolId,
	get03FormBySchoolId,
	get04FormBySchoolId,
	get05FormBySchoolId,
	get06FormBySchoolId,
	get07FormBySchoolId,
	get08FormBySchoolId,
} from "@/app/action/getFormBySchoolId";
import {
	getAll01Form,
	getAll02Form,
	getAll03Form,
	getAll04Form,
	getAll05Form,
	getAll06Form,
	getAll07Form,
    getAll08Form,
	getAll09Form,
} from "@/app/action/getAllForm";
import { IUser } from "@/interface/user";

const fetchFormData = async (formSelect: string, user: IUser) => {
	if (user.role == "STUDENT") {
		switch (formSelect) {
			case "form01":
				return await get01FormByStdId(user.id);
			case "form02":
				return await get02FormByStdId(user.id);
			case "form03":
				return await get03FormByStdId(user.id);
			case "form04":
				return await get04FormByStdId(user.id);
			case "form05":
				return await get05FormByStdId(user.id);
			case "form06":
				return await get06FormByStdId(user.id);
			case "form07":
				return await get07FormByStdId(user.id);
			case "form08":
				return await get08FormByStdId(user.id);
			case "form09":
				return await get09FormByStdId(user.id);
			default:
				return;
		}
	} else if (user.role == "ADMIN" && user.position != "NONE") {
		switch (formSelect) {
			case "form01":
				return await get01FormBySchoolId(user.schoolID);
			case "form02":
				return await get02FormBySchoolId(user.schoolID);
			case "form03":
				return await get03FormBySchoolId(user.schoolID);
			case "form04":
				return await get04FormBySchoolId(user.schoolID);
			case "form05":
				return await get05FormBySchoolId(user.schoolID);
			case "form06":
				return await get06FormBySchoolId(user.schoolID);
			case "form07":
				return await get07FormBySchoolId(user.schoolID);
			case "form08":
				return await get08FormBySchoolId(user.schoolID);
			default:
				return;
		}
	} else {
		switch (formSelect) {
			case "form01":
				return await getAll01Form();
			case "form02":
				return await getAll02Form();
			case "form03":
				return await getAll03Form();
			case "form04":
				return await getAll04Form();
			case "form05":
				return await getAll05Form();
			case "form06":
				return await getAll06Form();
			case "form07":
				return await getAll07Form();
			case "form08":
				return await getAll08Form();
			case "form09":
				return await getAll09Form();
			default:
				return;
		}
	}
};

export default fetchFormData;
