"use client";

import Image from "next/image";
import createUser from "@../../../public/asset/createUser.png";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Label } from "@/components/ui/label";

import CreateAdmin from "./createAdmin";
import CreateStudent from "./createStudent";
import CreateCommittee from "./createExpert";
import CreateStudentExel from "./createStudentExel";

const CreateUser = () => {
	return (
		<div className="w-full lg:w-3/4 h-full p-12 mx-auto">
			<div className="flex items-center p-4">
				<Image src={createUser} width={100} height={100} alt="createUser" />
				<Label className="text-2xl">เพิ่มรายชื่อผู้ใช้</Label>
			</div>
			<Tabs defaultValue="student" className="w-full">
				<TabsList className="w-max h-16">
					<TabsTrigger className="h-full lg:text-lg" value="student">
						นักศึกษา
					</TabsTrigger>
					<TabsTrigger className="h-full lg:text-lg" value="studentExcel">
						นักศึกษาด้วย Excel
					</TabsTrigger>
					<TabsTrigger className="h-full lg:text-lg" value="admin">
						อาจารย์
					</TabsTrigger>
					<TabsTrigger className="h-full lg:text-lg" value="committee">
						กรรมการ
					</TabsTrigger>
				</TabsList>
				<TabsContent value="student">
					<Card>
						<CardHeader>
							<CardTitle className="pl-4">นักศึกษา</CardTitle>
						</CardHeader>
						<CardContent>
							<CreateStudent />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="admin">
					<Card>
						<CardHeader>
							<CardTitle className="pl-4">อาจารย์</CardTitle>
							<CardDescription></CardDescription>
						</CardHeader>
						<CardContent>
							<CreateAdmin />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="committee">
					<Card>
						<CardHeader>
							<CardTitle className="pl-4">กรรมการ</CardTitle>
							<CardDescription></CardDescription>
						</CardHeader>
						<CardContent>
							<CreateCommittee />
						</CardContent>
					</Card>
				</TabsContent>
				<TabsContent value="studentExcel">
					<Card>
						<CardHeader>
							<CardTitle className="pl-4">นักศึกษา</CardTitle>
							<CardDescription></CardDescription>
						</CardHeader>
						<CardContent>
							<CreateStudentExel />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default CreateUser;
