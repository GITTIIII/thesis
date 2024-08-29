import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { deleteFileFromBucket } from "@/lib/file";

export async function DELETE(req: Request, { params }: { params: { certificateId: string } }) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const id = parseInt(params.certificateId) 

		if (!id) {
			return NextResponse.json({ message: "Certificate ID is required for update" }, { status: 400 });
		}

		const existingCertificate = await db.certificate.findUnique({
			where: { id: id },
		});

		if (!existingCertificate) {
			return NextResponse.json({ user: null, message: "Certificate not found" }, { status: 404 });
		}

		await deleteFileFromBucket(existingCertificate.fileName);

		const certificate = await db.certificate.delete({
			where: { id: id },
		});

		const { ...rest } = certificate;

		return NextResponse.json({ form: rest, message: "Certificate Deleted" }, { status: 200 });
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
}