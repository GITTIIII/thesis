"use client"
import Image from 'next/image'
import sutLogo from "@/../../public/asset/sutLogo.jpg"
import SignInForm from '@/components/form/SignInForm';

const LoginPage = () => {
    return(
        <>
            <div className='flex w-full h-full bg-transparent justify-center items-center'>
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