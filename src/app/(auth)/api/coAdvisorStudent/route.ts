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
		const { studentID, coAdvisorID } = body;

		const coAdvisorStudent = await db.coAdvisorStudent.create({
			data: {
				studentID: studentID == 0 ? null : studentID,
				coAdvisorID: coAdvisorID == 0 ? null : coAdvisorID,
			},
		});

		const { ...rest } = coAdvisorStudent;

		return NextResponse.json({ form: rest, message: "CoAdvisorStudent Created" }, { status: 200 });
	} catch (error) {
		return NextResponse.json({ message: error }, { status: 500 });
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
	}
	const coAdvisorStudent = await db.coAdvisorStudent.findMany({
		include: {
			student: true,
			coAdvisor: true,
		},
	});

	return NextResponse.json(coAdvisorStudent);
}

export async function PATCH(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ user: null, message: "Session not found" }, { status: 404 });
		}

		const body = await req.json();
		const { studentID, coAdvisorID, action } = body;

		if (!studentID) {
			return NextResponse.json({ message: "Student ID is required" }, { status: 400 });
		}

		if (!coAdvisorID) {
			return NextResponse.json({ message: "CoAdvisor ID is required" }, { status: 400 });
		}

		const existingCoAdvisorStudent = await db.coAdvisorStudent.findUnique({
			where: { 
				studentID_coAdvisorID: {
					studentID: Number(studentID),
					coAdvisorID: Number(coAdvisorID),
				},
			}
		});

		if (action === 'add') {
			if (existingCoAdvisorStudent) {
				return NextResponse.json({ message: "CoAdvisorStudent relationship already exists" }, { status: 409 });
			}

			// Create a new relationship
			await db.coAdvisorStudent.create({
				data: {
					studentID: Number(studentID),
					coAdvisorID: Number(coAdvisorID),
				},
			});

			return NextResponse.json({ message: "CoAdvisorStudent relationship added" }, { status: 201 });

		} else if (action === 'remove') {
			if (!existingCoAdvisorStudent) {
				return NextResponse.json({ message: "CoAdvisorStudent relationship not found" }, { status: 404 });
			}

			// Delete the existing relationship
			await db.coAdvisorStudent.delete({
				where: {
					studentID_coAdvisorID: {
						studentID: Number(studentID),
						coAdvisorID: Number(coAdvisorID),
					},
				},
			});

			return NextResponse.json({ message: "CoAdvisorStudent relationship removed" }, { status: 200 });

		} else {
			return NextResponse.json({ message: "Invalid action" }, { status: 400 });
		}

	} catch (error) {
		return NextResponse.json({ message: error instanceof Error ? error.message : "An unknown error occurred" }, { status: 500 });
	}
}

