import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
        <div className="text-black font-normal hover:underline-none cursor-pointer">
          <ExpandableText text={data || ""} />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-[320px] sm:w-max p-3">
        <div className="flex justify-between space-x-4">{data}</div>
      </HoverCardContent>
    </HoverCard>
  );
}
