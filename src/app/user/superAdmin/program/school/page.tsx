"use client";

import Link from "next/link";
import useSWR from "swr";
import { ISchool } from "@/interface/school";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/alertDialog/ConfirmDeleteDialog";
import { CircleArrowLeft } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function School() {
	const { data: schoolData } = useSWR<ISchool[]>(process.env.NEXT_PUBLIC_URL + "/api/school", fetcher);

	return (
		<div className="flex flex-col mx-36">
			<div className="flex justify-between py-4">
				<div className="flex items-center gap-4 text-3xl font-meduim">
					<Link href="/user/superAdmin/program">
						<CircleArrowLeft className="h-8 w-8" color="#F97316" />
					</Link>
					สาขา
				</div>
				<Button>
					<Link href="/user/superAdmin/program/school/createSchool">เพิ่มสาขา</Link>
				</Button>
			</div>
			<div className="grid grid-cols-3 gap-4">
				{schoolData?.map((school: ISchool) => (
					<div key={school.id} className="bg-white shadow-md rounded-xl p-4">
						<div className="flex justify-between items-center">
							<p className="text-lg font-bold">{school.schoolNameTH}</p>
							<div className="hover:cursor-pointer">
								<ConfirmDeleteDialog
									title="คุณแน่ใจที่จะลบสาขานี้?"
									description="ต้องการลบสาขานี้หรือไม่"
									deleteAPI={process.env.NEXT_PUBLIC_URL + `/api/school/${school.id}`}
									fetchAPI={process.env.NEXT_PUBLIC_URL + "/api/school"}
								>
									<Trash2 className="h-4 w-4" color="red" />
								</ConfirmDeleteDialog>
							</div>
						</div>
						<p>{school.schoolNameEN}</p>
					</div>
				))}
			</div>
		</div>
	);
}
