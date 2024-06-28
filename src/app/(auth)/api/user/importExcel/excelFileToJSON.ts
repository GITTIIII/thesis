const excelToJson = require("convert-excel-to-json")

export type ColumnKey = {
  [column: string]: string
}

export const excelFileToJson = (path: string, columnKey: ColumnKey) => {
  const result = excelToJson({
    sourceFile: path,
    columnToKey: columnKey,
  })
  return result.Sheet1
}
