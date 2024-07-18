const excelToJson = require("convert-excel-to-json");
import { hash } from "bcrypt";
import { db } from "@/lib/db";

export const excelFileToJson = async (
  path: string,
  columnKey: string
): Promise<User[]> => {
  const columnKey_ = JSON.parse(columnKey);
  const result = excelToJson({
    sourceFile: path,
    columnToKey: columnKey_,
  });

  return await convertToUsers(result.Sheet1);
};
interface User {
  prefix: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
  sex: string;
  degree: string;
  role: string;
  position: string;
  instituteID: number;
  schoolID: number;
}
const convertToUsers = async (arr: any[]): Promise<User[]> => {
  return Promise.all(
    arr.map(async (obj) => {
      const schoolID = await db.school.findUnique({
        where: { schoolName: obj.schoolName ? String(obj.schoolName) : "" },
      });
      const hashedPassword = await hash(String(obj.password), 10);
      const user: User = {
        prefix: obj.prefix ? String(obj.prefix) : "",
        firstName: obj.firstName ? String(obj.firstName) : "",
        lastName: obj.lastName ? String(obj.lastName) : "",
        password: hashedPassword,
        username: obj.username ? String(obj.username) : "",
        email: obj.email ? String(obj.email) : "",
        phone: obj.phone ? String(obj.phone) : "",
        sex: obj.sex ? String(obj.sex) : "",
        degree: obj.degree ? String(obj.degree) : "",
        role: "STUDENT",
        position: "NONE",
        instituteID: Number(schoolID?.instituteID),
        schoolID: Number(schoolID?.id),
      };
      return user;
    })
  );
};
