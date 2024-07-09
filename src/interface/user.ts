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
