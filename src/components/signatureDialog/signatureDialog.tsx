"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import React, { useRef } from "react";
import signature from "@../../../public/asset/signature.png";
import SignatureCanvas from "react-signature-canvas";
import Image from "next/image";
interface DialogProps {
	signUrl?: string;
	onConfirm?: Function;
	isOpen?: boolean;
	setIsOpen?: (open: boolean) => void;
	disable: boolean;
}

export default function SignatureDialog(props: DialogProps) {
	const { signUrl, onConfirm, isOpen, setIsOpen, disable } = props;
	const { toast } = useToast();
	const sigCanvas = useRef<SignatureCanvas>(null);
	const clear = () => {
		if (sigCanvas.current) {
			sigCanvas.current.clear();
		}
	};

	const handleDrawingSign = () => {
		if (sigCanvas.current?.isEmpty()) {
			toast({
				title: "เกิดข้อผิดพลาด",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		} else if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
			if (isOpen && onConfirm) {
				onConfirm(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
			}
		}
	};
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger onClick={() => setIsOpen?.(!isOpen)} disabled={disable}>
				<div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
					<Image
						src={signUrl ? signUrl : signature}
						width={100}
						height={100}
						style={{
							width: "auto",
							height: "auto",
						}}
						alt="signature"
					/>
				</div>
			</DialogTrigger>
			<DialogContent className="w-max">
				<DialogHeader>
					<DialogTitle>ลายเซ็น</DialogTitle>
				</DialogHeader>
				<div className="w-full h-max flex justify-center mb-6 border-2">
					<SignatureCanvas
						ref={sigCanvas}
						backgroundColor="white"
						throttle={8}
						canvasProps={{
							width: 400,
							height: 150,
							className: "sigCanvas",
						}}
					/>
				</div>
				<div className="w-full h-full flex justify-center">
					<Button
						variant="outline"
						type="button"
						onClick={() => clear()}
						className="bg-[#F26522] w-auto px-6 text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
					>
						ล้าง
					</Button>
					<Button
						variant="outline"
						type="button"
						onClick={() => handleDrawingSign()}
						className="bg-[#F26522] w-auto text-lg text-white rounded-xl ml-4 border-[#F26522] mr-4"
					>
						ยืนยัน
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
