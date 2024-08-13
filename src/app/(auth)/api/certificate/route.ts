import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { type, fileUrl, description, userID } = body;

		const certificate = await db.certificate.create({
			data: {
				type,
				fileUrl,
				description,
				userID,
			},
		});

		const { ...rest } = certificate;

		return NextResponse.json({ form: rest, message: "Certificate Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
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
		const { id, type, fileUrl, description } = body;

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
				type: existingCertificate.type || type,
				fileUrl: existingCertificate.fileUrl || fileUrl,
				description: existingCertificate.description || description,
			},
		});

		const { ...rest } = certificate;

		return NextResponse.json({ form: rest, message: "Certificate Updated" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}
