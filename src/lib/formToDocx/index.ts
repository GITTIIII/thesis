import { throws } from "assert";
import createReport from "docx-templates";
import fs from "fs";

export const genDocx = async (path: string, data: object) => {
  try {
    const template = fs.readFileSync(path);
    const buffer = await createReport({
      template,
      data: data,
      cmdDelimiter: ["{", "}"],
    });
    return buffer;
  } catch (error) {
    console.log(error);
    throw error;
  }
  //   fs.writeFileSync("report.docx", buffer);
};
