import { IExpert } from "@/interface/expert";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";

export const getAllExpert = async () => {
	const session = await getServerSession(authOptions);

	if (!session) return;

	const expert = await db.expert.findMany({});
	
    if (!expert) return;

	return expert as IExpert[];
};
