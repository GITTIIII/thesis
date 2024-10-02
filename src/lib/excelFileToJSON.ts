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
  degree: string;
  institute: string;
  school: string;
  advisor: string;
  sex: string;
  phone: string;
  rawPassword: string;
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
        rawPassword: obj.password ? String(obj.password) : "",
        username: obj.username ? String(obj.username) : "",
        email: obj.email ? String(obj.email) : "",
        degree: obj.degree ? String(obj.degree) : "",
        institute: obj.institute ? String(obj.institute) : "",
        school: obj.school ? String(obj.school) : "",
        program: obj.program ? String(obj.program) : "",
        advisor: obj.advisor ? String(obj.advisor) : "",
        sex: obj.sex ? String(obj.sex) : "",
        phone: obj.phone ? String(obj.phone) : "",
      };
      return user;
    })
  );
};
