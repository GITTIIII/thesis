import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
    }

    const body = await req.json();
    const { programNameTH, programNameEN, programYear, schools } = body;

    const schoolsOnPrograms = await db.program.create({
      data: {
        programNameTH,
        programNameEN,
        programYear,
        schools: {
          create: schools.map((school: any) => ({
            schoolID: Number(school),
          })),
        },
      },
    });

    const { ...rest } = schoolsOnPrograms;

    return NextResponse.json({ form: rest, message: "Program Created" }, { status: 200 });
  } catch (error) {
    console.log("ERR", error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
  }
  const schoolsOnPrograms = await db.program.findMany({
    include: {
      schools: {
        include: {
          school: true,
        },
      },
    },
  });

  return NextResponse.json(schoolsOnPrograms);
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
    }

    const body = await req.json();
    const { schoolID, programID, action } = body;

    if (!schoolID) {
      return NextResponse.json({ message: "School ID is required" }, { status: 400 });
    }

    if (!programID) {
      return NextResponse.json({ message: "Program ID is required" }, { status: 400 });
    }

    const existingschoolsOnPrograms = await db.schoolsOnPrograms.findUnique({
      where: {
        schoolID_programID: {
          schoolID: Number(schoolID),
          programID: Number(programID),
        },
      },
    });

    if (action === "add") {
      if (existingschoolsOnPrograms) {
        return NextResponse.json({ message: "schoolsOnPrograms relationship already exists" }, { status: 409 });
      }

      // Create a new relationship
      await db.schoolsOnPrograms.create({
        data: {
          schoolID: Number(schoolID),
          programID: Number(programID),
        },
      });

      return NextResponse.json({ message: "schoolsOnPrograms relationship added" }, { status: 201 });
    } else if (action === "remove") {
      if (!existingschoolsOnPrograms) {
        return NextResponse.json({ message: "schoolsOnPrograms relationship not found" }, { status: 404 });
      }

      // Delete the existing relationship
      await db.schoolsOnPrograms.delete({
        where: {
          schoolID_programID: {
            schoolID: Number(schoolID),
            programID: Number(programID),
          },
        },
      });

      return NextResponse.json({ message: "schoolsOnPrograms relationship removed" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
  }
}
