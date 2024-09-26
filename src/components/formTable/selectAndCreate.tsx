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
	form02: 2,
	form03: 3,
	form04: 4,
	form05: 5,
	form06: 6,
	form07: 7,
	form08: 8,
};

export default function SelectAndCreate({ approvedForm, user }: { approvedForm?: IOutlineForm; user?: IUser }) {
	const { selectedForm, setSelectedForm } = useSelectForm();
	const [isDisabled, setIsDisabled] = useState(false);
	const router = useRouter();

	const handleSelectChange = (value: string) => {
		setSelectedForm(value);
		router.push(`/user/table?form=${value}`);
	};

	useEffect(() => {
		if (
			approvedForm &&
			selectedForm === "form05" &&
			user?.role === "STUDENT"
			// ||(user?.role == "STUDENT" && (user?.formState ?? 0) < numbers[selectedForm])
		) {
			setIsDisabled(true);
		} else {
			setIsDisabled(false);
		}
	}, [selectedForm, user, approvedForm]);


	return (
		<div className="w-max ml-auto flex flex-col sm:flex-row items-center justify-center">
			<Select onValueChange={handleSelectChange} defaultValue={selectedForm}>
				<SelectTrigger className="w-max">
					<SelectValue placeholder={labels[selectedForm]} defaultValue={selectedForm} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem 
					
					// disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 1} 
					value="form01">
						แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้
					</SelectItem>
					<SelectItem 
					// disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 2} 
					value="form02">
						แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ
					</SelectItem>
					<SelectItem 
					// disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 3} 
					value="form03">
						แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์
					</SelectItem>

					<SelectItem 
					// disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 4} 
					value="form04">
						แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์
					</SelectItem>

					<SelectItem 
					// disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 5} 
					value="form05">
						แบบคำขออนุมัติโครงร่างวิทยานิพนธ์
					</SelectItem>

					<SelectItem 
					// disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 6} 
					value="form06">
						เเบบรายงานความคืบหน้าของการทำวิทยานิพนธ์
					</SelectItem>
					<SelectItem 
					// disabled={user?.role == "STUDENT" && (user?.formState ?? 0) < 7} 
					value="form07">
						คำขอนัดสอบวิทยานิพนธ์
					</SelectItem>
				</SelectContent>
			</Select>
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
	);
}
