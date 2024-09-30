const excelToJson = require("convert-excel-to-json");
import { hash } from "bcrypt";

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
  program: string;
  prefix: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  sex: string;
  degree: string;
  role: string;
  position: string;
  institute: string;
  school: string;
  advisor: string;
}
const convertToUsers = async (arr: any[]): Promise<User[]> => {
  return Promise.all(
    arr.map(async (obj) => {
      const hashedPassword = obj.password && (await hash(String(obj.password), 10));
      const user: User = {
        prefix: obj.prefix ? String(obj.prefix) : "",
        firstName: obj.firstName ? String(obj.firstName) : "",
        lastName: obj.lastName ? String(obj.lastName) : "",
        password: hashedPassword,
        username: obj.username ? String(obj.username) : "",
        email: obj.email ? String(obj.email) : "",
        sex: obj.sex ? String(obj.sex) : "",
        degree: obj.degree ? String(obj.degree) : "",
        role: "STUDENT",
        position: "NONE",
        institute: obj.institute ? String(obj.institute) : "",
        school: obj.school ? String(obj.school) : "",
        program: obj.program ? String(obj.program) : "",
        advisor: obj.advisor ? String(obj.advisor) : "",
      };
      return user;
    })
  );
};
