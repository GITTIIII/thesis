"use client";
import { Button } from "@/components/ui/button";
import { GoPencil } from "react-icons/go";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Cropper, { Area, Point } from "react-easy-crop";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import getCroppedImg from "@/lib/cropImage";
import qs from "query-string";

const EditProfilePic = ({ user }: { user: IUser }) => {
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState<number>(1);
	const [rotation, setRotation] = useState<number>(0);
	const [image, setImage] = useState<string>("");
	const [cropImage, setCropImage] = useState<string>("");
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const formSchema = z.object({
		id: z.number(),
		profileUrl: z.string(),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			id: 0,
			profileUrl: "",
		},
	});

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
			setCropImage(croppedImage!);
		} catch (e) {}
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

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		if (cropImage == "") {
			toast({
				title: "Error",
				description: "ไม่พบรูปภาพ",
				variant: "destructive",
			});
			return;
		}
		values.profileUrl = cropImage;
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
	return (
		<>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="link">
						<GoPencil size={20} />
					</Button>
				</DialogTrigger>
				<DialogContent className="md:max-w-[500px] md:max-h-max sm:max-w-[425px]  inline rounded-lg">
					<DialogHeader>
						<DialogTitle className=" text-2xl">รูป</DialogTitle>
					</DialogHeader>
					<div className=" relative sm:h-[350px] h-60  mt-3  border">
						<Cropper
							image={image}
							crop={crop}
							zoom={zoom}
							aspect={2.5 / 3}
							rotation={rotation}
							onCropChange={setCrop}
							onCropComplete={onCropComplete}
							onZoomChange={setZoom}
							onRotationChange={setRotation}
						/>
					</div>
					<div className=" my-2 flex w-full  bg-white p-3 rounded-md border-1 border">
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
					<div className=" w-full  flex bg-white p-3 rounded-md border-1 border">
						<Label className="mr-4 content-center inline-block text-[#F26522] ">Rotation</Label>
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
					<Input
						type="file"
						accept="image/*"
						onChange={handleFileChange}
						className=" mt-2 text-sm text-grey-500 rounded-md file:border-0 file:text-md file:w-fit file:h-full file:text-[#F26522] bg-white hover:file:cursor-pointer hover:file:opacity-80"
					/>
					<Button type="submit" className=" mt-2 w-full" onClick={() => onSubmit(form.getValues())}>
						ยืนยัน
					</Button>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default EditProfilePic;
