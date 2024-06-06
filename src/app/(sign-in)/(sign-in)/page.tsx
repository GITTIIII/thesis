"use client"
import Image from 'next/image'
import sutLogo from "@/../../public/asset/sutLogo.jpg"
import SignInForm from '@/components/form/SignInForm';

const LoginPage = () => {
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
                        <SignInForm/>
                </div>  
            </div>
        </>
    );
}

export default LoginPage;