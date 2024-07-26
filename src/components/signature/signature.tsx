"use client";
import { z } from "zod";
import Image from "next/image";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import signature from "@/../../public/asset/signature.png";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SignatureCanvas from "react-signature-canvas";
import { GoFileDirectory, GoPencil, GoUpload } from "react-icons/go";
import Cropper, { CropperProps, Area, Point } from "react-easy-crop";
import getCroppedImg from "../../lib/cropImage";
type User = {
  id: number;
  signatureUrl: string;
};

const formSchema = z.object({
  id: z.number(),
  signatureUrl: z.string(),
});

async function getCurrentUser() {
  const res = await fetch("/api/getCurrentUser", {
    next: { revalidate: 10 },
  });
  return res.json();
}

export default function Signature() {
  const [active, setActive] = useState(1);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const sigCanvas = useRef<SignatureCanvas>(null);
  const clear = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      signatureUrl: "",
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        reset({
          ...form.getValues(),
          signatureUrl: base64String,
        });
      };
      reader.readAsDataURL(file);
    }
  };

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
    // const a_ = document.createElement("a");
    // a_.setAttribute("download", "reactflow.png");
    // a_.setAttribute("href", values.signatureUrl);
    // a_.click();
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
      setTimeout(() => {
        setActive(1);
      }, 1000);
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

  useEffect(() => {
    async function fetchData() {
      const data = await getCurrentUser();
      setUser(data);
    }
    fetchData();
  }, [active]);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [image, setImage] = useState<string>("");
  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
    try {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels);
      console.log("donee", { croppedImage });
      reset({
        ...form.getValues(),
        signatureUrl: croppedImage!,
      });
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
    <>
      <div className="w-full h-full bg-transparent ">
        <div className="w-full h-full bg-[#ffffff] pb-8 rounded-md">
          <div className="w-full h-fit mt-2 flex">
            <button
              onClick={() => setActive(1)}
              className={`w-full flex justify-center items-center text-sm bg-white-500 border-black  ${
                active === 1
                  ? "border-x border-t border-b-white text-[#F26522]"
                  : "border-b"
              }`}
            >
              <GoFileDirectory size={30} color={active == 1 ? "#F26522" : "#000"} />
              <label className=" text-base ml-1">ลายเซ็นของคุณที่มีในระบบ</label>
            </button>
            <button
              onClick={() => setActive(2)}
              className={`w-full    flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
                active === 2
                  ? "border-x border-t border-b-white text-[#F26522]"
                  : "border-b"
              }`}
            >
              <GoPencil size={30} color={active === 2 ? "#F26522" : "#000"} />
              <label className="ml-2">วาดลายเซ็นตัวเอง</label>
            </button>
            <button
              onClick={() => setActive(3)}
              className={`w-full    flex justify-center items-center text-sm bg-white-500 border-black p-2 ${
                active === 3
                  ? "border-x border-t border-b-white text-[#F26522]"
                  : "border-b"
              }`}
            >
              <GoUpload size={30} color={active === 3 ? "#F26522" : "#000"} />
              <label className="ml-2">อัปโหลดรูปภาพ</label>
            </button>
            <div className="bg-white-500 border-b border-black w-0  2xl:w-1/5 py-4"></div>
            <div className="bg-white-500 border-b border-black w-0  2xl:w-1/5 py-4"></div>
          </div>

          {/* main */}
          <div className="w-full h-full">
            {active == 1 && (
              <div className="w-full h-full grid sm:grid-cols-3 2xl:grid-cols-5 gap-2 p-2">
                <div className="w-max h-max flex justify-center border-2 p-4 rounded-md">
                  <Image
                    src={user?.signatureUrl ? user?.signatureUrl : signature}
                    width={200}
                    height={200}
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
                      <div className=" block h-full">
                        <SignatureCanvas
                          ref={sigCanvas}
                          backgroundColor="white"
                          throttle={8}
                          canvasProps={{
                            style: {
                              width: "100%",
                              height: "100%",
                            },
                          }}
                        />
                      </div>
                      <div className="	 absolute inline bottom-1 right-0">
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
                      aspect={3 / 1}
                      rotation={rotation}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                      restrictPosition={false}
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
                    <div className=" w-full  flex bg-white p-3 rounded-xl">
                      <Label className="mr-4 content-center inline-block text-[#F26522]">
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
    </>
  );
}
