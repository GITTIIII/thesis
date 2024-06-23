import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Advisor = [
    {
        id: 1,
        firstname: "fist",
        lastname: "last"
    },
    {
        id: 2,
        firstname: "fist",
        lastname: "last"
    },
    {
        id: 3,
        firstname: "fist",
        lastname: "last"
    },
    {
        id: 4,
        firstname: "fist",
        lastname: "last"
    },
    {
        id: 5,
        firstname: "fist",
        lastname: "last"
    },
]

type User = {
    id:number;
    firstName: string;
    lastName: string;
    username: string;
    education_level: string;
    school: string;
    program: string;
    program_year: string;
    advisorID: number;
    co_advisorID: number;
};

const formSchema = z.object({
    date: z.string(),
    fullname: z.string(),
    username: z.string(),
    education_level: z.string(),
    school: z.string(),
    program: z.string(),
    program_year: z.string(),
    thesisNameTH: z.string(),
    thesisNameEN: z.string(),
    advisorID: z.number(),
    co_advisorID: z.number(),
    studentID: z.number(),
    student_signature: z.string(),
})

const Form1 = () => {
    const router = useRouter();
    const [user, setUser] = useState<User|null>(null);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            date: "",
            fullname: "",
            username: "",
            education_level: "",
            school: "",
            program: "",
            program_year: "",
            thesisNameTH: "",
            thesisNameEN: "",
            advisorID: 0,
            co_advisorID: 0,
            studentID: 0,
            student_signature: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    const { reset } = form;

    useEffect(() => {
        if (user) {
            reset({
                ...form.getValues(),
                fullname: `${user.firstName} ${user.lastName}`,
                username: `${user.username}`,
                education_level: `${user.education_level}`,
                school: `${user.school}`,
                program: `${user.program}`,
                program_year: `${user.program_year}`,
            });
        }
    }, [user, reset]);

    useEffect(() => {
        fetch('/api/user')
            .then(res => res.json())
            .then(data => setUser(data))
    }, [])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-full h-full bg-white p-4'>
                <div className='flex flex-col justify-center lg:flex-row'>
                    {/* ฝั่งซ้าย */}
                    <div className='w-full sm:2/4'>
                        <FormField
                            control={form.control}
                            name="date"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>วันที่ / DATE</FormLabel>
                                    <FormControl>
                                    <Input type='date' className='text-sm p-2 w-max border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fullname"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>ชื่อ-นามสกุล / FullName</FormLabel>
                                    <FormControl>
                                    <Input className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>รหัสนักศึกษา / Student-No.</FormLabel>
                                    <FormControl>
                                    <Input className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="education_level"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>ระดับการศึกษา / Education-Level</FormLabel>
                                    <FormControl>
                                    <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem checked={user?.education_level === "Master"} value="Master" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    ปริญญาโท (Master Degree)
                                                </FormLabel>
                                        </FormItem>

                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem checked={user?.education_level === "Doctoral"} value="Doctoral" />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    ปริญญาเอก (Doctoral Degree)
                                                </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="school"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>สาขาวิชา / School</FormLabel>
                                    <FormControl>
                                    <Input className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="program"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>หลักสูตร / Program</FormLabel>
                                    <FormControl>
                                    <Input className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="program_year"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>ปีหลักสูตร / ProgramYear</FormLabel>
                                    <FormControl>
                                    <Input className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                    </div>

                    {/* ฝั่งขวา */}
                    <div className='w-full sm:2/4'>
                        <div className='text-center'>ชื่อโครงร่างวิทยานิพนธ์</div>
                        <FormField
                            control={form.control}
                            name="thesisNameTH"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>ชื่อภาษาไทย / ThesisName(TH)</FormLabel>
                                    <FormControl>
                                    <Input className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="thesisNameEN"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>ชื่อภาษาอังกฤษ / ThesisName(EN)</FormLabel>
                                    <FormControl>
                                    <Input className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'
                                        {...field}
                                    />
                                    </FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="advisorID"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>อาจารย์ที่ปรึกษา / Thesis Advisor</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                                        <FormControl>
                                        <SelectTrigger className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'>
                                            <SelectValue placeholder="อาจารย์ที่ปรึกษา"  defaultValue=""/>
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Advisor.map((advisor) => (
                                                <SelectItem key={advisor.id} value={String(advisor.id)}>{`${advisor.firstname} ${advisor.lastname}`}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="co_advisorID"
                            render={ ({ field }) => (
                                <div className='flex flex-row items-center mb-6 justify-center'>
                                    <FormItem className='w-auto'>
                                    <FormLabel>อาจารย์ที่ปรึกษาร่วม(ถ้ามี) / Co-Thesis Advisor (if any)</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(parseInt(value, 10))}>
                                        <FormControl>
                                        <SelectTrigger className='text-sm p-2 w-60 m-auto border-solid border-2 border-black rounded-lg'>
                                            <SelectValue placeholder="อาจารย์ที่ปรึกษาร่วม"  defaultValue=""/>
                                        </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Advisor.map((advisor) => (
                                                <SelectItem key={advisor.id} value={String(advisor.id)}>{`${advisor.firstname} ${advisor.lastname}`}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage/>
                                    </FormItem>
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className='w-full flex px-20 lg:flex justify-center'>
                    <Button variant="outline" type="reset" onClick={() => router.push("/user/student")} className='bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436] lg:ml-auto'>
                        ยกเลิก
                    </Button>
                    <Button variant="outline" type="submit" className='bg-[#A67436] w-auto text-lg text-white rounded-xl ml-4 border-[#A67436]'>
                        ยืนยัน
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default Form1;