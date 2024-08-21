import { getFileUrl } from "@/lib/file";
import { NextResponse } from "next/server";
import { streamImageFromUrl } from "../../streams";

export const GET = async (req: Request, { params }: { params: { fileName: string } }) => {
	try {
		const fileName = params.fileName;

		const url = await getFileUrl(fileName);

		return streamImageFromUrl(url);
	} catch (error) {
		const err = error as Error;
		return NextResponse.json({ error: err.message }, { status: 400 });
	}
};
