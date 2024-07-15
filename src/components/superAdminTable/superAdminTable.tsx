"use client";

import { useState, useEffect } from "react";
import { User } from "@/interface/user";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

async function getCurrentUser() {
	const res = await await fetch("/api/user");
	return res.json();
}

export default function SuperAdminTable({
	filterRole,
}: {
	filterRole: string;
}) {
	const [userData, setUserData] = useState<User[]>([]);

	useEffect(() => {
		async function fetchData() {
			const data = await getCurrentUser();
			setUserData(data);
		}
		fetchData();
	}, []);

	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>รหัสนักศึกษา</TableHead>
					<TableHead>ชื่อ-นามสกุล</TableHead>
					<TableHead>อีเมล</TableHead>
					<TableHead>เบอร์ติดต่อ</TableHead>
					<TableHead className="hidden md:table-cell">สาขาวิชา</TableHead>
					<TableHead className="hidden md:table-cell">ระดับการศึกษา</TableHead>
					<TableHead className="hidden md:table-cell">รายละเอียด</TableHead>
					<TableHead>
						<span className="sr-only">Actions</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<Dialog>
				<TableBody>
					{userData
						.filter((userData) =>
							filterRole == "STUDENT"
								? userData?.role.toString() === "STUDENT"
								: userData?.role.toString() === "ADMIN" ||
								  userData?.role.toString() === "COMMITTEE"
						)
						.map((user, index) => (
							<DialogTrigger asChild key={index}>
								<TableRow className="hover:cursor-pointer">
									<TableCell className="font-medium">{user.username}</TableCell>
									<TableCell>
										{user.firstName} {user.lastName}
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.phone}</TableCell>
									<TableCell className="hidden md:table-cell">
										{user.school}
									</TableCell>
									<TableCell className="hidden md:table-cell">
										{user.degree}
									</TableCell>
									<TableCell>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													aria-haspopup="true"
													size="icon"
													variant="ghost"
												>
													<MoreHorizontal className="h-4 w-4" />
													<span className="sr-only">Toggle menu</span>
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
												<DropdownMenuItem>แก้ไข</DropdownMenuItem>
												<DropdownMenuItem>ลบข้อมูล</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							</DialogTrigger>
						))}
				</TableBody>

				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>ข้อมูลรายละเอียดของบัณฑิตศึกษา</DialogTitle>
						<DialogDescription></DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="firstname" className="text-right">
								ชื่อ
							</Label>
							<Input id="name" value="Pedro Duarte" className="col-span-3" />
							<Label htmlFor="lastname" className="text-right">
								นามสกุล
							</Label>
							<Input id="name" value="Pedro Duarte" className="col-span-3" />
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="username" className="text-right">
								รหัสนักศึกษา
							</Label>
							<Input id="username" value="@peduarte" className="col-span-3" />
						</div>
					</div>
					<DialogFooter></DialogFooter>
				</DialogContent>
			</Dialog>
		</Table>
	);
}
