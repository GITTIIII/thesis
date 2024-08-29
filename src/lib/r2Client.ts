import AWS from "aws-sdk";

// Custom configuration type to include 'endpoint'
const config = {
	accessKeyId: process.env.R2_ACCESS_KEY_ID,
	secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
	endpoint: process.env.R2_ENDPOINT,
	region: "auto",
	signatureVersion: "v4",
};

// Use type assertion to bypass TypeScript error
const r2 = new AWS.S3(config as AWS.S3.ClientConfiguration);

export default r2;
