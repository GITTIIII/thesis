import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Configure Cloudflare R2
const r2 = new S3Client({
	region: "auto",
	endpoint: process.env.R2_ENDPOINT!,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function uploadFileToBucket(file: File, filename: string) {
	let res;
	const upload = new Upload({
		client: r2,
		params: {
			Bucket: process.env.R2_BUCKET_NAME!,
			Key: `${file.name}`,
			Body: file.stream(),
			ACL: "public-read",
			ContentType: file.type,
		},
	});

	res = await upload.done();
}

export async function getFileUrl(key: string) {
	const url = await getSignedUrl(
		r2,
		new GetObjectCommand({
			Bucket: process.env.R2_BUCKET_NAME,
			Key: key,
		}),
		{ expiresIn: 3600 }
	);
	return url;
}
