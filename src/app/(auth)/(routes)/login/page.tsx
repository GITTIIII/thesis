import Image from 'next/image'
import sutLogo from "../../../../../public/asset/sutLogo.jpg"
import { Input } from "@/components/ui/input"


export default function Page(){
    return(
        <>
            <div className="flex w-full h-full bg-white relative overflow-hidden justify-center items-center blur-md">
                <div className="absolute w-[741px] h-[752px] top-[-113px] left-[-409px] bg-[#F26522] rounded-full inline-block"></div>
                <div className="absolute w-[470px] h-[752px] left-full bg-[#F26522] rounded-full rotate-[-127deg]"></div>
            </div>
            <div className='flex absolute w-full h-full top-0 bg-transparent justify-center items-center'>
                <div className="flex flex-col w-[620px] h-[484px] bg-white rounded-3xl shadow-2xl z-50 justify-center items-center ">
                        <div>
                            <Image
                            src={sutLogo}
                            width={552}
                            height={130}
                            alt="sutLogo"
                            />
                        </div>
                        <div className='w-[552px] h-[0.2px] bg-[#F26522] my-6'/>
                        <label className='text-[#F26522] mb-8'>กรุณาเข้าสู่ระบบ</label>
                        <div className='text-black mb-4 w-2/4'>
                            <div className='flex flex-row items-center mb-6'>
                                <label>ชื่อผู้ใช้</label>
                                <input type="text" className='p-1 ml-auto w-3/4 border-solid border-2 border-black rounded-lg'/>
                            </div>
                            <div className='flex flex-row items-center mb-2'>
                                <label>รหัสผ่าน</label>
                                <input type="text" className='p-1 ml-auto w-3/4 border-solid border-2 border-black rounded-lg'/>
                            </div>
                        </div>
                        <button type='submit' className='bg-[#F26522] p-2 text-white rounded-xl'>
                            <label>เข้าสู่ระบบ</label>
                        </button>
                </div>  
            </div>
        </>
    );
}