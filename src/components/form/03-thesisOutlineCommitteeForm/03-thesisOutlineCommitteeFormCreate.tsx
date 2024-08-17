import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import qs from "query-string";
import InputForm from "../../inputForm/inputForm";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IUser } from "@/interface/user";
import { ICoAdvisorStudents } from "@/interface/coAdvisorStudents";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/datePicker/datePicker";

const formSchema = z.object({
    date: z.string(),
    studentID: z.number(),
    times: z.number().min(1, { message: "กรุณาระบุครั้ง / Times required" }),
    trimester: z
        .number()
        .min(1, { message: "กรุณาระบุภาคเรียน / Trimester required" })
        .max(3, { message: "กรุณาระบุเลขเทอมระหว่าง 1-3 / Trimester must be between 1-3" }),
    academicYear: z.string().min(1, { message: "กรุณากรอกปีการศึกษา / Academic year required" }),
    committeeMembers: z
        .array(z.object({ name: z.string().min(1, { message: "กรุณากรอกชื่อกรรมการ / Committee member required" }) }))
        .min(4, { message: "กรุณาเพิ่มกรรมการอย่างน้อย 4 คน / At least 4 committee members required" }),
        examDate: z.string().min(1, { message: "กรุณาเลือกวันที่สอบ / Exam's date is required." })
});

async function getUser() {
    const res = await fetch("/api/getCurrentUser");
    return res.json();
}

async function getAllAdvisor() {
    const res = await fetch("/api/getAdvisor");
    return res.json();
}

const userPromise = getUser();
const allAdvisorPromise = getAllAdvisor();

const ThesisOutlineCommitteeFormCreate = () => {
    const router = useRouter();
    const user: IUser = use(userPromise);
    const allAdvisor: IUser[] = use(allAdvisorPromise);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: "",
            studentID: 0,
            times: 0,
            trimester: 0,
            academicYear: "",
            committeeMembers: [{ name: "" }],
            examDate: ""
        },
    });

    const { control, handleSubmit, reset } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: "committeeMembers",
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Log form values for testing
        console.log("Form values: ", values);


        try {
            const url = qs.stringifyUrl({ url: `/api/03ThesisOutlineCommitteeForm` });
            const res = await axios.post(url, values);
            if (res.status === 200) {
                toast({
                    title: "Success",
                    description: "บันทึกสำเร็จแล้ว",
                    variant: "default",
                });
                setTimeout(() => {
                    form.reset();
                    router.refresh();
                    router.push("/user/table");
                }, 1000);
            } else {
                toast({
                    title: "Error",
                    description: res.statusText,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "An error occurred.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        const currentDate = `${date}/${month}/${year}`;
        if (user) {
            reset({
                ...form.getValues(),
                studentID: user.id,
                date: currentDate,
            });
        }
    }, [user, reset]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full h-full bg-white p-4">
                <div className="flex flex-col justify-center md:flex-row">
                    <div className="w-full sm:2/4">
                        <h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
                        <FormField
                            control={form.control}
                            name="times"
                            render={({ field }) => (
                                <div className="flex flex-row items-center mb-6 justify-center">
                                    <FormItem className="w-[300px]">
                                        <FormLabel>
                                            สอบครั้งที่ / Exam. No. <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Input
                                            value={field.value ? field.value : ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
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
                                    <FormItem className="w-[300px]">
                                        <FormLabel>
                                            ภาคเรียน / Trimester <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Input
                                            value={field.value ? field.value : ""}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="academicYear"
                            render={({ field }) => (
                                <div className="flex flex-row items-center mb-6 justify-center">
                                    <FormItem className="w-[300px]">
                                        <FormLabel>
                                            ปีการศึกษา / Academic year <span className="text-red-500">*</span>
                                        </FormLabel>
                                        <Input {...field} />
                                        <FormMessage />
                                    </FormItem>
                                </div>
                            )}
                        />
                        <h1 className="text-center font-semibold mb-2">รายละเอียดนักศึกษา</h1>
                        <InputForm value={`${user?.firstNameTH} ${user?.lastNameTH}`} label="ชื่อ-นามสกุล / Full Name" />
                        <InputForm value={`${user?.username}`} label="รหัสนักศึกษา / Student ID" />
                        <InputForm value={`${user?.school.schoolNameTH}`} label="สาขาวิชา / School" />
                        <InputForm value={`${user?.program.programNameTH}`} label="หลักสูตร / Program" />
                        <InputForm value={`${user?.program.programYear}`} label="ปีหลักสูตร / Program Year" />
                        <InputForm value={`${user?.advisor.firstNameTH} ${user?.advisor.lastNameTH}`} label="อาจารย์ที่ปรึกษา / The Advisor" />
                        {user.coAdvisedStudents && user.coAdvisedStudents.length > 0 &&
                            user.coAdvisedStudents.map((member: ICoAdvisorStudents, index: number) => (
                                <InputForm key={index} value={`${member.coAdvisor.firstNameTH} ${member.coAdvisor.lastNameTH}`} label="อาจารย์ที่ปรึกษาร่วม / CoAdvisor" />
                            ))}
                    </div>

                    <div className="w-full sm:2/4">
                        <div className="w-full flex justify-center item-center flex-col h-auto border-2 rounded-lg py-5 border-[#eeee]">
                            <h1 className="text-center font-semibold mb-2">แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ</h1>
                            <div>
                                {fields.map((field, index) => (
                                    <FormField
                                        key={field.id}
                                        control={form.control}
                                        name={`committeeMembers.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem className="m-5 w-full flex justify-center">
                                                <div className="flex items-center space-x-3">
                                                    <Input
                                                        value={field.value ? field.value : ""}
                                                        onChange={field.onChange}
                                                        className="w-[300px]"
                                                    />
                                                    <Button
                                                        type="button"
                                                        onClick={() => remove(index)}
                                                        className="bg-[#e84949] text-white hover:bg-red-500"
                                                    >
                                                        ลบ
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ))}
                                <div className="w-full flex justify-center items-center">
                                    <Button
                                        type="button"
                                        onClick={() => append({ name: "" })}
                                        className="bg-[#A67436] text-white hover:bg-orange-600"
                                    >
                                        เพิ่มกรรมการ
                                    </Button>
                                </div>
                            </div>
                            <div className="m-5 w-full flex justify-center">
                                <FormField
                                    control={form.control}
                                    name="examDate"
                                    render={({ field }) => (
                                        <FormItem className="w-[300px]">
                                            <FormLabel>
                                                วันที่สอบ / Exam's date <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <DatePicker onDateChange={field.onChange} />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex mt-4 px-20 lg:flex justify-center">
                    <Button
                        variant="outline"
                        type="submit"
                        className="bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436] mr-4"
                    >
                        ยืนยัน
                    </Button>
                    <Button
                        disabled={loading}
                        onClick={() => reset()}
                        className="bg-red-500 text-white w-auto text-lg rounded-xl border-red-600"
                    >
                        ยกเลิก
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default ThesisOutlineCommitteeFormCreate;
