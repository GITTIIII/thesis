"use client";
import { Button } from "@/components/ui/button";
import { GoFileDirectory, GoPencil, GoUpload } from "react-icons/go";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import Cropper, { Area, Point } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import getCroppedImg from "@/lib/cropImage";
import qs from "query-string";
import signature from "@/../../public/asset/signature.png";
import SignatureCanvas from "react-signature-canvas";

const EditSignature = ({ user }: { user: IUser }) => {
	const [open, setOpen] = useState(false);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [image, setImage] = useState<string>("");
	const [active, setActive] = useState(1);
	const { toast } = useToast();
	const router = useRouter();
	const sigCanvas = useRef<SignatureCanvas>(null);

	const clear = () => {
		if (sigCanvas.current) {
			sigCanvas.current.clear();
		}
	};

	const formSchema = z.object({
		id: z.number(),
		signatureUrl: z.string(),
	});

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			signatureUrl: "",
		},
	});

	const handleDrawingSign = () => {
		if (active == 2 && sigCanvas.current?.isEmpty()) {
			toast({
				title: "Error",
				description: "กรุณาวาดลายเซ็น",
				variant: "destructive",
			});
			return;
		} else if (active == 2 && sigCanvas.current && !sigCanvas.current.isEmpty()) {
			setImage(sigCanvas.current.getTrimmedCanvas().toDataURL("image/png"));
			setActive(3);
		}
	};

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const url = qs.stringifyUrl({
			url: `/api/user`,
		});
		const res = await axios.patch(url, values);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "บันทึกสำเร็จแล้ว",
				variant: "default",
			});
			form.reset();
			router.refresh();
			setOpen(false);
		} else {
			toast({
				title: "Error",
				description: res.statusText,
				variant: "destructive",
			});
		}
	};

	const { reset } = form;

	useEffect(() => {
		if (user) {
			reset({
				...form.getValues(),
				id: user.id,
			});
		}
	}, [user, reset]);

	const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
		try {
			const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
			console.log("donee", { croppedImage });
			reset({
				...form.getValues(),
				signatureUrl: croppedImage!,
			});
		} catch (e) {
			console.error(e);
		}
	};
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onloadend = () => {
				setImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="link">
					<GoPencil size={20} />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-fit max-h-fit rounded-lg">
				<DialogHeader>
					<DialogTitle className=" text-2xl">ลายเซ็น</DialogTitle>
				</DialogHeader>
				<div className="w-[400px] sm:w-[600px] lg:w-[800px]  h-[600px] bg-transparent ">
					<div className="w-full h-full bg-[#ffffff] pb-8 rounded-md">
						<div className="w-full h-fit mt-2 flex">
							<button
								onClick={() => setActive(1)}
								className={`w-full flex justify-center items-center text-sm bg-white-500 border-black  ${
									active === 1 ? "border-x border-t border-b-white text-[#F26522]" : "border-b"
								}`}
							>
								<GoFileDirectory className="hidden md:block" size={30} color={active == 1 ? "#F26522" : "#000"} />
								<label className="ml-1">ลายเซ็นของคุณที่มีในระบบ</label>
							</button>
							<button
								onClick={() => setActive(2)}
								className={`w-full    flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
									active === 2 ? "border-x border-t border-b-white text-[#F26522]" : "border-b"
								}`}
							>
								<GoPencil className="hidden md:block" size={30} color={active === 2 ? "#F26522" : "#000"} />
								<label className="ml-2">วาดลายเซ็นตัวเอง</label>
							</button>
							<button
								onClick={() => setActive(3)}
								className={`w-full    flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
									active === 3 ? "border-x border-t border-b-white text-[#F26522]" : "border-b"
								}`}
							>
								<GoUpload className="hidden md:block" size={30} color={active === 3 ? "#F26522" : "#000"} />
								<label className="ml-2">อัปโหลดรูปภาพ</label>
							</button>
						</div>

						{/* main */}
						<div className="w-full h-full">
							{active == 1 && (
								<div className="w-full h-full p-2">
									<div className="w-auto h-auto flex justify-center border-2 p-4 rounded-md">
										<Image
											src={user?.signatureUrl ? user?.signatureUrl : signature}
											width={200}
											height={100}
											style={{
												width: "auto",
												height: "auto",
											}}
											alt="signature"
										/>
									</div>
								</div>
							)}
							{active == 2 && (
								<div className="w-full h-full py-2 m-auto">
									<Form {...form}>
										<div className="w-full h-full flex justify-center mb-6">
											<form
												onSubmit={form.handleSubmit(onSubmit)}
												className="w-full h-full flex flex-col justify-center border-2 border-dashed border-[#F26522] bg-[#f2642229] relative"
											>
												<div className="w-full h-max flex justify-center mb-2">
													<SignatureCanvas
														ref={sigCanvas}
														backgroundColor="white"
														throttle={8}
														canvasProps={{
															style: {
																width: "400px",
																height: "150px",
															},
														}}
													/>
												</div>
												<div className="w-full flex justify-center">
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
														ต่อไป
													</Button>
												</div>
											</form>
										</div>
									</Form>
								</div>
							)}
							{active == 3 && (
								<div className="w-full h-full py-2">
									<div className="w-full h-full flex flex-col justify-center border-2 border-dashed border-[#F26522] bg-[#f2642229] relative">
										<div className=" block h-full">
											<Cropper
												image={image}
												crop={crop}
												zoom={zoom}
												aspect={5 / 2}
												rotation={rotation}
												onCropChange={setCrop}
												onCropComplete={onCropComplete}
												onZoomChange={setZoom}
												onRotationChange={setRotation}
												// restrictPosition={false}
											/>
										</div>
										<div className=" w-full flex gap-2 px-3 absolute bottom-1 right-0">
											{/* <Button className="  bg-white p-3 rounded-xl"> */}
											<Input
												type="file"
												accept="image/*"
												onChange={handleFileChange}
												className="h-auto text-sm text-grey-500 rounded-xl file:border-0 file:text-md file:w-fit file:h-full file:text-[#F26522] bg-white hover:file:cursor-pointer hover:file:opacity-80"
											/>
											{/* </Button> */}
											<div className=" flex w-full  bg-white p-3 rounded-xl">
												<Label className="mr-4 content-center inline-block text-[#F26522]">Zoom</Label>
												<Slider
													defaultValue={[zoom]}
													value={[zoom]}
													max={3}
													min={1}
													step={0.01}
													className=" w-full "
													onValueChange={(values) => setZoom(values[0])}
												/>
											</div>
											<div className=" w-full  flex bg-white p-3 rounded-xl">
												<Label className="mr-4 content-center inline-block text-[#F26522]">Rotation</Label>
												<Slider
													defaultValue={[rotation]}
													value={[rotation]}
													max={360}
													min={0}
													step={1}
													className=" w-full "
													onValueChange={(values) => setRotation(values[0])}
												/>
											</div>
											<Button
												variant="outline"
												type="button"
												onClick={() => onSubmit(form.getValues())}
												className="bg-[#F26522] w-auto text-lg text-white rounded-xl  border-[#F26522] "
											>
												ยืนยัน
											</Button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default EditSignature;
