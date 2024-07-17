"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
	GoAlertFill,
	GoCheckCircleFill,
	GoChevronDown,
	GoChevronRight,
	GoTrash,
	GoX,
} from "react-icons/go";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// @ts-ignore
import { ExcelRenderer } from "react-excel-renderer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
interface RowData {
	[key: string]: string | number;
}
const alphabet = "ABCDEFGHIJKLMNOPQ".split("");
const userProperty = [
	{ key: "firstName", value: "ชื่อ" },
	{ key: "lastName", value: "นามสกุล" },
	{ key: "username", value: "รหัสนักศึกษา" },
	{ key: "password", value: "รหัสผ่าน" },
	{ key: "email", value: "อีเมล" },
	{ key: "phone", value: "เบอร์โทร" },
	{ key: "sex", value: "เพศ" },
	{ key: "degree", value: "ระดับการศึกษา" },
	{ key: "school", value: "สาขาวิชา" },
	{ key: "program", value: "หลักสูตร" },
	{ key: "programYear", value: "ปีการศึกษา" },
	{ key: "position", value: "ตำแหน่ง" },
	{ key: "role", value: "บทบาท" },
	{ key: "formState", value: "สถานะฟอร์ม" },
	{ key: "signatureUrl", value: "ลายเซ็น" },
	{ key: "profileUrl", value: "รูปโปรไฟล์" },
];

export default function CreateUsers() {
	const { toast } = useToast();
	const router = useRouter();
	const [disabled, setDisabled] = useState<boolean>(false);
	const [fileObject, setFileObject] = useState<File>();
	const [data, setData] = useState<any[]>([]);
	const [list, setList] = useState<{ key: string; value: string }[]>([
		{ key: "A", value: "firstName" },
		{ key: "B", value: "lastName" },
		{ key: "C", value: "username" },
		{ key: "D", value: "password" },
		{ key: "E", value: "email" },
		{ key: "G", value: "sex" },
		{ key: "H", value: "degree" },
		{ key: "I", value: "school" },
		{ key: "J", value: "program" },
		{ key: "L", value: "position" },
		{ key: "M", value: "role" },
		{ key: "N", value: "formState" },
	]);
	const ListTemPlate = ({
		index,
		value,
	}: {
		index: number;
		value: { key: string; value: string };
	}) => {
		const userPropertyIndex = userProperty.findIndex(
			(userP) => userP.key === value.value
		);
		const userPropertyValue =
			userPropertyIndex !== -1
				? userProperty[userPropertyIndex].value
				: "เลือกค่าคีย์";
		return (
			<div className="relative">
				<div
					className="w-6 h-6 bg-[#f8d7da] border border-[#f5c6cb] flex items-center justify-center rounded-full absolute -right-2 -top-3 hover:cursor-pointer"
					onClick={() =>
						setList(list.filter((item) => item !== value))
					}
				>
					<GoTrash color="#721c24" />
				</div>
				<div>
					<div className="flex justify-between">
						<div>
							<Select
								onValueChange={(e) =>
									setList(() => {
										const prev = [...list];
										prev[index].key = e;
										return prev;
									})
								}
							>
								<SelectTrigger className="h-12 w-32">
									<SelectValue
										placeholder={`${list[index].key}`}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{alphabet.map((alp, index) => (
											<SelectItem value={alp} key={index}>
												{alp}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center">
							<GoChevronRight size={30} color="#898A8D" />
						</div>
						<div>
							<Select
								onValueChange={(e) =>
									setList(() => {
										const prev = [...list];
										prev[index].value = e;
										return prev;
									})
								}
							>
								<SelectTrigger className="h-12 w-44 focus-visible:ring-offset-0 focus-visible:ring-0">
									<SelectValue
										placeholder={userPropertyValue}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{userProperty.map((userP) => (
											<SelectItem
												value={userP.key}
												key={userP.key}
											>
												{userP.value}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const AddList = () => {
		return (
			<div
				className="border h-12 flex items-center justify-center rounded-md border-dashed bg-background hover:transition hover:scale-[1.01]"
				onClick={() =>
					setList((prevList) => [
						...prevList,
						{ key: "เลือกคอลัมน์", value: "เลือกค่าคีย์" },
					])
				}
			>
				<GoX
					size={30}
					style={{
						color: "#898A8D",
						transform: "rotate(45deg)",
					}}
				/>
			</div>
		);
	};
	useEffect(() => {
		setData([]);
		if (fileObject) {
			ExcelRenderer(fileObject, (err: any, resp: any) => {
				if (err) {
					console.log(err);
				} else {
					const modifyData = resp.rows?.map(
						(itm: any, index: any) => {
							const rowData: RowData = {};
							alphabet.forEach((alp, key) => {
								rowData[alp] = itm[key] || "";
							});
							setData((prevData) => [...prevData, rowData]);
						}
					);
				}
			});
		}
	}, [fileObject]);
	const onSubmit = async () => {
		setDisabled(true);
		if (
			list.some(
				(item) =>
					item.key === "เลือกคอลัมน์" || item.value === "เลือกค่าคีย์"
			)
		) {
			toast({
				variant: "destructive",
				description: (
					<div className=" flex items-center">
						{<GoAlertFill className="mr-2 " size={30} />}
						<p>
							โปรดเลือกคอลัมและกรอกค่าคีย์ให้ครบทุกข้อ
							ถ้ามีรายการใดที่ไม่ได้เลือก กรุณาลบข้อมูลนั้น
						</p>
					</div>
				),
			});
			setDisabled(false);
		}
		if (!fileObject) {
			toast({
				variant: "destructive",
				description: (
					<div className=" flex items-center">
						{<GoAlertFill className="mr-2" size={30} />}
						<p>กรุณาอัปโหลดไฟล์ Excel</p>
					</div>
				),
			});
			setDisabled(false);
		}
		let columnKey: RowData = {};

		list.forEach((item) => {
			columnKey[item.key] = item.value;
		});

		var data = new FormData();
		if (fileObject) {
			data.append("file", fileObject);
		}
		data.append("columnKey", JSON.stringify(columnKey));
		fetch(`/api/user/importExcel`, {
			method: "POST",
			// headers: {},
			body: data,
		})
			.then((response) => response.json())
			.then((result) => {
				console.log(result);
				if (result.message === "Users Created") {
					toast({
						description: (
							<div className=" flex items-center">
								{
									<GoCheckCircleFill
										color={"#28A645"}
										className="mr-2"
										size={30}
									/>
								}
								<p>
									{`สร้างผู้ใช้เรียบร้อยแล้ว จำนวน ${result.result.count} คน`}
								</p>
							</div>
						),
					});
					setTimeout(() => {
						router.push("/user/superAdmin");
					}, 3000);
				} else if (result.Error.code === "P2002") {
					toast({
						variant: "destructive",
						description: (
							<div className=" flex items-center">
								{<GoAlertFill className="mr-2" size={30} />}
								<p>
									มีข้อมูลที่ซ้ำกันในฟิลด์ที่ต้องไม่ซ้ำ <br />
									(เช่น รหัสนักศึกษา,อีเมล) <br />
									กรุณาตรวจสอบข้อมูลที่กรอกและลองอีกครั้ง
								</p>
							</div>
						),
					});
					setDisabled(false);
				}
			})
			.catch((error) => {});
	};
	return (
		<div className=" px-20">
			<div className="mt-12 flex gap-4 ">
				<div className="flex flex-col gap-3 ">
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor="excel ">อัพโหลด excel </Label>
						<Input
							id="picture"
							type="file"
							onChange={(e) => {
								const selectFile = e.target.files
									? e.target.files[0]
									: null;
								if (selectFile) {
									setFileObject(selectFile);
								}
							}}
							accept=".xlsx"
						/>
					</div>
					{list.map((value, key) => (
						<ListTemPlate value={value} key={key} index={key} />
					))}
					<AddList />
					<Button
						className=" bg-green-500 hover:bg-green-600"
						onClick={onSubmit}
						disabled={disabled}
					>
						{disabled && (
							<AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
						)}
						ยืนยัน
					</Button>
				</div>
				<div className="border w-[1250px] h-full bg-white ">
					<Table>
						<TableHeader>
							<TableRow>
								{alphabet.map((alp, key) => (
									<TableHead key={key}>
										<div className=" flex flex-col min-w-fit text-center items-center">
											<p>{alp}</p>
											<GoChevronDown />
											<p>
												{
													userProperty.find(
														(prop) =>
															prop.key ===
															list.find(
																(item) =>
																	item.key ===
																	alp
															)?.value
													)?.value
												}
											</p>
										</div>
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((d, rowKey) => (
								<TableRow key={rowKey}>
									{alphabet.map((letter, cellKey) => (
										<TableCell key={cellKey}>
											{d[letter]}
										</TableCell>
									))}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>
		</div>
	);
}
