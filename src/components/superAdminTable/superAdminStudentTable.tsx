"use client";

import { useState, useEffect } from "react";
import { IUser } from "@/interface/user";
import { Eye, ListFilter, MoreHorizontal, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

async function getAllUser() {
	const res = await fetch("/api/user");
	return res.json();
}

export default function SuperAdminStudentTable({ filterRole }: { filterRole: string }) {
	const [userData, setUserData] = useState<IUser[]>([]);
	const [studentFilter, setStudentFilter] = useState("All");
	const [searchQuery, setSearchQuery] = useState("");
	const [username, setUsername] = useState("");

	const filteredData = userData.filter(
		(user) =>
			user.firstNameTH.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.lastNameTH.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.firstNameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.lastNameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	useEffect(() => {
		async function fetchData() {
			const data = await getAllUser();
			setUserData(data);
			setUsername(data[0].username);
		}
		fetchData();
	}, []);

	const [selectedUser, setSelectedUser] = useState<IUser>();

	useEffect(() => {
		const user = userData.find((u) => u.username === username);
		setSelectedUser(user);
	}, [userData, username]);

	return (
		<div>
			<header className="flex justify-end gap-2">
				<div className="relative ml-auto flex-1 md:grow-0">
					<form>
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="ค้นหารหัส หรือ ชื่อบัณฑิต..."
							className="w-full h-10 rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
						/>
					</form>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="h-10 gap-1 rounded-lg">
							<ListFilter className="h-3.5 w-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">คัดกรอง</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>คัดกรองโดย</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuRadioGroup value={studentFilter} onValueChange={setStudentFilter}>
							<DropdownMenuRadioItem value="All">ทั้งหมด</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="Master">ปริญญาโท</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="Doctoral">ปริญญาเอก</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</header>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>รหัสนักศึกษา</TableHead>
						<TableHead>ชื่อ-นามสกุล</TableHead>
						<TableHead>อีเมล</TableHead>
						<TableHead>เบอร์ติดต่อ</TableHead>
						<TableHead>สาขาวิชา</TableHead>
						<TableHead>ระดับการศึกษา</TableHead>
						<TableHead>
							<span className="sr-only">รายละเอียด</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<Dialog>
					<TableBody>
						{filteredData
							.filter((userData) =>
								filterRole == "STUDENT" && (studentFilter == "Master" || studentFilter == "Doctoral")
									? userData?.role.toString() === "STUDENT" &&
									  userData?.degree.toString() === studentFilter
									: userData?.role.toString() === "STUDENT"
							)
							.map((user, index) => (
								<TableRow key={index}>
									<TableCell className="font-medium">{user.username}</TableCell>
									<TableCell>
										{user.formLanguage == "en"
											? `${user.firstNameEN} ${user.lastNameEN}`
											: `${user.firstNameTH} ${user.lastNameTH}`}
									</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>{user.phone}</TableCell>
									<TableCell>
										{user.formLanguage == "en"
											? `${user.school.schoolNameEN}`
											: `${user.school.schoolNameTH}`}
									</TableCell>
									<TableCell>{user.degree}</TableCell>
									<TableCell>
										<DialogTrigger asChild className="hover:cursor-pointer">
											<Button
												aria-haspopup="true"
												size="icon"
												variant="ghost"
												onClick={() => setUsername(user.username)}
											>
												<Eye className="h-4 w-4" />
												<span className="sr-only">Toggle menu</span>
											</Button>
										</DialogTrigger>
										<DropdownMenu>
											<DropdownMenuTrigger asChild className="hover:cursor-pointer">
												<Button aria-haspopup="true" size="icon" variant="ghost">
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
							))}
					</TableBody>

					<DialogContent className="max-w-[60%] sm:min-w-[425px]">
						<DialogHeader>
							<DialogTitle>ข้อมูลรายละเอียดของบัณฑิตศึกษา</DialogTitle>
							<DialogDescription></DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="grid grid-cols-4 items-center gap-4">
								<Label className="text-right">รหัสนักศึกษา</Label>
								<Input value={selectedUser?.username} className="col-span-3 disabled" readOnly />
								<Label className="text-right">ชื่อ</Label>
								<Input
									value={
										selectedUser?.formLanguage == "en"
											? selectedUser?.firstNameEN
											: selectedUser?.firstNameTH
									}
									className="col-span-3 disabled"
									readOnly
								/>
								<Label className="text-right">นามสกุล</Label>
								<Input
									value={
										selectedUser?.formLanguage == "en"
											? selectedUser?.lastNameEN
											: selectedUser?.lastNameTH
									}
									className="col-span-3 disabled"
									readOnly
								/>
								<Label className="text-right">อีเมล</Label>
								<Input value={selectedUser?.email} className="col-span-3 disabled" readOnly />
								<Label className="text-right">เบอร์ติดต่อ</Label>
								<Input value={selectedUser?.phone} className="col-span-3 disabled" readOnly />
								<Label className="text-right">ระดับการศึกษา</Label>
								<Input value={selectedUser?.degree} className="col-span-3 disabled" readOnly />
								<Label className="text-right">สำนักวิชา</Label>
								<Input
									value={
										selectedUser?.formLanguage == "en"
											? selectedUser?.institute?.instituteNameEN
											: selectedUser?.institute?.instituteNameEN
									}
									className="col-span-3 disabled"
									readOnly
								/>
								<Label className="text-right">สาขาวิชา</Label>
								<Input
									value={
										selectedUser?.formLanguage == "en"
											? selectedUser?.school?.schoolNameEN
											: selectedUser?.school?.schoolNameTH
									}
									className="col-span-3 disabled"
									readOnly
								/>
								<Label className="text-right">หลักสูตร</Label>
								<Input
									value={
										selectedUser?.formLanguage == "en"
											? selectedUser?.program?.programNameEN
											: selectedUser?.program?.programNameTH
									}
									className="col-span-3 disabled"
									readOnly
								/>
								<Label className="text-right">ปีหลักสูตร</Label>
								<Input
									value={selectedUser?.program?.programacademicYear}
									className="col-span-3 disabled"
									readOnly
								/>
							</div>
						</div>
						<DialogFooter></DialogFooter>
					</DialogContent>
				</Dialog>
			</Table>
		</div>
	);
}
