import createReport from "docx-templates";
import fs from "fs";

export const genDocx = async (docName: string, data: any, width = 5, height = 2) => {
  const path = `src/lib/formToDocx/docTemplate/${docName}`;
  try {
    const templateBuffer = fs.readFileSync(path);

    const template = new Uint8Array(
      templateBuffer.buffer,
      templateBuffer.byteOffset,
      templateBuffer.length
    );

    const buffer = await createReport({
      template,
      data,
      cmdDelimiter: ["{", "}"],
      additionalJsContext: {
        image: (url: string) => {
          const data = url.slice("data:image/png;base64,".length);
          return { width: width, height: height, data, extension: ".png" };
        },
      },
    });

    return buffer;
  } catch (error) {
    console.log("Error generating DOCX:", error);
    throw error;
  }
};
