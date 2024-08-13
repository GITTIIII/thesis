import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

// Set up the maximum file size (5MB)
const MAX_FILE_SIZE = 1024 * 1024 * 5;

// Configure Cloudflare R2
const r2 = new S3Client({
	region : "auto",
	endpoint: process.env.R2_ENDPOINT!,
	credentials:{

		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	}
	// signatureVersion: "v4",
});

export const POST = async (req: Request, { params }: { params: { userID: number } }) => {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const formData = await req.formData();
		const file:File = formData.get("file") as File; 
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		if (!file) {
			return NextResponse.json({ error: "File is required" }, { status: 404 });
		}

		if (file.size > MAX_FILE_SIZE) {
			throw new Error("File size should be less than 5MB.");
		}

		const putObjectCommand = new PutObjectCommand( {
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: file.name,
			Body: buffer,
		})

		// Upload the file to Cloudflare R2
		const uploadResult = await r2.send(putObjectCommand);

		return NextResponse.json({ fileUrl: uploadResult }, { status: 200 });
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
};
