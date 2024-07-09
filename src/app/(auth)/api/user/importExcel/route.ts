import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import path from "path"
import { User } from "../../../../../interface/user"
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
  const re = /(\.xlsx)$/i

  // Validate the file format
  if (!re.exec(filename)) {
    return NextResponse.json(
      { Error: "Invalid file format. Please upload a valid Excel file." },
      { status: 400 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const pathExcel = path.join(
    process.cwd(),
    `src/app/(auth)/api/user/importExcel/excel/${filename}`
  )

  try {
    await writeFile(pathExcel, buffer)
    const users: User[] = await excelFileToJson(pathExcel, columnKey)
    console.log(users)

    const result = await CreateMultipleStudent(users)
    return NextResponse.json(
      { message: "Users Created", result },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { Error: error || "An error occurred" },
      { status: 500 }
    )
  } finally {
    await unlink(pathExcel)
  }
}

const CreateMultipleStudent = async (users: any) => {
  try {
    const newUsers = await db.user.createMany({
      data: [...users],
    })
    return newUsers
  } catch (error) {
    throw error
  }
}
