import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import signature from "@/../../public/asset/signature.png";
import ThesisProcessPlan from "../thesisProcessPlan";
import Image from "next/image";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import InputForm from "@/components/inputForm/inputForm";
import { IProcessPlan } from "@/interface/form";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  degree: string;
  school: string;
  program: string;
  programYear: string;
  position: string;
  role: string;
  advisorID: number;
  coAdvisorID: number;
  signatureUrl: string;
};

const formSchema = z.object({
  number: z.number(),
  trimester: z.number(),
  thesisNameTH: z.string(),
  thesisNameEN: z.string(),
  studentID: z.number(),
  advisorID: z.number(),
  coAdvisorID: z.number(),
});
const defaultprocessPlans: IProcessPlan[] = [
  {
    step: "ทบทวนการศึกษา รวมข้อมูลรวมทั้งสำรวจปริทัศน์วรรณกรรมและงานวิจัยที่เกี่ยวข้อง",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    step: "",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    step: "",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    step: "",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    step: "ปริมาณงานที่วางแผนไว้ (%)",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    step: "ปริมาณงานที่ทำได้จริง (%)",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    step: "งานสะสมที่วางแผนไว้ (%)",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    step: "งานสะสมที่ทำได้จริง (%)",
    months: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
];

const ThesisProgressFormCreate = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [allAdvisor, setAllAdvisor] = useState<User[] | null>(null);
  const [processPlans, setProcessPlans] = useState<IProcessPlan[]>();

  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: 0,
      trimester: 0,
      thesisNameTH: "",
      thesisNameEN: "",
      studentID: 0,
      advisorID: 0,
      coAdvisorID: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.signatureUrl) {
      toast({
        title: "Error",
        description: "ไม่พบลายเซ็น",
        variant: "destructive",
      });
      return;
    }
    const url = qs.stringifyUrl({
      url: `/api/outlineForm`,
    });
    const res = await axios.post(url, {
      ...values,
      processPlan: processPlans!.filter((item) => item.step !== ""),
    });
    if (res.status === 200) {
      toast({
        title: "Success",
        description: "บันทึกสำเร็จแล้ว",
        variant: "default",
      });
      setTimeout(() => {
        form.reset();
        router.refresh();
        router.push("/user/student/table");
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
        studentID: user.id,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    fetch("/api/getCurrentUser")
      .then((res) => res.json())
      .then((data) => setUser(data));
    fetch("/api/getAdvisor")
      .then((res) => res.json())
      .then((data) => setAllAdvisor(data));
    console.log(user);
  }, []);

  const [inputData, setInputData] = useState<string[][]>(
    Array(14).fill(Array(13).fill(""))
  );
  const [checkData, setCheckData] = useState<boolean[][]>(
    Array(14).fill(Array(13).fill(false))
  );

  const handleInputChange = (rowIndex: number, colIndex: number, value: string) => {
    const updatedInputData = inputData.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((col, cIndex) => (cIndex === colIndex ? value : col))
        : row
    );
    setInputData(updatedInputData);
  };

  const handleCheckboxChange = (rowIndex: number, colIndex: number) => {
    const updatedCheckData = checkData.map((row, rIndex) =>
      rIndex === rowIndex
        ? row.map((col, cIndex) => (cIndex === colIndex ? !col : col))
        : row
    );
    setCheckData(updatedCheckData);
  };

  const fixedText = [
    "ทบทวนการศึกษา รวบรวมข้อมูลรวมทั้งสำรวจปริทัศน์วรรณกรรม และงานวิจัยที่เกี่ยวข้อง",
    "ทบทวนการศึกษา รวบรวมข้อมูลรวมทั้งสำรวจปริทัศน์วรรณกรรม และงานวิจัยที่เกี่ยวข้อง",
    "จัดทำวิทยานิพนธ์",
    "สอบวิทยานิพนธ์",
    "ปริมาณงานที่วางแผนไว้ (%)",
    "ปริมาณงานที่ทำได้จริง (%)",
    "งานสะสมที่วางแผนไว้ (%)",
    "งานสะสมที่ทำได้จริง (%)",
    "งานสะสมที่ทำได้จริง (%)",
  ];

  const [isDisabled, setIsDisabled] = useState(false);

  const handleRadioChange = (value: string) => {
    if (value === "Adjustments") {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
        <div className="flex flex-col justify-center md:flex-row">
          {/* ฝั่งซ้าย */}

          <div className="w-full sm:2/4 ">
            <FormField
              control={form.control}
              name="number"
              render={({ field }) => (
                <div className="w-3/4 h-auto mb-6 mx-auto flex items-center justify-center">
                  <FormItem className="w-auto">
                    <FormLabel>ครั้งที่</FormLabel>
                    <FormControl>
                      <Input
                        type="int"
                        className="text-sm p-2 w-[300px] rounded-lg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div>
              <FormField
                control={form.control}
                name="trimester"
                render={({ field }) => (
                  <div className="w-full flex flex-row items-center mb-6 justify-center">
                    <FormItem className="w-auto">
                      <FormLabel>ประจำภาคการศึกษา</FormLabel>
                      <FormControl>
                        <Input
                          type="int"
                          className="w-[300px] text-sm p-2 rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
            <InputForm
              value={`${user?.firstName} ${user?.lastName}`}
              label="ชื่อ-นามสกุล / Fullname"
            />
            <InputForm value={`${user?.username} `} label="รหัสนักศึกษา / StudentID" />

            <div className="w-[300px] flex flex-col items-left mb-6 justify-left mx-auto">
              <FormLabel className="font-normal">
                ระดับการศึกษา / Education Level
              </FormLabel>
              <RadioGroup className="space-y-1 mt-2">
                <div>
                  <RadioGroupItem checked={user?.degree === "Master"} value="Master" />
                  <FormLabel className="ml-2 font-normal">
                    ปริญญาโท (Master Degree)
                  </FormLabel>
                </div>
                <div>
                  <RadioGroupItem
                    checked={user?.degree === "Doctoral"}
                    value="Doctoral"
                  />
                  <FormLabel className="ml-2 font-normal">
                    ปริญญาเอก (Doctoral Degree)
                  </FormLabel>
                </div>
              </RadioGroup>
            </div>

            <InputForm value={`${user?.school}`} label="สำนักวิชา / School" />
            <InputForm value={`${user?.program}`} label="หลักสูตร / Program" />
            <InputForm value={`${user?.programYear}`} label="ปีหลักสูตร / Program Year" />
            <div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
              <div className="text-center mb-5">ชื่อโครงร่างวิทยานิพนธ์</div>
              <FormField
                control={form.control}
                name="thesisNameTH"
                render={({ field }) => (
                  <div className="flex flex-row items-center mb-6 justify-center">
                    <FormItem className="w-auto">
                      <FormLabel>ชื่อภาษาไทย / ThesisName(TH)</FormLabel>
                      <FormControl>
                        <Input
                          className="text-sm p-2 w-[300px] m-auto  rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="thesisNameEN"
                render={({ field }) => (
                  <div className="flex flex-row items-center mb-6 justify-center">
                    <FormItem className="w-auto">
                      <FormLabel>ชื่อภาษาอังกฤษ / ThesisName(EN)</FormLabel>
                      <FormControl>
                        <Input
                          className="text-sm p-2 w-[300px] m-auto  rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="border-l border-[#eeee]"></div>

          {/* ฝั่งขวา */}
          <div className="w-full sm:2/4">
            <FormField
              control={form.control}
              name="advisorID"
              render={({ field }) => (
                <div className=" max-w-full flex flex-row items-center mb-6 justify-center">
                  <FormItem className="w-auto">
                    <FormLabel>อาจารย์ที่ปรึกษา / Thesis Advisor</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value, 10))}
                    >
                      <FormControl>
                        <SelectTrigger className="text-sm p-2 w-[300px] m-auto  rounded-lg">
                          <SelectValue placeholder="อาจารย์ที่ปรึกษา" defaultValue="" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allAdvisor?.map((advisor) => (
                          <SelectItem
                            key={advisor.id}
                            value={String(advisor.id)}
                          >{`${advisor.firstName} ${advisor.lastName}`}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />
            <div className="flex justify-center my-8 bg-[#ffff]  text-[#000] underline rounded-lg">
              ขอรายงานความคืบหน้าวิทยานิพนธ์ดังนี้
            </div>
            <div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
              <div className="font-normal text-center mb-5">1. ระดับการดำเนินงาน</div>

              <RadioGroup
                className="space-y-1 mt-2 justify-center"
                onValueChange={handleRadioChange}
              >
                <div className="w-[300px]">
                  <RadioGroupItem value="AsPlaned" />
                  <FormLabel className="ml-2 font-normal">
                    เป็นไปตามแผนที่วางไว้ทุกประการ
                  </FormLabel>
                </div>
                <div>
                  <RadioGroupItem value="Adjustments" />
                  <FormLabel className="ml-2 font-normal mb-6">
                    มีการเปลี่ยนแผนที่วางไว้
                  </FormLabel>
                  <Textarea
                    className="mt-2"
                    placeholder="มีการเปลี่ยนแปลงดังนี้..."
                    disabled={!isDisabled}
                  />
                </div>
              </RadioGroup>
            </div>
            <div className="w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
              <div className="w-full text-center font-normal mb-6">
                2. ผลการดำเนินงานที่ผ่านมาในครั้งนี้
              </div>
              <FormField
                control={form.control}
                name="trimester"
                render={({ field }) => (
                  <div className="flex flex-row items-center mb-6 justify-center">
                    <FormItem className="w-auto">
                      <FormLabel>คิดเป็นร้อยละการทำงานของเป้าหมาย</FormLabel>
                      <FormControl>
                        <Input
                          type="int"
                          className="text-sm p-2 w-[300px] rounded-lg"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                control={form.control}
                name="trimester"
                render={({ field }) => (
                  <div className="flex flex-row items-center mb-6 justify-center">
                    <FormItem className="w-auto">
                      <FormLabel>โดยสรุปผลได้ดังนี้</FormLabel>
                      <FormControl>
                        <Textarea
                          className="text-sm p-2 w-[300px] m-auto  rounded-lg"
                          placeholder="Type your message here."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
            <div className="mt-6 w-3/4 mx-auto p-5 flex flex-col item-center justify-center border-2 rounded-lg mb-5 border-[#eeee]">
              <div className="w-full text-center font-normal mb-6">
                3. ปัญหา อุปสรรค และแนวทางแก้ไข
              </div>
              <FormField
                control={form.control}
                name="trimester"
                render={({ field }) => (
                  <div className="flex flex-row items-center mb-6 justify-center">
                    <FormItem className="w-auto">
                      <FormControl>
                        <Textarea
                          className="text-sm p-2 w-[300px] m-auto  rounded-lg"
                          placeholder="Type your message here."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </div>
                )}
              />
            </div>
            <div className="flex flex-col items-center mt-6 mb-6 justify-center">
              <FormLabel>ลายเซ็น / Signature</FormLabel>
              <Button variant="outline" type="button" className="w-60 mt-4 h-max">
                <Image
                  src={user?.signatureUrl ? user?.signatureUrl : signature}
                  width={100}
                  height={100}
                  alt="signature"
                />
              </Button>
            </div>
          </div>
        </div>
        <hr className="่่justify-center mx-auto w-3/4 my-5 border-t-2 border-[#eeee]" />

        <div className="flex justify-center  w-full mb-10">
          {user?.degree ? (
            <ThesisProcessPlan
              degree={user!.degree}
              canEdit={true}
              processPlans={defaultprocessPlans}
              setProcessPlans={setProcessPlans}
            />
          ) : null}
          {/* <ThesisProcessPlan degree={user.degree} processPlans={defaultprocessPlans} /> */}
        </div>
        <div className="w-full flex px-20 lg:flex justify-center">
          <Button
            variant="outline"
            type="reset"
            onClick={() => router.push(`/user/student/table`)}
            className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] md:ml-auto"
          >
            ยกเลิก
          </Button>
          <Button
            variant="outline"
            type="submit"
            className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
          >
            ยืนยัน
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ThesisProgressFormCreate;
