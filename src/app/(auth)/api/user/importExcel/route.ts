import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, unlink } from "fs/promises";
import { excelFileToJson } from "../../../../../lib/excelFileToJSON";
import { jsonToExcel } from "@/lib/jsonToExcel";
interface User {
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
	program: string;
	rawPassword: string;
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
		return NextResponse.json({ Error: "Invalid file format. Please upload a valid Excel file." }, { status: 400 });
	}

	const buffer = Buffer.from(await file.arrayBuffer());
	const pathExcel = path.join(process.cwd(), `public/asset/${filename}`);

	try {
		const message: Message[] = [];
		const dataError = [];
		await writeFile(pathExcel, buffer);
		const users = await excelFileToJson(pathExcel, columnKey);

		for (let user of users) {
			// Initialize an empty message object for the current user
			const userMessage: Message = {
				id: user.username,
				name: `${user.prefix}${user.firstName} ${user.lastName}`,
				message: [],
			};
			const emptyFields = checkEmptyFields(user);
			if (emptyFields.length > 0) {
				const formattedFields = emptyFields
					.map((field) => field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()))
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
			const advisor = await db.user.findFirst({
				where: {
					firstNameTH: user.advisor.split(" ")[0],
				},
			});
			if (advisor == null) {
				userMessage.message.push("ไม่พบอาจารย์ที่ปรึกษา");
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
			const sex = user.sex == "ชาย" ? "Male" : user.sex == "หญิง" ? "Female" : "";
			const degree = user.degree == "ปริญญาโท" ? "Master" : user.degree == "ปริญญาเอก" ? "Doctoral" : "user.degree";
			if (userMessage.message.length == 0) {
				await CreateStudent({
					firstNameTH: user.firstName,
					lastNameTH: user.lastName,
					username: user.username,
					password: user.password,
					email: user.email,
					degree: degree,
					role: "STUDENT",
					position: "NONE",
					prefixID: prefix?.id,
					schoolID: school?.id,
					programID: program?.id,
					instituteID: institute?.id,
					advisorID: advisor?.id,
					phone: user.phone,
					sex: sex,
					formState: 1,
				});
			} else {
				dataError.push({
					username: user.username,
					prefix: user.prefix,
					firstName: user.firstName,
					lastName: user.lastName,
					password: user.rawPassword,
					email: user.email,
					degree: degree,
					institute: user.institute,
					school: user.school,
					program: user.program,
					advisor: user.advisor,
					phone: user.phone,
					sex: user.sex,
				});
			}
			message.push(userMessage);
		}
		const excel = dataError.length !== 0 ? await jsonToExcel(dataError) : undefined;
		return NextResponse.json(
			{
				message: "Users Created",
				data: message,
				dataError: dataError.length !== 0 ? excel : null,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log(error);
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
const CreateStudent = async (user: any) => {
	try {
		const newUsers = await db.user.create({
			data: user,
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
