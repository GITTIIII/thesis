"use Client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Form = {
	id: number;
	date: String;
	username: string;
	fullname: string;
	committee_outline_status: string;
	committee_institute_status: string;
};

interface StudentTableProps {
	formNumber: string | undefined;
	userId: number | undefined;
}

const formTypeMap: Record<string, string> = {
	"1": "ทบ.20",
	"2": "ทบ.20",
	"3": "ทบ.20",
};

export default function StudentTable({
	formNumber,
	userId,
}: StudentTableProps) {
	const [form, setForm] = useState<Form[] | null>(null);
	const router = useRouter();
	useEffect(() => {
		if (formNumber == "1") {
			fetch(`/api/getAllForm1/${userId}`)
				.then((res) => res.json())
				.then((data) => setForm(data));
		}
	}, []);

	return (
		<>
			<div className="w-full h-full bg-white shadow-2xl rounded-md px-2">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ID</TableHead>
							<TableHead>วันที่สร้าง</TableHead>
							<TableHead>รหัสนักศึกษา</TableHead>
							<TableHead>ชื่อ นศ.</TableHead>
							<TableHead>ประเภทฟอร์ม</TableHead>
							<TableHead>สถานะ</TableHead>
							<TableHead>รายละเอียด</TableHead>
							<TableHead>ดาวน์โหลดฟอร์ม</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{form?.map((form) => (
							<TableRow key={form.id}>
								<TableCell>{form.id}</TableCell>
								<TableCell>{form.date}</TableCell>
								<TableCell>{form.username}</TableCell>
								<TableCell>{form.fullname}</TableCell>
								<TableCell>
									{formNumber ? formTypeMap[formNumber] : ""}
								</TableCell>
								<TableCell>สถานะ</TableCell>
								<TableCell className="text-[#F26522]">
									<Link href={`/user/form/form1/${form.id}`}>
										คลิกเพื่อดูเพิ่มเติม
									</Link>
								</TableCell>
								<TableCell>
									<Button disabled={true} type="button" variant="outline">
										ดาวน์โหลด
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
