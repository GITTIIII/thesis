"use client";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSelectForm } from "@/hook/selectFormHook";
import { FormPath } from "@/components/formPath/formPath";
import Image from "next/image";
import createForm from "@/../../public/asset/createForm.png";
import { IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { Input } from "../ui/input";
import { Filter } from "lucide-react";
import { FilterTable } from "./filter";

const labels: { [key: string]: string } = {
	form01: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้",
	form02: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ",
	form03: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์",
	form04: "แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์",
	form05: "แบบคำขออนุมัติโครงร่างวิทยานิพนธ์",
	form06: "เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์",
	form07: "คำขอนัดสอบวิทยานิพนธ์",
	form08: "แบบประเมินการสอบวิทยานิพนธ์",
};

const numbers: { [key: string]: number } = {
	form01: 1,
	form02: 1,
	form03: 2,
	form04: 3,
	form05: 4,
	form06: 5,
	form07: 6,
	form08: 7,
};

export default function SelectAndCreate({
	approvedForm,
	user,
	searchParams,
}: {
	approvedForm?: IOutlineForm;
	user?: IUser;
	searchParams: { [key: string]: string };
}) {
	const { selectedForm, setSelectedForm } = useSelectForm();
	const [isDisabled, setIsDisabled] = useState(false);
	const router = useRouter();

	const handleSelectChange = (value: string) => {
		setSelectedForm(value);
		router.push(`/user/table?form=${value}`);
	};

	useEffect(() => {
		if (
			(approvedForm && selectedForm === "form05" && user?.role === "STUDENT") ||
			(user?.role == "STUDENT" && (user?.formState ?? 0) < numbers[selectedForm])
		) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [selectedForm, user, approvedForm]);

	useEffect(() => {
		if (user?.position == "ADVISOR" && selectedForm == "form01") {
			handleSelectChange("form03");
		}
	}, []);

	useEffect(() => {
		setSelectedForm(searchParams.form || "form01");
	}, [searchParams]);

	return (
		<div className="w-full flex">
			<div className="w-full sm:w-max ml-auto flex flex-col sm:flex-row items-center justify-center">
				{user && (
					<Select onValueChange={handleSelectChange} value={selectedForm}>
						<SelectTrigger className="w-full sm:w-max">
							<SelectValue placeholder={labels[selectedForm]} />
						</SelectTrigger>
						<SelectContent>
							{user.position != "ADVISOR" && (
								<>
									{user.degree != "Doctoral" && (
										<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 1} value="form01">
											แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้
										</SelectItem>
									)}

									{user.degree != "Master" && (
										<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 1} value="form02">
											แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ
										</SelectItem>
									)}
								</>
							)}

							<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 2} value="form03">
								แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์
							</SelectItem>

							<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 3} value="form04">
								แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์
							</SelectItem>

							<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 4} value="form05">
								แบบคำขออนุมัติโครงร่างวิทยานิพนธ์
							</SelectItem>

							<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 5} value="form06">
								เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
							</SelectItem>
							<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 6} value="form07">
								คำขอนัดสอบวิทยานิพนธ์
							</SelectItem>
							<SelectItem disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 7} value="form08">
								แบบประเมินการสอบวิทยานิพนธ์
							</SelectItem>
						</SelectContent>
					</Select>
				)}
				{user?.role === "STUDENT" && (
					<Button
						type="button"
						variant="default"
						className="bg-[#F26522] w-auto text-md text-white rounded-md ml-auto sm:ml-4 border-[#F26522] mt-2 sm:mt-0"
						onClick={() => router.push(`/user/form/${FormPath[selectedForm]}/create`)}
						disabled={isDisabled}
					>
						<Image src={createForm} width={24} height={24} alt={"createForm"} className="mr-2" />
						เพิ่มฟอร์ม
					</Button>
				)}
			</div>
		</div>
	);
}
