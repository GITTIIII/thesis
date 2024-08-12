import { throws } from "assert";
import createReport from "docx-templates";
import fs from "fs";

const path = "src/lib/formToDocx/docTemplate/";
export const genDocx = async (docxName: string, data: object) => {
  try {
    const template = fs.readFileSync(`${path}${docxName}`);
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
