"use client"
import Image from 'next/image'
import sutLogo from "@/../../public/asset/sutLogo.jpg"
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

const formSchema = z.object({
    username: z.string()
        .min(1,{message: "กรุณากรอกชื่อผู้ใช้"})
        .min(8,{message: "ชื่อผู้ใช้ต้องมีความยาว 8-10 ตัว"})
        .max(10,{message: "ชื่อผู้ใช้ต้องมีความยาว 8-10 ตัว"}),
    password: z.string().min(1,{message: "กรุณากรอกรหัสผ่าน"})
})

const LoginPage = () => {
    const router = useRouter();
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues:{
            username: "",
            password: "",
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const signInData = await signIn("credentials", {
                username: values.username,
                password: values.password,
                redirect: false,
        });

        if (signInData?.error) {
            console.log(signInData.error);
        }else{
            console.log("Login successful");
        }
    }

    return(
        <>
            <div className="flex w-full h-full bg-white relative overflow-hidden justify-center items-center blur-md">
                <div className="absolute w-[741px] h-[752px] top-[-113px] left-[-409px] bg-[#F26522] rounded-full inline-block"></div>
                <div className="absolute w-[470px] h-[752px] left-full bg-[#F26522] rounded-full rotate-[-127deg]"></div>
            </div>
            <div className='flex absolute w-full h-full top-0 bg-transparent justify-center items-center'>
                <div className="flex flex-col w-full h-auto px-6 py-5 bg-white rounded-3xl shadow-2xl z-50 justify-center items-center sm:w-auto">
                        <div>
                            <Image
                            src={sutLogo}
                            width={552}
                            height={130}
                            alt="sutLogo"
                            />
                        </div>
                        <div className='w-full h-[0.2px] bg-[#F26522] my-6 '/>
                        <label className='text-[#F26522] mb-8'>กรุณาเข้าสู่ระบบ</label>
                        <div>

                        </div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col w-3/4 sm:w-2/4'>
                                <div className='text-black mb-4'>
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={ ({ field }) => (
                                            <div className='flex flex-row items-center mb-6 justify-center'>
                                                <FormItem className='w-3/4'>
                                                <FormLabel>ชื่อผู้ใช้</FormLabel>
                                                    <FormControl>
                                                        <Input className='text-sm p-2 w-full border-solid border-2 border-black rounded-lg'
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
                                        name="password"
                                        render={ ({ field }) => (
                                            <div className='flex flex-row items-center mb-6 justify-center'>
                                                <FormItem className='w-3/4'>
                                                <FormLabel>รหัสผ่าน</FormLabel>
                                                    <FormControl>
                                                        <Input  type='password' className='text-sm p-2 w-full border-solid border-2 border-black rounded-lg'
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            </div>
                                        )}
                                    />
                                </div>
                                <Button  className='bg-[#F26522] w-2/4 mx-auto text-white rounded-xl'>
                                    เข้าสู่ระบบ
                                </Button>
                            </form>
                        </Form>

                </div>  
            </div>
        </>
    );
}

export default LoginPage;