"use client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import React, { useRef, useState } from "react";
import signature from "@../../../public/asset/signature.png";
import SignatureCanvas from "react-signature-canvas";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface DialogProps {
	userSignUrl?: string;
	signUrl?: string;
	onConfirm?: Function;
	isOpen?: boolean;
	setIsOpen?: (open: boolean) => void;
	disable: boolean;
}

export default function SignatureDialog(props: DialogProps) {
	const { signUrl, onConfirm, isOpen, setIsOpen, disable, userSignUrl } = props;
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
				<div className="w-60 my-4 h-36 flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
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
					<DialogDescription>ลายเซ็นนี้จะถูกใช้เฉพาะในการลงนามเอกสารภายในเว็บไซต์นี้เท่านั้น</DialogDescription>
				</DialogHeader>
				<Tabs defaultValue="userSign" className="w-full md:w-[460px]">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="userSign">ลายเซ็นของคุณที่มีในระบบ</TabsTrigger>
						<TabsTrigger value="drawSign">วาดลายเซ็นด้วยตัวเอง</TabsTrigger>
					</TabsList>
					<TabsContent value="userSign">
						<Card>
							<CardHeader>
								<CardDescription>ลายเซ็นของคุณที่มีในระบบ</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="w-full my-4 h-36 flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
									<Image
										src={userSignUrl ? userSignUrl : signature}
										width={100}
										height={100}
										style={{
											width: "auto",
											height: "auto",
										}}
										alt="signature"
									/>
								</div>
							</CardContent>
							<CardFooter>
								<Button onClick={() => onConfirm?.(userSignUrl)} className="ml-auto">
									ยืนยัน
								</Button>
							</CardFooter>
						</Card>
					</TabsContent>
					<TabsContent value="drawSign">
						<Card>
							<CardHeader>
								<CardDescription>วาดลายเซ็นด้วยตัวเอง</CardDescription>
							</CardHeader>
							<CardContent className="space-y-2">
								<div className="w-full h-max flex justify-center mb-6 border-2 rounded-lg">
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
								<div className="flex items-center">
									<Checkbox />
									<Label className="ml-2 font-normal">ข้าพเจ้ายินยอมให้ใช้ลายเซ็นในการลงนามเอกสารฉบับนี้</Label>
								</div>
							</CardContent>
							<CardFooter>
								<div className="w-full h-full flex justify-center">
									<Button type="button" onClick={() => clear()} className="  w-auto px-6 ml-auto border-[#F26522] mr-4">
										ล้าง
									</Button>
									<Button type="button" onClick={() => handleDrawingSign()}>
										ยืนยัน
									</Button>
								</div>
							</CardFooter>
						</Card>
					</TabsContent>
				</Tabs>
			</DialogContent>
		</Dialog>
	);
}
