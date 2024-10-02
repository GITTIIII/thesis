import { CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useState } from "react";

function ExpandableText({ text, limit = 20 }: { text: string; limit?: number }) {
	if (text.length <= limit) {
		return <span>{text}</span>;
	}

	return <span>{text.substring(0, limit) + "..."}</span>;
}

export function HoverCardTable({ data }: { data: string }) {
	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<Button variant="ghost" className="text-black font-normal hover:underline-none">
					<ExpandableText text={data || ""} />
				</Button>
			</HoverCardTrigger>
			<HoverCardContent className="w-[320px] sm:w-max p-3">
				<div className="flex justify-between space-x-4">{data}</div>
			</HoverCardContent>
		</HoverCard>
	);
}
