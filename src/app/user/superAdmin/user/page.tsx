"use client";

import Link from "next/link";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/tanStackTable/dataTable";
import { userColumns } from "./user-columns";
import { IUser } from "@/interface/user";
import { IExpert } from "@/interface/expert";
import * as React from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserDashboard() {
	const { data: studentData = [] } = useSWR<IUser[]>(`${process.env.NEXT_PUBLIC_URL}/api/getStudent`, fetcher);
	const { data: advisorData = [] } = useSWR<IUser[]>(`${process.env.NEXT_PUBLIC_URL}/api/getAdvisor`, fetcher);
	const { data: headInstituteData = [] } = useSWR<IUser[]>(`${process.env.NEXT_PUBLIC_URL}/api/getHeadInstitute`, fetcher);
	const { data: expertData = [] } = useSWR<IExpert[]>(`${process.env.NEXT_PUBLIC_URL}/api/expert`, fetcher);

	const [filtered, setFiltered] = React.useState("none");

	const studentDataWithFilter = React.useMemo(() => {
		switch (filtered) {
			case "master":
				return studentData.filter((student) => student.degree === "Master");
			case "doctoral":
				return studentData.filter((student) => student.degree === "Doctoral");
			default:
				return studentData;
		}
	}, [studentData, filtered]);

	return (
		<div className="flex flex-col w-svh h-svh">
			<div className="flex flex-col sm:gap-4 sm:py-4">
				<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"></header>
				<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
					<Tabs defaultValue="student">
						<div className="flex justify-between items-center">
							<TabsList>
								<TabsTrigger value="student">บัณฑิตศึกษา</TabsTrigger>
								<TabsTrigger value="advisor">อาจารย์</TabsTrigger>
								<TabsTrigger value="committee">คณบดี</TabsTrigger>
								<TabsTrigger value="expert">ผู้เชี่ยวชาญ</TabsTrigger>
							</TabsList>
							<div className="mr-4">
								<Link href="/user/superAdmin/user/createUser">
									<Button className="h-8 gap-1">
										<PlusCircle className="h-4 w-4" />
										<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">เพิ่มรายชื่อ</span>
									</Button>
								</Link>
							</div>
						</div>
						<TabsContent value="student">
							<Card>
								<CardHeader className="p-4">
									<div className="flex justify-between">
										<div className="ml-2">
											<CardTitle className="text-xl">รายชื่อบัณฑิตศึกษา</CardTitle>
										</div>
										<div>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button className="h-8 gap-1">
														<SlidersHorizontal className="h-4 w-4" />
														<div>ตัวกรอง</div>
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent className="w-56">
													<DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
													<DropdownMenuSeparator />
													<DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
														<DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
														<DropdownMenuRadioItem value="master">ปริญญาโท</DropdownMenuRadioItem>
														<DropdownMenuRadioItem value="doctoral">ปริญญาเอก</DropdownMenuRadioItem>
													</DropdownMenuRadioGroup>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</div>
								</CardHeader>
								<CardContent>
									<DataTable columns={userColumns.studentColumns} data={studentDataWithFilter} />
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="advisor">
							<Card>
								<CardHeader className="p-4 ml-2">
									<CardTitle className="text-xl">รายชื่ออาจารย์ที่ปรึกษา</CardTitle>
								</CardHeader>
								<CardContent>
									<DataTable columns={userColumns.advisorColumns} data={advisorData} />
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="committee">
							<Card>
								<CardHeader className="p-4 ml-2">
									<CardTitle className="text-xl">รายชื่อผู้บริหาร</CardTitle>
								</CardHeader>
								<CardContent>
									<DataTable columns={userColumns.headInstituteColumns} data={headInstituteData} />
								</CardContent>
							</Card>
						</TabsContent>
						<TabsContent value="expert">
							<Card>
								<CardHeader className="p-4 ml-2">
									<CardTitle className="text-xl">รายชื่อผู้เชี่ยวชาญ</CardTitle>
								</CardHeader>
								<CardContent>
									<DataTable columns={userColumns.expertColumns} data={expertData} />
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</main>
			</div>
		</div>
	);
}
