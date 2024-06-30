import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import path from "path"
import { writeFile, unlink } from "fs/promises"

import { excelFileToJson } from "./excelFileToJSON"

export const POST = async (req: Request) => {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const columnKey = formData.get("columnKey") as string
  // Validate that a file was received
  if (!file) {
    return NextResponse.json({ Error: "No files received." }, { status: 400 })
  }
  // Validate that a columnKey was received
  if (!columnKey) {
    return NextResponse.json(
      { Error: "No column key received." },
      { status: 400 }
    )
  }
  const filename = file.name.replaceAll(" ", "_")
  var re = /(\.xlsx)$/i
  // Validate the file format
  if (!re.exec(filename)) {
    return NextResponse.json(
      { Error: "Invalid file format. Please upload a valid Excel file." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const pathExcel = `src/app/(auth)/api/user/importExcel/excel/${filename}`
  try {
    await writeFile(path.join(process.cwd(), pathExcel), buffer)
    const result = excelFileToJson(pathExcel, JSON.parse(columnKey))
    await unlink(pathExcel)
    return NextResponse.json({ Result: result }, { status: 200 })
  } catch (error) {
    await unlink(pathExcel)
    return NextResponse.json({ Error: error }, { status: 500 })
  }
}
