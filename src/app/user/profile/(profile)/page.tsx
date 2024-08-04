"use client";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GoPencil } from "react-icons/go";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Signature from "@/components/signature/signature";
import Cropper, { Area, Point } from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";
import { Slider } from "@/components/ui/slider";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import { IUser } from "@/interface/user";
import React, { useState, useEffect } from "react";
import signature from "@/../../public/asset/signature.png";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const prefixMapToEN: { [key: string]: string } = {
  นาย: "Mr.",
  นาง: "Miss",
  นางสาว: "Ms.",
  "Mr.": "Mr.",
  Miss: "Miss",
  "Ms.": "Ms.",
};

const prefixMapToTH: { [key: string]: string } = {
  "Mr.": "นาย",
  Miss: "นาง",
  "Ms.": "นางสาว",
  นาย: "นาย",
  นาง: "นาง",
  นางสาว: "นางสาว",
};

async function getCurrentUser() {
  const res = await fetch("/api/getCurrentUser", {
    next: { revalidate: 10 },
  });
  return res.json();
}

export default function Profile() {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    async function fetchData() {
      const data = await getCurrentUser();
      setUser(data);
    }
    fetchData();
  }, []);

  return (
    <>
      <div className="w-full md:h-full flex justify-center">
        <div className="lg:w-[950px] md:w-[750px] sm:w-[550px] w-[350px]  [&>div]:bg-white [&>div]:border [&>div]:overflow-hidden  [&>div]:rounded-lg [&>div]:shadow-[0px_0px_5px_1px_#e2e8f0] mt-12 grid md:grid-cols-4 md:grid-rows-9  gap-4">
          <div className=" md:row-span-3 md:col-start-1 md:row-start-1 md:col-span-1 col-start-2 row-span-3  col-span-2  overflow-clip  content-center justify-center flex relative ">
            <Image
              src={user?.profileUrl ? user?.profileUrl : profile}
              width={75}
              height={75}
              className="h-auto w-auto self-center rounded-full"
              alt="Profile"
            />
            <div className=" absolute right-0 top-0">
              <EditProfile user={user} />
            </div>
          </div>
          <div className=" md:col-span-3 md:row-span-3 row-start-4 row-span-3  col-span-4 p-8 relative ">
            <label className=" text-xl ">ข้อมูลส่วนตัว</label>
            <div className=" absolute right-0 top-0">
              <EditPersonalInformation user={user} />
            </div>
            <div className="mt-4 sm:flex ">
              <section className=" flex flex-col sm:w-1/2 gap-4">
                <p className=" text-lg">{`รหัสนักศึกษา: ${user?.username} `}</p>
                <p className=" text-lg">{`ชื่อ: ${
                  prefixMapToTH[user?.prefix ? user?.prefix : ""]
                }${user?.firstNameTH} ${user?.lastNameTH} `}</p>
                <p className=" text-lg">{`ชื่ออังกฤษ: ${
                  prefixMapToEN[user?.prefix ? user?.prefix : ""]
                }${user?.firstNameEN ? user?.firstNameEN : ""} ${
                  user?.lastNameEN ? user?.lastNameEN : ""
                } `}</p>
                <p className=" text-lg">{`เพศ: ${user?.sex} `}</p>
              </section>
              <section className="flex flex-col sm:mt-0 mt-3 sm:w-1/2 gap-4  ">
                <p className=" text-lg">{`อีเมล: ${user?.email} `}</p>
                <p className=" text-lg">{`เบอร์โทรศัพท์: ${user?.phone} `}</p>
              </section>
            </div>
          </div>

          <div className="md:col-span-2 md:row-span-4 md:row-start-4 row-start-7 row-span-5  col-span-4 p-8">
            <div className="w-full flex  justify-between">
              <label className=" text-xl ">ข้อมูลด้านการศึกษา</label>
            </div>
            <section className="mt-4  gap-4 flex  flex-col self-center">
              <p className=" text-lg ">{`สำนักวิชา: ${user?.institute.instituteNameTH} `}</p>
              <p className=" text-lg ">{`สาขาวิชา: ${user?.school.schoolNameTH} `}</p>
              <p className=" text-lg ">{`หลักสูตร: ${user?.program.programNameTH} ${user?.program.programYear} `}</p>
              <p className=" text-lg ">{`ระดับการศึกษา: ${
                user?.degree.toLowerCase() === "master" ? "ปริญญาโท" : "ปริญญาเอก"
              } `}</p>
              <p className=" text-lg ">{`อ.ที่ปรึกษา: ${user?.advisor.prefix} ${user?.advisor.firstNameTH} ${user?.advisor.lastNameTH}`}</p>
            </section>
          </div>
          <div className="md:col-span-2 md:row-span-4 md:col-start-3 md:row-start-4 overflow-clip  row-start-12  col-span-4 p-8 relative">
            <label className=" text-xl ">ลายเซ็น</label>
            <div className=" absolute right-0 top-0">
              <EditSignature user={user} />
            </div>
            <div className=" mt-4 flex justify-center">
              <Image
                src={user?.signatureUrl ? user?.signatureUrl : signature}
                width={100}
                height={100}
                alt="Profile"
                className=" border w-60 h-60"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const EditPersonalInformation = ({ user }: { user: IUser | undefined }) => {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    id: z.number(),
    username: z
      .string({ message: "กรุณากรอกรหัสนักศึกษา" })
      .min(1, { message: "กรุณากรอกรหัสนักศึกษา" }),
    firstNameTH: z
      .string({ message: "กรุณากรอกชื่อ" })
      .min(1, { message: "กรุณากรอกชื่อ" }),
    lastNameTH: z
      .string({ message: "กรุณากรอกนามสกุล" })
      .min(1, { message: "กรุณากรอกนามสกุล" }),
    firstNameEN: z
      .string({ message: "Please enter your first name" })
      .min(1, { message: "Please enter your first name" }),
    lastNameEN: z
      .string({ message: "Please enter your first name" })
      .min(1, { message: "Please enter your last name" }),
    sex: z.string().min(1, { message: "กรุณาระบุเพศ" }),
    email: z.string().email({ message: "กรุณากรอกอีเมลให้ถูกต้อง" }),
    phone: z
      .string()
      .length(10, { message: "เบอร์โทรศัพท์ต้องมี 10 หลัก" })
      .regex(/^\d+$/, { message: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      username: "",
      firstNameTH: "",
      lastNameTH: "",
      firstNameEN: "",
      lastNameEN: "",
      sex: "",
      email: "",
      phone: "",
    },
  });

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
        username: user.username,
        firstNameTH: user.firstNameTH,
        lastNameTH: user.lastNameTH,
        firstNameEN: user.firstNameEN,
        lastNameEN: user.lastNameEN,
        sex: user.sex,
        email: user.email,
        phone: user.phone,
      });
    }
  }, [user, reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">
          <GoPencil size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:max-w-[500px] md:max-h-max max-w-[350px] max-h-[550px]  overflow-auto rounded-lg">
        <DialogHeader>
          <DialogTitle className=" text-2xl">แก้ไขข้อมูลส่วนตัว</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสนักศึกษา</FormLabel>
                  <FormControl>
                    <Input {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between md:flex-row flex-col">
              <FormField
                control={form.control}
                name="firstNameTH"
                render={({ field }) => (
                  <FormItem className=" md:w-52">
                    <FormLabel>ชื่อ</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastNameTH"
                render={({ field }) => (
                  <FormItem className=" md:w-52">
                    <FormLabel>นามสกุล</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between  md:flex-row flex-col">
              <FormField
                control={form.control}
                name="firstNameEN"
                render={({ field }) => (
                  <FormItem className=" md:w-52">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input placeholder="First name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastNameEN"
                render={({ field }) => (
                  <FormItem className=" md:w-52">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="sex"
              render={({ field }) => (
                <FormItem className=" md:w-52">
                  <FormLabel>เพศ</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="เพศ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="male">ชาย</SelectItem>
                          <SelectItem value="female">หญิง</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>อีเมล</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className=" mt-4">
              <Button type="submit">ยืนยัน</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const EditSignature = ({ user }: { user: IUser | undefined }) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link">
          <GoPencil size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-fit  max-h-fit">
        <DialogHeader>
          <DialogTitle className=" text-2xl">ลายเซ็น</DialogTitle>
        </DialogHeader>
        <div className=" lg:w-[950px] lg:h-[650px] md:w-[700px] w-[520px] h-[500px]">
          <Signature user={user} />
        </div>
        <DialogFooter>{/* <Button type="submit">Save changes</Button> */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EditProfile = ({ user }: { user: IUser | undefined }) => {
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
    // const aTag = document.createElement("a");
    // aTag.href = cropImage;
    // aTag.download = "test";
    // aTag.click();
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
            <Label className="mr-4 content-center inline-block text-[#F26522]">
              Zoom
            </Label>
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
            <Label className="mr-4 content-center inline-block text-[#F26522] ">
              Rotation
            </Label>
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
          <Button
            type="submit"
            className=" mt-2 w-full"
            onClick={() => onSubmit(form.getValues())}
          >
            ยืนยัน
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
