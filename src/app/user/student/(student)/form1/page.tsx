"use client"
import learning1 from "@/../../public/asset/learning1.png"
import Form1 from "@/components/form/Form1"
import Image from 'next/image'

const Form1Page = () => {
    return (
        <>
        <div className='w-full h-max bg-transparent py-24 px-2 lg:px-28'>
            <div className="w-full h-full p-4 bg-blue-500 flex justify-center items-center">
                1234567
            </div>
            <div className='h-full w-full flex items-center text-2xl bg-white-500 py-8'>
                <Image
                src={learning1}
                width={100}
                height={100}
                alt="leaning1"
                />
                <span className='ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg'>เอกสารหมายเลข ทบ.20</span>
            </div>
            <div className='h-full w-full flex items-center bg-[#EEEEEE] p-8'>
                <div className="w-full h-full">
                    <div className="p-2 flex justify-center bg-[#A67436] text-white text-lg">
                        กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบความถูกต้องก่อนกดยืนยัน
                    </div>
                    <Form1/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Form1Page;