import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { uploadFileToBucket } from "@/lib/file";

const MAX_FILE_SIZE = 1024 * 1024 * 5;

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const formData = await req.formData();
		const file: File | null = formData.get("file") as File | null;
		const certificateType = formData.get("certificateType") as string;
		const description = formData.get("description") as string | null;
		const userID = formData.get("id") as string | null;

		if (!userID) {
			return NextResponse.json({ error: "User ID is required" }, { status: 400 });
		}

		if (!file) {
			return NextResponse.json({ error: "File is required" }, { status: 400 });
		}

		if (file.size > MAX_FILE_SIZE) {
			throw new Error("File size should be less than 5MB.");
		}

		await uploadFileToBucket(file);

		const certificate = await db.certificate.create({
			data: {
				certificateType: certificateType,
				fileName: file.name,
				fileType: file.type,
				description: description,
				userID: Number(userID),
			},
		});

		const { ...rest } = certificate;

		return NextResponse.json({ form: rest, message: "File Uploaded" }, { status: 200 });
	} catch (error) {
		const err = error as Error;
		console.log(err.message);
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}

	const certificate = await db.certificate.findMany({});

	return NextResponse.json(certificate);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { id, certificateType, fileName, fileType, description } = body;

		if (!id) {
			return NextResponse.json({ message: "Certificate ID is required for update" }, { status: 400 });
		}

		const existingCertificate = await db.certificate.findUnique({
			where: { id: id },
		});

		if (!existingCertificate) {
			return NextResponse.json({ user: null, message: "Certificate not found" }, { status: 404 });
		}

		const certificate = await db.certificate.update({
			where: { id: id },
			data: {
				certificateType: existingCertificate.certificateType || certificateType,
				fileName: existingCertificate.fileName || fileName,
				fileType: existingCertificate.fileType || fileType,
				description: existingCertificate.description || description,
			},
		});

		const { ...rest } = certificate;

		return NextResponse.json({ form: rest, message: "Certificate Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
