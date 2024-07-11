import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function InputForm({ value, label }: { value: string, label: string }) {
    return (
        <div className="w-max m-auto flex flex-col mb-6 justify-center">
            <Label>{label}</Label>
            <Input
                className="text-sm p-2 w-[300px] m-auto mt-2 rounded-lg"
                value={value}
            />
        </div>
    );
}
