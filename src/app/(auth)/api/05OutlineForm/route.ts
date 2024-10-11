import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromBucket, uploadFileToBucket } from "@/lib/file";
import { de } from "date-fns/locale";

const MAX_FILE_SIZE = 1024 * 1024 * 5;

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const formData = await req.formData();
		const date = formData.get("date") as string;
		const thesisNameTH = formData.get("thesisNameTH") as string;
		const thesisNameEN = formData.get("thesisNameEN") as string;
		const abstractFile: File | null = formData.get("abstractFile") as File | null;
		const processPlanString = formData.get("processPlan") as string;
		const thesisStartMonth = formData.get("thesisStartMonth") as string;
		const thesisStartYear = formData.get("thesisStartYear") as string;
		const formStatus = formData.get("formStatus") as string;
		const studentID = formData.get("studentID") as string;

		if (!abstractFile) {
			return NextResponse.json({ error: "File is required" }, { status: 400 });
		}

		if (abstractFile.size > MAX_FILE_SIZE) {
			throw new Error("File size should be less than 5MB.");
		}

		await uploadFileToBucket(abstractFile, "abstract");

		let processPlan: any[] = [];
		if (processPlanString) {
			try {
				processPlan = JSON.parse(processPlanString);
			} catch (error) {
				console.error("Invalid JSON format for processPlan:", error);
			}
		}

		const newForm = await db.outlineForm.create({
			data: {
				date: new Date(date),
				thesisNameTH: thesisNameTH,
				thesisNameEN: thesisNameEN,
				abstractFileName: abstractFile.name,
				processPlan: processPlan.length > 0 ? processPlan : [],
				thesisStartMonth: thesisStartMonth,
				thesisStartYear: thesisStartYear,
				formStatus: formStatus,
				studentID: Number(studentID),
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Created" }, { status: 200 });
	} catch (error) {
		const err = error as Error;
		console.log(err);
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const outlineForm = await db.outlineForm.findMany({
		include: {
			student: {
				include: {
					prefix: true,
					institute: true,
					school: true,
					program: true,
					advisor: {
						include: {
							prefix: true,
						},
					},
					coAdvisedStudents: {
						include: {
							coAdvisor: {
								include: {
									prefix: true,
								},
							},
						},
					},
				},
			},
			outlineCommittee: true,
			instituteCommittee: {
				include: {
					prefix: true,
				},
			},
		},
	});

	return NextResponse.json(outlineForm);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const formData = await req.formData();

		const id = formData.get("id") as string;
		const date = formData.get("date") as string;
		const thesisNameTH = formData.get("thesisNameTH") as string;
		const thesisNameEN = formData.get("thesisNameEN") as string;
		const abstractFile: File | null = formData.get("abstractFile") as File | null;
		const processPlanString = formData.get("processPlan") as string;
		const times = formData.get("times") as string;
		const thesisStartMonth = formData.get("thesisStartMonth") as string;
		const thesisStartYear = formData.get("thesisStartYear") as string;
		const formStatus = formData.get("formStatus") as string;
		const editComment = formData.get("editComment") as string;
		const studentID = formData.get("studentID") as string;
		const outlineCommitteeID = formData.get("outlineCommitteeID") as string;
		const outlineCommitteeStatus = formData.get("outlineCommitteeStatus") as string;
		const outlineCommitteeComment = formData.get("outlineCommitteeComment") as string;
		const outlineCommitteeSignUrl = formData.get("outlineCommitteeSignUrl") as string;
		const dateOutlineCommitteeSign = formData.get("dateOutlineCommitteeSign") as string;
		const instituteCommitteeID = formData.get("instituteCommitteeID") as string;
		const instituteCommitteeStatus = formData.get("instituteCommitteeStatus") as string;
		const instituteCommitteeComment = formData.get("instituteCommitteeComment") as string;
		const instituteCommitteeSignUrl = formData.get("instituteCommitteeSignUrl") as string;
		const dateInstituteCommitteeSign = formData.get("dateInstituteCommitteeSign") as string;

		if (!id) {
			return NextResponse.json({ message: "Form ID is required for update" }, { status: 400 });
		}

		const existingOutlineForm = await db.outlineForm.findUnique({
			where: { id: Number(id) },
		});

		if (!existingOutlineForm) {
			return NextResponse.json({ user: null, message: "Form not found" }, { status: 404 });
		}

		if (abstractFile && abstractFile.type === "application/pdf") {
			await deleteFileFromBucket(existingOutlineForm.abstractFileName, "abstract");
			await uploadFileToBucket(abstractFile, "abstract");
		}

		let processPlan: any[] = []; // Initialize as an empty array by default

		if (processPlanString) {
			try {
				const parsedPlan = JSON.parse(processPlanString);
				processPlan = Array.isArray(parsedPlan) ? parsedPlan : []; // Ensure processPlan is always an array
			} catch (error) {
				console.error("Invalid JSON format for processPlan:", error);
			}
		}

		const newForm = await db.outlineForm.update({
			where: { id: Number(id) },
			data: {
				date: new Date(date),
				thesisNameTH: thesisNameTH || existingOutlineForm.thesisNameTH,
				thesisNameEN: thesisNameEN || existingOutlineForm.thesisNameEN,
				abstractFileName: abstractFile ? abstractFile?.name : existingOutlineForm.abstractFileName,
				processPlan: processPlan.length > 0 ? processPlan : existingOutlineForm.processPlan || [],
				times: times || existingOutlineForm.times,
				thesisStartMonth: thesisStartMonth || existingOutlineForm.thesisStartMonth,
				thesisStartYear: thesisStartYear || existingOutlineForm.thesisStartYear,
				formStatus: formStatus || existingOutlineForm.formStatus,
				editComment: editComment || existingOutlineForm.editComment,
				studentID: Number(studentID) === 0 ? existingOutlineForm.studentID : Number(studentID),

				outlineCommitteeID: Number(outlineCommitteeID) == 0 ? existingOutlineForm.outlineCommitteeID : Number(outlineCommitteeID),
				outlineCommitteeStatus: outlineCommitteeStatus || existingOutlineForm.outlineCommitteeStatus,
				outlineCommitteeComment: outlineCommitteeComment || existingOutlineForm.outlineCommitteeComment,
				outlineCommitteeSignUrl: outlineCommitteeSignUrl || existingOutlineForm.outlineCommitteeSignUrl,
				dateOutlineCommitteeSign: dateOutlineCommitteeSign
					? new Date(dateOutlineCommitteeSign)
					: existingOutlineForm.dateOutlineCommitteeSign,
				instituteCommitteeID:
					Number(instituteCommitteeID) == 0 ? existingOutlineForm.instituteCommitteeID : Number(instituteCommitteeID),
				instituteCommitteeStatus: instituteCommitteeStatus || existingOutlineForm.instituteCommitteeStatus,
				instituteCommitteeComment: instituteCommitteeComment || existingOutlineForm.instituteCommitteeComment,
				instituteCommitteeSignUrl: instituteCommitteeSignUrl || existingOutlineForm.instituteCommitteeSignUrl,
				dateInstituteCommitteeSign: dateInstituteCommitteeSign
					? new Date(dateInstituteCommitteeSign)
					: existingOutlineForm.dateInstituteCommitteeSign,
			},
		});

		const { ...rest } = newForm;

		return NextResponse.json({ form: rest, message: "Form Updated" }, { status: 200 });
	} catch (error) {
		const err = error as Error;
		console.log(err);
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
