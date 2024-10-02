import * as XLSX from "xlsx";

export const jsonToExcel = async (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const range = XLSX.utils.decode_range(worksheet["!ref"] || "");

  range.s.r = 1;

  worksheet["!ref"] = XLSX.utils.encode_range(range);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  let buffer = await XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  return buffer;
};
