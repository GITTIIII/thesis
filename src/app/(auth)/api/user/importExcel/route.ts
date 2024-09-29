import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import { excelFileToJson } from "../../../../../lib/excelFileToJSON";
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
  institute: string;
  school: string;
}
export const POST = async (req: Request) => {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const columnKey = formData.get("columnKey") as string;

  // Validate that a file was received
  if (!file) {
    return NextResponse.json({ Error: "No files received." }, { status: 400 });
  }
  // Validate that a columnKey was received
  if (!columnKey) {
    return NextResponse.json({ Error: "No column key received." }, { status: 400 });
  }

  const filename = file.name.replaceAll(" ", "_");
  const re = /(\.xlsx)$/i;

  // Validate the file format
  if (!re.exec(filename)) {
    return NextResponse.json(
      { Error: "Invalid file format. Please upload a valid Excel file." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const pathExcel = path.join(process.cwd(), `public/asset/${filename}`);

  try {
    const message: Message[] = [];
    await writeFile(pathExcel, buffer);
    const users = await excelFileToJson(pathExcel, columnKey);

    for (let user of users) {
      // Initialize an empty message object for the current user
      const userMessage: Message = {
        id: user.username,
        name: `${user.prefix} ${user.firstName} ${user.lastName}`,
        message: [],
      };
      const emptyFields = checkEmptyFields(user);
      if (emptyFields.length > 0) {
        const formattedFields = emptyFields
          .map((field) =>
            field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
          )
          .join(", ");

        userMessage.message.push(`มีข้อมูลว่าง: ${formattedFields}`);
      }

      if (!validateEmail(user.email)) {
        userMessage.message.push("รูปแบบอีเมลไม่ถูกต้อง");
      }

      const institute = await db.institute.findFirst({
        where: {
          instituteNameTH: user.institute,
        },
      });
      if (institute == null) {
        userMessage.message.push("ไม่พบสำนักวิชา");
      }

      const program = await db.program.findFirst({
        where: {
          programNameTH: user.program,
        },
      });
      if (program == null) {
        userMessage.message.push("ไม่พบหลักสูตร");
      }

      const school = await db.school.findFirst({
        where: {
          schoolNameTH: user.school,
        },
      });
      if (school == null) {
        userMessage.message.push("ไม่พบสาขาวิชา");
      }

      const prefix = await db.prefix.findFirst({
        where: {
          prefixTH: user.prefix,
        },
      });
      if (prefix == null) {
        userMessage.message.push("ไม่พบคำนำหน้า");
      }

      const username = await db.user.findFirst({
        where: {
          username: user.username,
        },
      });
      if (username != null) {
        userMessage.message.push("มีชื่อผู้ใช้นี้แล้ว");
      }

      if (userMessage.message.length == 0) {
        await CreateStudent({
          prefixID: prefix?.id,
          firstNameTH: user.firstName,
          lastNameTH: user.lastName,
          username: user.username,
          password: user.password,
          email: user.email,
          degree: user.degree,
          sex: user.sex,
          position: user.position,
          role: user.role,
        });
      }
      message.push(userMessage);
    }
    return NextResponse.json(
      { message: "Users Created", data: message },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ Error: error || "An error occurred" }, { status: 500 });
  } finally {
    await unlink(pathExcel);
  }
};
interface Message {
  id: string;
  name: string;
  message: string[];
}
const CreateStudent = async (users: any) => {
  try {
    const newUsers = await db.user.create({
      data: users,
    });
    return newUsers;
  } catch (error) {
    throw error;
  }
};
function checkEmptyFields(user: any): string[] {
  const emptyFields = [];
  for (const key in user) {
    if (key === "phone" || key === "sex") {
      continue;
    }
    if (user[key] === "" || user[key] === null || user[key] === undefined) {
      emptyFields.push(key);
    }
  }
  return emptyFields;
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
