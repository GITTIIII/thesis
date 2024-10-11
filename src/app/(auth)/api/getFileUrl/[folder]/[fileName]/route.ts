import { getFileUrl } from "@/lib/file";
import { NextRequest, NextResponse } from "next/server";
import { streamImageFromUrl } from "../../../streams";

export const GET = async (req: Request, { params }: { params: { folder: string; fileName: string } }) => {
	try {
		const { folder, fileName } = params;

		const url = await getFileUrl(fileName, folder);

		return streamImageFromUrl(url);
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
};
