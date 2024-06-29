"use client"
import learning1 from "@/../../public/asset/learning1.png"
import Form2 from "@/components/form/Form2"
import Image from 'next/image'

const Form2Page = () => {
    return (
        <>
        <div className='w-full h-max bg-transparent py-24 px-2 lg:px-28'>
            <div className="w-full h-full p-4 bg-blue-500 flex justify-center items-center">
                1234567
            </div>
            <div className='h-full w-full flex items-center text-2xl bg-white '>
                <div className="ml-7 py-3">
                    <Image
                    src={learning1}
                    width={80}
                    height={80}
                    alt="leaning1"
                />
                </div>               
                <span className='ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg'>แบบขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์</span>
            </div>
            <div className='h-full w-full flex items-center bg-[#EEEEEE] p-8'>
                <div className="w-full h-full">
                    <div className="p-2 flex justify-center bg-[#A67436] text-white text-lg">
                        กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบความถูกต้องก่อนกดยืนยัน
                    </div>
                    <Form2/>
                </div>
            </div>
        </div>
        </>
    )
}

export default Form2Page;