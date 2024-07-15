import { Position, PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const instituteData = [
	{ instituteName: "สำนักวิชาวิทยาศาสตร์ " },
	{ instituteName: "สำนักวิชาเทคโนโลยีสังคม " },
	{ instituteName: "สำนักวิชาเทคโนโลยีการเกษตร " },
	{ instituteName: "สำนักวิชาวิศวกรรมศาสตร์ " },
	{ instituteName: "สำนักวิชาแพทยศาสตร์ " },
	{ instituteName: "สำนักวิชาสาธารณสุขศาสตร์" },
	{ instituteName: "สำนักวิชาศาสตร์และศิลป์ดิจิทัล" },
];

const schoolData = [
	{ schoolName: "สาขาคณิตศาสตร์ประยุกต์", instituteID: 1 },
	{ schoolName: "สาขาวิชาคณิตศาสตร์", instituteID: 1 },
	{ schoolName: "สาขาวิชาชีววิทยา", instituteID: 1 },
	{ schoolName: "สาขาวิชาฟิสิกส์", instituteID: 1 },
	{ schoolName: "สาขาวิชาการรับรู้จากระยะไกล", instituteID: 1 },
	{ schoolName: "สาขาวิชาเทคโนโลยีเลเซอร์และโฟตอนนิกส์", instituteID: 1 },
	{ schoolName: "สาขาวิชาจุลชีววิทยา", instituteID: 1 },
	{ schoolName: "สาขาวิชาชีวเคมี", instituteID: 1 },
	{ schoolName: "สาขาวิชาวิทยาศาสตร์การกีฬา", instituteID: 1 },
	{ schoolName: "สาขาวิชากายวิภาคศาสตร์", instituteID: 1 },
	{ schoolName: "สาขาวิชาสรีรวิทยา", instituteID: 1 },
	{ schoolName: "สาขาวิชาปรสิตวิทยา", instituteID: 1 },
	{ schoolName: "สาขาวิชาเภสัชวิทยา", instituteID: 1 },
	{ schoolName: "สถานวิจัยสำนักวิชาวิทยาศาสตร์", instituteID: 1 },
];

const programData = [
	{ programName: "หลักสูตร", programYear: "2000", schoolID: 1 },
];

const userData = [
	{
		prefix: "นาย",
		firstName: "superAdmin",
		lastName: "superAdmin",
		username: "superAdmin",
		password: "superAdmin",
		email: "superAdmin@g.sut.ac.th",
		phone: "",
		sex: "Male",
		degree: "",
		instituteID: null,
		schoolID: null,
		programID: null,
		position: Position.NONE,
		role: Role.SUPER_ADMIN,
		formState: null,
		signatureUrl: "",
		profileUrl: "",
	},
    {
		prefix: "นาย",
		firstName: "ภาณุพงศ์",
		lastName: "ศรีไทย",
		username: "M6407100",
		password: "M6407100",
		email: "M6407100@g.sut.ac.th",
		phone: "0123456789",
		sex: "Male",
		degree: "Master",
		instituteID: 1,
		schoolID: 1,
		programID: 1,
		position: Position.NONE,
		role: Role.STUDENT,
		formState: 1,
		signatureUrl: "",
		profileUrl: "",
	},
	{
		prefix: "นาย",
		firstName: "นัทพล",
		lastName: "ตุงตัง",
		username: "M6405816",
		password: "M6405816",
		email: "M6405816@g.sut.ac.th",
		phone: "0123456789",
		sex: "Male",
		degree: "Master",
		instituteID: 1,
		schoolID: 1,
		programID: 1,
		position: Position.NONE,
		role: Role.STUDENT,
		formState: 1,
		signatureUrl: "",
		profileUrl: "",
	},
	{
		prefix: "นาย",
		firstName: "ธีรโชติ",
		lastName: "สนนอก",
		username: "22222222",
		password: "22222222",
		email: "pualtung@g.sut.ac.th",
		phone: "0123456789",
		sex: "Male",
		degree: "",
		instituteID: 1,
		schoolID: 1,
		programID: null,
		position: Position.ADVISOR,
		role: Role.ADMIN,
		formState: null,
		signatureUrl: "",
		profileUrl: "",
	},
	{
		prefix: "นาย",
		firstName: "ก",
		lastName: "ข",
		username: "22223333",
		password: "22222222",
		email: "22223333@g.sut.ac.th",
		phone: "0123456789",
		sex: "Female",
		degree: "",
		instituteID: null,
		schoolID: null,
		programID: null,
		position: Position.COMMITTEE_OUTLINE,
		role: Role.COMMITTEE,
		formState: null,
		signatureUrl: "",
		profileUrl: "",
	},
    {
		prefix: "นาย",
		firstName: "มีนา",
		lastName: "คม",
		username: "22224444",
		password: "22222222",
		email: "22224444@g.sut.ac.th",
		phone: "0123456789",
		sex: "Female",
		degree: "",
		instituteID: null,
		schoolID: null,
		programID: null,
		position: Position.COMMITTEE_INSTITUTE,
		role: Role.COMMITTEE,
		formState: null,
		signatureUrl: "",
		profileUrl: "",
	},
];

async function main() {
	await prisma.institute.createMany({
		data: instituteData,
		skipDuplicates: true,
	});
	await prisma.school.createMany({
		data: schoolData,
		skipDuplicates: true,
	});
	await prisma.program.createMany({
		data: programData,
		skipDuplicates: true,
	});
	await prisma.user.createMany({
		data: userData,
		skipDuplicates: true,
	});
}

main();
