import { Building, Check, Clock, Edit, Edit3, FileText, SlidersHorizontal, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { set } from "date-fns";

interface FilterProps {
	filterAdvisor?: boolean;
	filterHeadSchool?: boolean;
	filterFormStatus?: boolean;
	setAdvisor?: (value: boolean) => void;
	setHeadSchool?: (value: boolean) => void;
	setStatus?: (value: string) => void;
}

export function FilterTable({ filterAdvisor, filterHeadSchool, filterFormStatus, setAdvisor, setHeadSchool, setStatus }: FilterProps) {
	const clearFilters = () => {
		setAdvisor?.(false);
		setHeadSchool?.(false);
		setStatus?.("");
	};
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="bg-[#F26522] w-auto text-md text-white rounded-md border-[#F26522]" variant="default">
					<SlidersHorizontal />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-max">
				<DropdownMenuLabel>การกรอง</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{filterAdvisor && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<User className="mr-2 h-4 w-4" />

								<span>ลายเซ็นอาจารย์ที่ปรึกษา</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										onClick={() => {
											setHeadSchool?.(false);
											setAdvisor?.(true);
											setStatus?.("มีการเซ็นเรียบร้อยแล้ว");
										}}
									>
										<Check className="mr-2 h-4 w-4" />
										<span>มีการเซ็นเรียบร้อยแล้ว</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setHeadSchool?.(false);
											setAdvisor?.(true);
											setStatus?.("กำลังรอการเซ็น");
										}}
									>
										<Clock className="mr-2 h-4 w-4" />
										<span>กำลังรอการเซ็น</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					)}

					{filterHeadSchool && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<Building className="mr-2 h-4 w-4" />
								<span>ลายเซ็นหัวหน้าสาขาวิชา</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										onClick={() => {
											setAdvisor?.(false);
											setHeadSchool?.(true);
											setStatus?.("มีการเซ็นเรียบร้อยแล้ว");
										}}
									>
										<Check className="mr-2 h-4 w-4" />
										<span>มีการเซ็นเรียบร้อยแล้ว</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setAdvisor?.(false);
											setHeadSchool?.(true);
											setStatus?.("กำลังรอการเซ็น");
										}}
									>
										<Clock className="mr-2 h-4 w-4" />
										<span>กำลังรอการเซ็น</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					)}
					{filterFormStatus && (
						<DropdownMenuSub>
							<DropdownMenuSubTrigger>
								<FileText className="mr-2 h-4 w-4" />
								<span>สถานะฟอร์ม</span>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										onClick={() => {
											setHeadSchool?.(false);
											setAdvisor?.(false);
											setStatus?.("อนุมัติ");
										}}
									>
										<Check className="mr-2 h-4 w-4" />
										<span>อนุมัติ</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setHeadSchool?.(false);
											setAdvisor?.(false);
											setStatus?.("รอดำเนินการ");
										}}
									>
										<Clock className="mr-2 h-4 w-4" />
										<span>รอดำเนินการ</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setHeadSchool?.(false);
											setAdvisor?.(false);
											setStatus?.("เเก้ไข");
										}}
									>
										<Edit className="mr-2 h-4 w-4" />
										<span>เเก้ไข</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setHeadSchool?.(false);
											setAdvisor?.(false);
											setStatus?.("เเก้ไขเเล้ว");
										}}
									>
										<Edit3 className="mr-2 h-4 w-4" />
										<span>เเก้ไขเเล้ว</span>
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => {
											setHeadSchool?.(false);
											setAdvisor?.(false);
											setStatus?.("ไม่อนุมัติ");
										}}
									>
										<X className="mr-2 h-4 w-4" />
										<span>ไม่อนุมัติ</span>
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
					)}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={clearFilters}>
					<span className="text-red-500">เคลียร์การกรอง</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}