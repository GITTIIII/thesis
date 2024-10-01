import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";

interface DialogProps {
	loading: boolean;
	lebel: string;
	title: string;
	children: React.ReactNode;
	onConfirm: Function;
	onCancel: Function;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
}

export function ConfirmDialog(props: DialogProps) {
	const { loading, lebel, title, children, onConfirm, onCancel, isOpen, setIsOpen } = props;
	
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					disabled={loading}
					variant="outline"
					type="button"
					className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
				>
					{lebel}
				</Button>
			</DialogTrigger>
			<DialogContent
				className="sm:max-w-[450px]"
				onCloseAutoFocus={(event) => {
					event.preventDefault();
				}}
			>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<DropdownMenuSeparator/>
				<div className="grid gap-4">{children}</div>
				<DialogFooter>
					<Button
						type="reset"
						variant="outline"
						onClick={() => onCancel()}
						className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] md:ml-auto"
					>
						ยกเลิก
					</Button>
					<Button
						disabled={loading}
						variant="outline"
						onClick={() => onConfirm()}
						className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
					>
						ยืนยัน
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
