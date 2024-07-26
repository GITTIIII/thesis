"use client";
import axios from "axios";
import ThesisProgressFormCreate from "@/components/form/06-thesisProgressForm/06-thesisProgressFormCreate";
import { date } from "zod";
import Image from "next/image";
import { GrPowerReset } from "react-icons/gr";
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
import Cropper, { CropperProps, Area, Point } from "react-easy-crop";
import { useState } from "react";
import getCroppedImg from "@/lib/cropImage";
import { Slider } from "@/components/ui/slider";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";

export default async function profile() {
  return (
    <>
      <div className="w-full md:h-full flex justify-center">
        <div className="lg:w-[950px] md:w-[750px] sm:w-[550px] w-[350px]  [&>div]:bg-white [&>div]:border [&>div]:overflow-hidden  [&>div]:rounded-lg [&>div]:shadow-[0px_0px_5px_1px_#e2e8f0] mt-12 grid md:grid-cols-4 md:grid-rows-9  gap-4">
          <div className=" md:row-span-3 md:col-start-1 md:row-start-1 md:col-span-1 col-start-2 row-span-3  col-span-2  overflow-clip  content-center justify-center flex relative ">
            <Image
              src={user.signatureUrl}
              width={0}
              height={0}
              className="h-auto md:w-full w-auto   self-center "
              alt="Profile"
            />
            <div className=" absolute right-0 top-0">
              <EditProfile />
            </div>
          </div>
          <div className=" md:col-span-3 md:row-span-3 row-start-4 row-span-3  col-span-4 p-8 relative ">
            <label className=" text-xl ">ข้อมูลส่วนตัว</label>
            <div className=" absolute right-0 top-0">
              <EditPersonalInformation user_={user} />
            </div>
            <div className="mt-4 sm:flex ">
              <section className=" flex flex-col sm:w-1/2 gap-4">
                <p className=" text-lg">{`รหัสนักศึกษา: ${user.username} `}</p>
                <p className=" text-lg">{`ชื่อ: ${user.prefix}${user.firstNameTH} ${user.lastNameTH} `}</p>
                <p className=" text-lg">{`ชื่ออังกฤษ: ${user.prefix}${user.firstNameEN} ${user.lastNameEN} `}</p>
                <p className=" text-lg">{`เพศ: ${user.sex} `}</p>
              </section>
              <section className="flex flex-col sm:mt-0 mt-3 sm:w-1/2 gap-4  ">
                <p className=" text-lg">{`อีเมล: ${user.email} `}</p>
                <p className=" text-lg">{`เบอร์โทรศัพท์: ${user.phone} `}</p>
              </section>
            </div>
          </div>

          <div className="md:col-span-2 md:row-span-4 md:row-start-4 row-start-7 row-span-5  col-span-4 p-8">
            <div className="w-full flex  justify-between">
              <label className=" text-xl ">ข้อมูลด้านการศึกษา</label>
            </div>
            <section className="mt-4  gap-4 flex  flex-col self-center">
              <p className=" text-lg ">{`สำนักวิชา: ${user.institute.instituteNameTH} `}</p>
              <p className=" text-lg ">{`สาขาวิชา: ${user.school.schoolNameTH} `}</p>
              <p className=" text-lg ">{`หลักสูตร: ${user.program.programNameTH} ${user.program.programYear} `}</p>
              <p className=" text-lg ">{`ระดับการศึกษา: ${
                user.degree.toLowerCase() === "master" ? "ปริญญาโท" : "ปริญญาเอก"
              } `}</p>
              <p className=" text-lg ">{`อ.ที่ปรึกษา: ${user.advisor.prefix} ${user.advisor.firstNameTH} ${user.advisor.lastNameTH}`}</p>
            </section>
          </div>
          <div className="md:col-span-2 md:row-span-4 md:col-start-3 md:row-start-4 overflow-clip  row-start-12  col-span-4 p-8 relative">
            <label className=" text-xl ">ลายเซ็น</label>
            <div className=" absolute right-0 top-0">
              <EditSignature />
            </div>
            <div className=" mt-4 flex justify-center">
              <Image
                src={user.signatureUrl}
                width={0}
                height={0}
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
const EditPersonalInformation = ({ user_ }: { user_: any }) => {
  const formSchema = z.object({
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
      username: user_.username,
      firstNameTH: user_.firstNameTH,
      lastNameTH: user_.lastNameTH,
      firstNameEN: user_.firstNameEN,
      lastNameEN: user_.lastNameEN,
      sex: user_.sex.toLowerCase(),
      email: user_.email,
      phone: user_.phone,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Dialog>
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
                    <Input placeholder="Student Id " {...field} disabled />
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
                      <Input placeholder="ชื่อ" {...field} disabled />
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
                      <Input placeholder="นามสกุล" {...field} disabled />
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

const EditSignature = () => {
  return (
    <Dialog>
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
          <Signature />
        </div>
        <DialogFooter>{/* <Button type="submit">Save changes</Button> */}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
const EditProfile = () => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [image, setImage] = useState<string>("");
  const [cropImage, setCropImage] = useState<string>("");
  const { toast } = useToast();

  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels, rotation);
      setCropImage(croppedImage!);
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

  const onSubmit = async () => {
    const url = qs.stringifyUrl({
      url: `/api/user`,
    });
    // const aTag = document.createElement("a");
    // aTag.href = cropImage;
    // aTag.download = "test";
    // aTag.click();
    const res = await axios.patch(url, { img: cropImage });
    if (res.status === 200) {
      toast({
        title: "Success",
        description: "บันทึกสำเร็จแล้ว",
        variant: "default",
      });
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
      <Dialog>
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
          <Button type="submit" className=" mt-2 w-full" onClick={() => onSubmit()}>
            ยืนยัน
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

const user = {
  id: 3,
  formLanguage: "th",
  prefix: "นาย",
  firstNameTH: "ภาณุพงศ์",
  lastNameTH: "ศรีไทย",
  firstNameEN: null,
  lastNameEN: null,
  username: "M6407100",
  email: "M6407100@g.sut.ac.th",
  phone: "0123456789",
  sex: "Male",
  degree: "Master",
  instituteID: 1,
  schoolID: 1,
  programID: 1,
  position: "NONE",
  role: "STUDENT",
  formState: 1,
  signatureUrl:
    "data:image/png;base64,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",
  profileUrl: "",
  approvedExpert: null,
  committeeType: null,
  advisorID: 2,
  coAdvisorID: null,
  createdAt: "2024-07-21T17:16:06.141Z",
  updatedAt: "2024-07-23T08:35:08.858Z",
  institute: {
    id: 1,
    instituteNameTH: "สำนักวิชาวิศวกรรมศาสตร์",
    instituteNameEN: "instituteNameEN",
  },
  school: {
    id: 1,
    schoolNameTH: "วิศวกรรมการผลิต",
    schoolNameEN: "schoolNameEN",
    instituteID: 1,
  },
  program: {
    id: 1,
    programNameTH: "วิศวกรรมเครื่องกลและระบบกระบวนการ",
    programNameEN: "programNameEN",
    programYear: "2567",
  },
  advisor: {
    id: 2,
    formLanguage: null,
    prefix: "นาย",
    firstNameTH: "ธีรโชติ",
    lastNameTH: "สนนอก",
    firstNameEN: null,
    lastNameEN: null,
    username: "22222222",
    password: "$2b$10$JE/8F1jrv2gFOqlbRQgBKO5jWDr70h7nx9hJWQL93d6yCDksarinS",
    email: "pualtung@g.sut.ac.th",
    phone: "0123456789",
    sex: "Male",
    degree: "",
    instituteID: 1,
    schoolID: 1,
    programID: null,
    position: "ADVISOR",
    role: "ADMIN",
    formState: null,
    signatureUrl: "",
    profileUrl: "",
    approvedExpert: null,
    committeeType: null,
    advisorID: null,
    coAdvisorID: null,
    createdAt: "2024-07-21T17:16:06.141Z",
    updatedAt: "2024-07-21T17:16:06.141Z",
  },
  coAdvisor: null,
};
