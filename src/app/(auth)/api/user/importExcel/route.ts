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
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 })
  }
  if (!columnKey) {
    return NextResponse.json(
      { error: "No column key received." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const filename = file.name.replaceAll(" ", "_")
  const pathExcel = `src/app/(auth)/api/user/importExcel/excel/${filename}`
  try {
    await writeFile(path.join(process.cwd(), pathExcel), buffer)
    const result = excelFileToJson(pathExcel, JSON.parse(columnKey))
    await unlink(pathExcel)
    return NextResponse.json({ Result: result, status: 200 })
  } catch (error) {
    console.log("Error occured ", error)
    return NextResponse.json({ Message: "Failed", status: 500 })
  }
}
