"use client";
import React from "react";
import { Table, TableHeader, TableColumn, Pagination, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";
import { useToast } from "../ui/use-toast";

const columns = [
	{ key: "index", label: "ลำดับ" },
	{ key: "prefix", label: "คำนำหน้า" },
	{ key: "firstNameTH", label: "ชื่อ" },
	{ key: "lastNameTH", label: "นามสกุล" },
	{ key: "actions", label: "" },
];

interface IPrefix {
	prefixTH: string;
}

interface IUser {
	id: number;
	prefix: IPrefix; // IPrefix object
	firstNameTH: string;
	lastNameTH: string;
}

export default function AdminTable({ adminData }: { adminData: any[] }) {
	const { toast } = useToast();
	const [page, setPage] = React.useState(1);
	const [filterValue, setFilterValue] = React.useState("");
	const rowsPerPage = 25;

	const pages = Math.ceil(adminData.length / rowsPerPage);

	const getItems = () => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return adminData.slice(start, end);
	};

	const getFilteredItems = () => {
		if (!filterValue) return getItems();

		return getItems().filter(
			(item) =>
				item.firstNameTH.toLowerCase().includes(filterValue.toLowerCase()) ||
				item.lastNameTH.toLowerCase().includes(filterValue.toLowerCase())
		);
	};

	const filteredItems = getFilteredItems();

	const handleCopy = (prefix?: string, firstName?: string, lastName?: string) => {
		const textToCopy = `${prefix}${firstName} ${lastName}`;
		navigator.clipboard
			.writeText(textToCopy)
			.then(() => {
				toast({
					title: "Success",
					description: "คัดลอกสำเร็จ",
					variant: "default",
					duration: 1000,
				});
			})
			.catch((err) => {
				console.error("Failed to copy text: ", err);
			});
	};

	const onSearchChange = (value?: string) => {
		setFilterValue(value || "");
		setPage(1);
	};

	return (
		<div className="w-full">
			<div className="flex items-center mb-4">
				<Input
					isClearable
					placeholder="ค้นหาด้วยชื่อหรือนามสกุล..."
					value={filterValue}
					onValueChange={onSearchChange}
					className="bg-white border border-gray-300 rounded-md shadow-sm focus:border-[#A67436] focus:ring-[#A67436] transition duration-150 ease-in-out w-full md:w-1/3"
				/>
			</div>
			<Table
				aria-label="Example table with client side pagination"
				bottomContent={
					<div className="flex w-full justify-center">
						<Pagination
							isCompact
							showControls
							showShadow
							color="secondary"
							page={page}
							total={pages}
							onChange={(page: number) => setPage(page)}
						/>
					</div>
				}
				className="w-full bg-white border border-[#E0E0E0] rounded-lg shadow-md min-h-[222px]"
			>
				<TableHeader columns={columns}>
					{(column: { key: string; label: any }) => (
						<TableColumn
							key={column.key}
							className={`bg-gray-100 text-left px-4 py-2 text-gray-700 uppercase text-sm font-medium ${
								column.key === "actions" ? "w-24 text-center" : ""
							}`}
						>
							{column.label}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody>
					{filteredItems.map((item, rowIndex) => (
						<TableRow key={item.id} className="hover:bg-gray-50">
							{columns.map((column) => (
								<TableCell key={column.key} className="px-4 py-2 border-t border-gray-200 text-gray-800">
									{column.key === "index" ? (
										(page - 1) * rowsPerPage + rowIndex + 1 // คำนวณลำดับที่แสดงในตาราง
									) : column.key === "actions" ? (
										<button
											onClick={() => handleCopy(item.prefix?.prefixTH, item.firstNameTH, item.lastNameTH)}
											className="px-2 py-1 bg-[#A67436] text-white rounded text-xs"
										>
											คัดลอก
										</button>
									) : column.key === "prefix" ? (
										item.prefix.prefixTH // Render the prefix string instead of the whole object
									) : (
										item[column.key as keyof IUser]
									)}
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
