"use client";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
	onDateChange: (dateString: string) => void;
}

export function DatePicker({ onDateChange }: DatePickerProps) {
	const [date, setDate] = React.useState<Date>();

	const handleDateChange = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		const formattedDate = selectedDate ? format(selectedDate, "dd/MM/yyyy") : "";
		onDateChange(formattedDate);
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[300px] justify-start items-center text-left font-normal",
						!date && "text-muted-foreground"
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "dd/MM/yyyy") : <span>เลือกวันที่</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={date}
					onSelect={handleDateChange}
					locale={th}
				/>
			</PopoverContent>
		</Popover>
	);
}
