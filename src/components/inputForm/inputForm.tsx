import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export default function InputForm({ value, label }: { value: string, label: string }) {
    return (
        <div className="w-full sm:w-max m-auto flex flex-col mb-6 justify-center">
            <Label className="w-full sm:w-[300px] text-sm font-medium">{label}</Label>
            <Input
                disabled
                className="text-sm p-2 w-full sm:w-[300px] m-auto mt-2 rounded-lg"
                value={value}
            />
        </div>
    );
}
