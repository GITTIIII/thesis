"use client";
import Image from "next/image";
import studentFormPage from "@/../../public/asset/studentFormPage.png";
import Stepper from "@/components/stepper/stepper";
import { useEffect, useState } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IUser } from "@/interface/user"
import FormTable from "@/components/formTable/formTable";


export default function StudentTablePage() {
	const [user, setUser] = useState<IUser | null>(null);
	const [selectedValue, setSelectedValue] = useState("outlineForm");
	const router = useRouter();

	useEffect(() => {
		fetch("/api/user")
			.then((res) => res.json())
			.then((data) => setUser(data));
	}, []);

	const handleSelect = (value: String) => {
		setSelectedValue(value.toString());
	};

	return (
		<>
			<div className="w-full h-full bg-transparent py-12 px-2 lg:px-28">
				{user?.role == "STUDENT" && (<div className="w-full h-max p-4 flex justify-center items-center">
					<Stepper step={user?.formState ?? 0} />
				</div>)}
				<div className="h-max w-full flex items-center text-2xl p-2">
					<Image
						src={studentFormPage}
						width={100}
						height={100}
						alt="documentation"
					/>
					<label className="ml-5">ตารางฟอร์ม</label>
					<div className="w-max ml-auto">
						<Select onValueChange={handleSelect}>
							<SelectTrigger className="w-max">
								<SelectValue
									placeholder="แบบคำขออนุมัติโครงร่างวิทยานิพนธ์ (ทบ.20)"
									defaultValue={"outlineForm"}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									disabled={
										user?.role == "STUDENT" && (user?.formState ?? 0) < 1
									}
									value="outlineForm"
								>
									แบบคำขออนุมัติโครงร่างวิทยานิพนธ์ (ทบ.20)
								</SelectItem>
<<<<<<< HEAD:src/app/user/table/page.tsx
								<SelectItem
									disabled={
										user?.role == "STUDENT" && (user?.formState ?? 0) < 2
									}
									value="2"
								>
									form2
=======
								<SelectItem disabled={(user?.formState ?? 0) < 2} value="2">
									รายงานความคืบหน้าวิทยานิพนธิ์ 
>>>>>>> 2189d06c9a90352cfefd3833f84899e6f356d6b8:src/app/user/student/(student)/table/page.tsx
								</SelectItem>
								<SelectItem
									disabled={
										user?.role == "STUDENT" && (user?.formState ?? 0) < 3
									}
									value="3"
								>
									form3
								</SelectItem>
							</SelectContent>
						</Select>
						{user?.role == "STUDENT" && (
							<Button
								hidden
								type="button"
								variant="outline"
								onClick={() => router.push(`/user/form/outlineForm/create`)}
							>
								เพิ่มฟอร์ม
							</Button>
						)}
					</div>
				</div>
				<div className="h-full w-full flex items-center py-4">
					<FormTable formType={selectedValue} userId={user?.id} />
				</div>
			</div>
		</>
	);
}
