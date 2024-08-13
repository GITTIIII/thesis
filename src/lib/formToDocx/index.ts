import createReport from "docx-templates";
import fs from "fs";

export const genDocx = async (path: string, data: any) => {
	try {
		const template = fs.readFileSync(path);

		// Function to process image data

		const buffer = await createReport({
			template,
			data,
			cmdDelimiter: ["{", "}"],
			additionalJsContext: {
				image: (url: string) => {
					const data = url.slice("data:image/png;base64,".length);
					return { width: 5, height: 3, data, extension: ".png" };
				},
			},
		});

		return buffer;
	} catch (error) {
		console.log("Error generating DOCX:", error);
		throw error;
	}
};
