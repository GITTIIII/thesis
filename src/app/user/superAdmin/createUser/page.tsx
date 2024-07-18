"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { use, useEffect, useState } from "react";
import Image from "next/image";
import createUser from "@../../../public/asset/createUser.png";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateUsers from "./creatUsers";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IInstitute } from "@/interface/institute";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { IProgram } from "@/interface/program";
import { ISchool } from "@/interface/school";
import { IUser } from "@/interface/user";

const formSchema = z.object({
  prefix: z.string().min(1, { message: "กรุณาเลือกคำนำหน้า / Please select prefix" }),
  firstName: z.string().min(1, { message: "กรุณากรอกชื่อ / First name requierd" }),
  lastName: z.string().min(1, { message: "กรุณากรอกนามสกุล / Last name requierd" }),
  username: z.string().min(1, { message: "กรุณากรอกรหัสนักศึกษา / Student ID requierd" }),
  password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน / Password requierd" }),
  email: z.string().min(1, { message: "กรุณาอีเมล / Email requierd" }),
  phone: z.string(),
  sex: z.string(),
  degree: z.string().min(1, { message: "กรุณาเลือกระดับการศึกษา / Please select degree" }),
  instituteID: z.number().min(1, { message: "กรุณาเลือกสำนักวิชา / Please select institute" }),
  schoolID: z.number().min(1, { message: "กรุณาอีเมล / Please select school" }),
  programID: z.number().min(1, { message: "กรุณาอีเมล / Please select program" }),
  position: z.string(),
  role: z.string(),
  formState: z.number(),
  advisorID: z.number(),
});

async function getAllInstitute() {
  const res = await fetch("/api/institute");
  return res.json();
}

async function getAllSchool() {
  const res = await fetch("/api/school");
  return res.json();
}

async function getAllProgram() {
  const res = await fetch("/api/program");
  return res.json();
}

async function getAllAdvisor() {
  const res = await fetch("/api/getAdvisor");
  return res.json();
}

const institutePromise = getAllInstitute();
const schoolPromise = getAllSchool();
const programPromise = getAllProgram();
const allAdvisorPromise = getAllAdvisor();

const CreateUser = () => {
  const instituteData: IInstitute[] = use(institutePromise);
  const schoolData: ISchool[] = use(schoolPromise);
  const programData: IProgram[] = use(programPromise);
  const allAdvisor: IUser[] = use(allAdvisorPromise);
  const [active, setActive] = useState("student");
  const [role, setRole] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prefix: "",
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      sex: "",
      degree: "",
      instituteID: 0,
      schoolID: 0,
      programID: 0,
      position: "",
      role: "",
      formState: 0,
      advisorID: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(active);
    if (active == "student") {
      values.formState = 1;
      values.role = "STUDENT";
      values.position = "NONE";
    }
    console.log(values);
    const url = qs.stringifyUrl({
      url: `/api/user`,
    });

    try {
      const res = await axios.post(url, values);
      toast({
        title: "Success",
        description: "บันทึกสำเร็จแล้ว",
        variant: "default",
      });
      setTimeout(() => {
        form.reset();
        router.refresh();
        router.push("/user/superAdmin");
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      }
    }
  };

  const { reset } = form;

  useEffect(() => {
    reset({
      ...form.getValues(),
      schoolID: 0,
      programID: 0,
      advisorID: 0,
    });
  }, [form.watch("instituteID")]);

  useEffect(() => {
    reset({
      ...form.getValues(),
      programID: 0,
      advisorID: 0,
    });
  }, [form.watch("schoolID")]);

  return (
    <div className="w-full h-full p-12">
      <div className="flex items-center p-4">
        <Image src={createUser} width={100} height={100} alt="createUser" />
        <Label className="text-2xl">เพิ่มรายชื่อผู้ใช้</Label>
      </div>
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-max h-16 grid-cols-3">
          <TabsTrigger className="h-full text-lg" value="student" onClick={() => setActive("student")}>
            นักศึกษา
          </TabsTrigger>
          <TabsTrigger className="h-full text-lg" value="studentExcel" onClick={() => setActive("studentExcel")}>
            นักศึกษาด้วย Excel
          </TabsTrigger>
          <TabsTrigger className="h-full text-lg" value="admin" onClick={() => setActive("admin")}>
            อาจารย์/กรรมการ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>นักศึกษา</CardTitle>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4 ">
                <CardContent className="space-y-2 grid grid-cols-2">
                  {/* เเถวซ้าย */}
                  <div className="w-1/2 p-4 mx-auto">
                    <FormField
                      control={form.control}
                      name="prefix"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="prefix">คำนำหน้า / Prefix</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="คำนำหน้า" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="นาย">นาย</SelectItem>
                                <SelectItem value="นาง">นาง</SelectItem>
                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                <SelectItem value="Mr.">Mr.</SelectItem>
                                <SelectItem value="Ms.">Ms.</SelectItem>
                                <SelectItem value="Miss">Miss</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="firstName">ชื่อ / First name</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="lastName">นามสกุล / Last name</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="username">รหัสนักศึกษา / Student ID</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="password">รหัสผ่าน / Password</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="email">อีเมล / Email</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="phone">เบอร์โทร / Phone number</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="sex">เพศ / Sex</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="เพศ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="Male">ชาย</SelectItem>
                                <SelectItem value="Female">หญิง</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  </div>
                  {/* เเถวขวา */}
                  <div className="w-1/2 p-4 mx-auto">
                    <FormField
                      control={form.control}
                      name="degree"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="degree">ระดับการศึกษา / Degree</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="ระดับการศึกษา" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="Master">ปริญญาโท</SelectItem>
                                <SelectItem value="Doctoral">ปริญญาเอก</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="instituteID"
                      render={({ field }) => (
                        <div className="flex flex-row items-center mb-6 justify-center">
                          <FormItem className="w-full flex flex-col ">
                            <FormLabel>สำนักวิชา / Institute</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                  >
                                    {field.value
                                      ? `${
                                          instituteData?.find((instituteData) => instituteData.id === field.value)
                                            ?.instituteName
                                        } `
                                      : "เลือกสำนักวิชา"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="ค้นหาสำนักวิชา" />
                                  <CommandList>
                                    <CommandEmpty>ไม่พบสำนักวิชา</CommandEmpty>
                                    {instituteData?.map((instituteData) => (
                                      <CommandItem
                                        value={`${instituteData.instituteName}`}
                                        key={instituteData.id}
                                        onSelect={() => {
                                          form.setValue("instituteID", instituteData.id);
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            field.value === instituteData.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        {instituteData.instituteName}
                                      </CommandItem>
                                    ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schoolID"
                      render={({ field }) => (
                        <div className="flex flex-row items-center mb-6 justify-center">
                          <FormItem className="w-full flex flex-col ">
                            <FormLabel>สาขาวิชา / School</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                  >
                                    {field.value
                                      ? `${
                                          schoolData?.find((schoolData) => schoolData.id === field.value)?.schoolName
                                        } `
                                      : "เลือกสาขาวิชา"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="ค้นหาสาขาวิชา" />
                                  <CommandList>
                                    <CommandEmpty>ไม่พบสาขาวิชา</CommandEmpty>
                                    {schoolData
                                      ?.filter((schoolData) => schoolData.instituteID == form.watch("instituteID"))
                                      .map((schoolData) => (
                                        <CommandItem
                                          value={`${schoolData.schoolName}`}
                                          key={schoolData.id}
                                          onSelect={() => {
                                            form.setValue("schoolID", schoolData.id);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === schoolData.id ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {schoolData.schoolName}
                                        </CommandItem>
                                      ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="programID"
                      render={({ field }) => (
                        <div className="flex flex-row items-center mb-6 justify-center">
                          <FormItem className="w-full flex flex-col ">
                            <FormLabel>หลักสูตร / Program</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                  >
                                    {field.value
                                      ? `${
                                          programData?.find((programData) => programData.id === field.value)
                                            ?.programName
                                        } `
                                      : "เลือกหลักสูตร"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-full p-0">
                                <Command>
                                  <CommandInput placeholder="ค้นหาหลักสูตร" />
                                  <CommandList>
                                    <CommandEmpty>ไม่พบหลักสูตร</CommandEmpty>
                                    {programData
                                      ?.filter((programData) => programData.schoolID == form.watch("schoolID"))
                                      .map((programData) => (
                                        <CommandItem
                                          value={`${programData.programName}`}
                                          key={programData.id}
                                          onSelect={() => {
                                            form.setValue("programID", programData.id);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === programData.id ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {programData.programName}
                                        </CommandItem>
                                      ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormItem>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="advisorID"
                      render={({ field }) => (
                        <div className="flex flex-row items-center mb-6 justify-center">
                          <FormItem className="w-auto flex flex-col ">
                            <FormLabel>อาจารย์ที่ปรึกษา / Advisor</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn("w-[300px] justify-between", !field.value && "text-muted-foreground")}
                                  >
                                    {field.value
                                      ? `${allAdvisor?.find((advisor) => advisor.id === field.value)?.firstName} ${
                                          allAdvisor?.find((advisor) => advisor.id === field.value)?.lastName
                                        }`
                                      : "เลือกอาจารย์ที่ปรึกษา"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-[200px] p-0">
                                <Command>
                                  <CommandInput placeholder="ค้นหาชื่ออาจารย์ที่ปรึกษา" />
                                  <CommandList>
                                    <CommandEmpty>ไม่พบอาจารย์ที่ปรึกษา</CommandEmpty>
                                    {allAdvisor
                                      ?.filter((allAdvisor) => allAdvisor.schoolID == form.watch("schoolID"))
                                      .map((advisor) => (
                                        <CommandItem
                                          value={`${advisor.firstName} ${advisor.lastName}`}
                                          key={advisor.id}
                                          onSelect={() => {
                                            form.setValue("advisorID", advisor.id);
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value === advisor.id ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {`${advisor.firstName} ${advisor.lastName}`}
                                        </CommandItem>
                                      ))}
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        </div>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>ยืนยัน</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>อาจารย์/กรรมการ</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-full bg-white p-4 ">
                <CardContent className="space-y-2 grid grid-cols-2">
                  {/* เเถวซ้าย */}
                  <div className="w-1/2 p-4 mx-auto">
                    <FormField
                      control={form.control}
                      name="prefix"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="prefix">คำนำหน้า / Prefix</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="คำนำหน้า" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="นาย">นาย</SelectItem>
                                <SelectItem value="นาง">นาง</SelectItem>
                                <SelectItem value="นางสาว">นางสาว</SelectItem>
                                <SelectItem value="Mr.">Mr.</SelectItem>
                                <SelectItem value="Ms.">Ms.</SelectItem>
                                <SelectItem value="Miss">Miss</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="firstName">ชื่อ / First name</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="lastName">นามสกุล / Last name</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="username">ชื่อผู้ใช้ / Username</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="password">รหัสผ่าน / Password</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="email">อีเมล / Email</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="phone">เบอร์โทร / Phone number</FormLabel>
                          <Input {...field} />
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sex"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="sex">เพศ / Sex</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="เพศ" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="Male">ชาย</SelectItem>
                                <SelectItem value="Female">หญิง</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                  </div>
                  {/* เเถวขวา */}
                  <div className="w-1/2 p-4 mx-auto">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="role">บทบาท / Role</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setRole(value);
                            }}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="บทบาท" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="ADMIN">อาจารย์</SelectItem>
                                <SelectItem value="COMMITTEE">กรรมการ</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <div className="space-y-1 mb-2">
                          <FormLabel htmlFor="position">ตำเเหน่ง / Position</FormLabel>
                          <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="ตำเเหน่ง" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {role == "ADMIN" && (
                                  <>
                                    <SelectItem value="ADVISOR">อาจารย์ที่ปรึกษา</SelectItem>
                                    <SelectItem value="HEAD_INSTITUTE">หัวหน้าสาขา</SelectItem>
                                  </>
                                )}
                                {role == "COMMITTEE" && (
                                  <>
                                    <SelectItem value="COMMITTEE_OUTLINE">กรรมการสอบโครงร่างวิทยานิพนธ์</SelectItem>
                                    <SelectItem value="COMMITTEE_INSTITUTE">กรรมการประจำสำนักวิขา</SelectItem>
                                    <SelectItem value="COMMITTEE_EXAMING">กรรมการสอบวิทยานิพนธ์</SelectItem>
                                  </>
                                )}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {role == "ADMIN" && (
                      <>
                        <FormField
                          control={form.control}
                          name="instituteID"
                          render={({ field }) => (
                            <div className="flex flex-row items-center mb-6 justify-center">
                              <FormItem className="w-full flex flex-col ">
                                <FormLabel>สำนักวิชา / Institute</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? `${
                                              instituteData?.find((instituteData) => instituteData.id === field.value)
                                                ?.instituteName
                                            } `
                                          : "เลือกสำนักวิชา"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0">
                                    <Command>
                                      <CommandInput placeholder="ค้นหาสำนักวิชา" />
                                      <CommandList>
                                        <CommandEmpty>ไม่พบสำนักวิชา</CommandEmpty>
                                        {instituteData?.map((instituteData) => (
                                          <CommandItem
                                            value={`${instituteData.instituteName}`}
                                            key={instituteData.id}
                                            onSelect={() => {
                                              form.setValue("instituteID", instituteData.id);
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value === instituteData.id ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {instituteData.instituteName}
                                          </CommandItem>
                                        ))}
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </FormItem>
                            </div>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="schoolID"
                          render={({ field }) => (
                            <div className="flex flex-row items-center mb-6 justify-center">
                              <FormItem className="w-full flex flex-col ">
                                <FormLabel>สาขาวิชา / School</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        role="combobox"
                                        className={cn(
                                          "w-full justify-between",
                                          !field.value && "text-muted-foreground"
                                        )}
                                      >
                                        {field.value
                                          ? `${
                                              schoolData?.find((schoolData) => schoolData.id === field.value)
                                                ?.schoolName
                                            } `
                                          : "เลือกสาขาวิชา"}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0">
                                    <Command>
                                      <CommandInput placeholder="ค้นหาสาขาวิชา" />
                                      <CommandList>
                                        <CommandEmpty>ไม่พบสาขาวิชา</CommandEmpty>
                                        {schoolData
                                          ?.filter((schoolData) => schoolData.instituteID == form.watch("instituteID"))
                                          .map((schoolData) => (
                                            <CommandItem
                                              value={`${schoolData.schoolName}`}
                                              key={schoolData.id}
                                              onSelect={() => {
                                                form.setValue("schoolID", schoolData.id);
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  field.value === schoolData.id ? "opacity-100" : "opacity-0"
                                                )}
                                              />
                                              {schoolData.schoolName}
                                            </CommandItem>
                                          ))}
                                      </CommandList>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                              </FormItem>
                            </div>
                          )}
                        />
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>ยืนยัน</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </TabsContent>
        <TabsContent value="studentExcel">
          <Card>
            <CardHeader>
              <CardTitle>นักศึกษา</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <CreateUsers />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateUser;
