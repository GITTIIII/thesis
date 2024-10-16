"use client";
import * as React from "react";
import { format, isBefore, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
	onDateChange: (date: Date | undefined) => void;
	disabled?: boolean;
	value?: Date;
}

export function DatePicker({ onDateChange, value, disabled }: DatePickerProps) {
	const [date, setDate] = React.useState<Date | undefined>(value);

	const handleDateChange = (selectedDate: Date | undefined) => {
		setDate(selectedDate);
		onDateChange(selectedDate);
	};

	React.useEffect(() => {
		if (value !== date) {
			setDate(value);
		}
	}, [date, value]);

	const today = startOfDay(new Date());
	const isDisabled = (date: Date) => isBefore(date, today);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					disabled={disabled}
					className={cn("w-full sm:w-max justify-start items-center text-left font-normal", !date && "text-muted-foreground")}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{date ? format(date, "dd/MM/yyyy") : <span>เลือกวันที่</span>}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar disabled={isDisabled} mode="single" selected={date} onSelect={handleDateChange} locale={th} />
			</PopoverContent>
		</Popover>
	);
}
