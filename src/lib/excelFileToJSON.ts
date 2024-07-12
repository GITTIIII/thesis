import { User } from "../interface/user"
const excelToJson = require("convert-excel-to-json")
import { hash } from "bcrypt"

export const excelFileToJson = async (
  path: string,
  columnKey: string
): Promise<User[]> => {
  const columnKey_ = JSON.parse(columnKey)
  const result = excelToJson({
    sourceFile: path,
    columnToKey: columnKey_,
  })

  return await convertToUsers(result.Sheet1)
}

const convertToUsers = async (arr: any[]): Promise<User[]> => {
  return Promise.all(
    arr.map(async (obj) => {
      const hashedPassword = await hash(String(obj.password), 10)
      const user: User = {
        firstName: obj.firstName ? String(obj.firstName) : "",
        lastName: obj.lastName ? String(obj.lastName) : "",
        username: obj.username ? String(obj.username) : "",
        password: hashedPassword,
        email: obj.email ? String(obj.email) : "",
        phone: obj.phone ? String(obj.phone) : "",
        sex: obj.sex ? String(obj.sex) : "",
        educationLevel: obj.educationLevel ? String(obj.educationLevel) : "",
        school: obj.school ? String(obj.school) : "",
        program: obj.program ? String(obj.program) : "",
        programYear: obj.programYear ? String(obj.programYear) : "",
        position: obj.position ? obj.position : "NONE",
        role: obj.role ? obj.role : "STUDENT",
        formState: obj.formState ? Number(obj.formState) : 1,
        signatureUrl: obj.signatureUrl ? String(obj.signatureUrl) : "",
        profileUrl: obj.profileUrl ? String(obj.profileUrl) : "",
      }
      return user
    })
  )
}
