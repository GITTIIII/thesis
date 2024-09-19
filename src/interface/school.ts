import { IInstitute } from "./institute";

export type ISchool = {
  id: number;
  schoolNameTH: string;
  schoolNameEN: string;

  instituteID: number;
  institute: IInstitute;
};
