export type IUser = {
  id: number
  firstName: string
  lastName: string
  username: string
  educationLevel: string
  school: string
  role: string
  formState: number
  position: string
  program: string
  programYear: string
  advisorID: number
  co_advisorID: number
  signatureUrl: string
}

export interface User {
  firstName: string
  lastName: string
  username: string
  password: string
  email: string
  phone: string
  sex: string
  educationLevel: string
  school: string
  program: string
  programYear: string
  position: Position | Position.NONE
  role: Role | Role.STUDENT
  formState: number
  signatureUrl: string
  profileUrl: string
}

enum Position {
  NONE,
  ADVISOR,
  HEAD_INSTITUTE,
  COMMOTTEE_OUTLINE,
  COMMOTTEE_INSTITUTE,
  COMMOTTEE_EXAMING,
}

enum Role {
  STUDENT,
  COMMOTTEE,
  ADMIN,
  SUPER_ADMIN,
}
