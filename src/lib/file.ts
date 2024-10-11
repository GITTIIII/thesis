import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DeleteObjectCommand, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Configure Cloudflare R2
const r2 = new S3Client({
	region: "auto",
	endpoint: process.env.R2_ENDPOINT!,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function uploadFileToBucket(file: File, folder: string) {
	try {
		const key = `${folder}/${file.name}`;
		const upload = new Upload({
			client: r2,
			params: {
				Bucket: process.env.R2_BUCKET_NAME!,
				Key: key,
				Body: file.stream(),
				ACL: "public-read",
				ContentType: file.type,
			},
		});
		const res = await upload.done();
		return res;
	} catch (error) {
		console.error("Error uploading file:", error);
		throw error;
	}
}

export async function deleteFileFromBucket(fileName: string, folder: string) {
	try {
		const key = `${folder}/${fileName}`;
		const deleteCommand = new DeleteObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: key,
		});
		const res = await r2.send(deleteCommand);
		return res;
	} catch (error) {
		console.error("Error deleting file:", error);
		throw error;
	}
}

export async function getFileUrl(fileName: string, folder: string) {
	try {
		const key = `${folder}/${fileName}`;
		const url = await getSignedUrl(
			r2,
			new GetObjectCommand({
				Bucket: process.env.R2_BUCKET_NAME,
				Key: key,
			}),
			{ expiresIn: 3600 }
		);
		return url;
	} catch (error) {
		console.error("Error getting Url", error);
		throw error;
	}
}
