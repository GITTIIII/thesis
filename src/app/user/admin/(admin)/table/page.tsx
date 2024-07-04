"use client";
import AdminTable from "@/components/adminTable/adminTable";
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
import { Button } from "../../../../../components/ui/button";

type User = {
	id: number;
	username: string;
	formState: number;
};

export default function AdminTablePage() {
	const [user, setUser] = useState<User | null>(null);
	const [selectedValue, setSelectedValue] = useState("1");
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
									defaultValue={"1"}
								/>
							</SelectTrigger>
							<SelectContent>
								<SelectItem disabled={(user?.formState ?? 0) < 1} value="1">
									แบบคำขออนุมัติโครงร่างวิทยานิพนธ์ (ทบ.20)
								</SelectItem>
								<SelectItem disabled={(user?.formState ?? 0) < 2} value="2">
									form2
								</SelectItem>
								<SelectItem disabled={(user?.formState ?? 0) < 3} value="3">
									form3
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className="h-3/4 w-full flex items-center">
					<AdminTable formTypeNumber={selectedValue} userId={user?.id} />
				</div>
			</div>
		</>
	);
}
