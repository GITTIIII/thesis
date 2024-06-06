import React from 'react';
import Image from 'next/image';
import Booklogo from "@/../../thesis/public/asset/bookthesis.png";

const StudentRequest1 = () => {
  return (
    <div className="relative w-full h-[100vh] bg-[#F5F4F1]">
      {/* วงกลมสีส้มเป็นแบคกราวน์ */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden flex justify-center items-center">
        <div className="absolute rounded-full bg-[#F26522] opacity-40 blur-[50px] shadow-[0_0_100px_#F26522] w-[50vw] h-[50vw] left-[-35vw] top-[2vh]"></div>
        <div className="absolute rounded-full bg-[#F26522] opacity-40 blur-[50px] shadow-[0_0_100px_#F26522] w-[47vw] h-[75vw] left-[100vw] transform rotate-[34deg]"></div>
        <div className="absolute rounded-full bg-[#F26522] opacity-40 blur-[50px] shadow-[0_0_100px_#F26522] w-[50vw] h-[50vw] left-[30vw] top-[60vh]"></div>
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white w-[97vw] h-[92vh] z-20 shadow-md rounded-md">
        <div className="flex items-center p-2">
          <div className="p-2">
            <Image src={Booklogo} alt={'Booklogo'} width={65} height={65} />
          </div>
          <div className="hidden sm:flex bg-[#FFF4EF] w-[225px] h-9 border-2 border-solid border-[#F26522] text-[#F26522] rounded-lg justify-center items-center overflow-hidden">
            เอกสารหมายเลข ทบ.20
          </div>
          <div className='ml-auto mr-2'>
            <button className="bg-white border-2 border-solid border-[#A67436] text-[#A67436]  py-1.5 px-3 rounded ml-auto mr-6">ยกเลิก</button>
            <button className="bg-[#A67436] text-white  py-2 px-3 rounded ml-auto ">ยืนยัน</button>
          </div>
          
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-[#EEE] w-[97vw] h-[80vh] z-20 flex justify-center items-center rounded-md">
          <div className="bg-white w-[98%] h-[94%]">
            <div className="text-[14px] bg-[#A67436] w-full h-[6%] text-white text-center flex justify-center items-center overflow-hidden">
              กรุณากรอกข้อมูลให้ครบถ้วน และตรวจสอบความถูกต้องก่อนกดยืนยัน
            </div>
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-2 gap-4">
        {/* Column 1 */}
                <div className="grid grid-cols-1 gap-4 flex-wrap">
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end mr-2 ">
                      <label htmlFor="input1" className="text-right text-[14px] w-full">อว(MHESI) 7414</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input1" placeholder="number / number" className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5 " />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input2" className="mr-2 text-right text-[14px]">วันที่(DATE)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input2" placeholder="Enter date..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input3" className="mr-2 text-right text-[14px]">ข้าพเจ้า(Name)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input3" placeholder="Enter your name..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input4" className="mr-2 text-right text-[14px]">เลขประจำตัว (Enrollment no.)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input4" placeholder="Enter number..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end mr-2 ">
                      <label htmlFor="input1" className="text-right w-full text-[14px]">อว(MHESI) 7414</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input1" placeholder="number / number" className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5 " />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input2" className="mr-2 text-right text-[14px]">วันที่(DATE)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input2" placeholder="Enter date..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input3" className="mr-2 text-right text-[14px]">ข้าพเจ้า(Name)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input3" placeholder="Enter your name..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input4" className="mr-2 text-right text-[14px]">เลขประจำตัว (Enrollment no.)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input4" placeholder="Enter number..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                </div>


        {/* Column 2 */}
                <div className="grid grid-cols-1 gap-4">
                  <div className='text-center'>
                    ชื่อโครงร่างวิทยานิพนธ์
                  </div>
                <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end mr-2 ">
                      <label htmlFor="input1" className="text-right w-full text-[14px]">ชื่อภาษาไทย(Thai)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input1" placeholder="number / number" className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5 " />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input2" className="mr-2 text-right text-[14px]">ชื่อภาษาอังกฤษ(English)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input2" placeholder="Enter date..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input3" className="mr-2 text-right text-[14px]">อาจารย์ที่ปรึกษา(Thesis Advisor)</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input3" placeholder="Enter your name..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                  <div className="mb-3 flex items-center">
                    <div className="flex-1 flex justify-end">
                      <label htmlFor="input4" className="mr-2 text-right text-[14px]">อาจารย์ที่ปรึกษาร่วม(ถ้ามี)(Co-Thesis Advisor (if any))</label>
                    </div>
                    <div className="flex-3 w-3/4">
                      <input type="text" id="input4" placeholder="Enter number..." className="bg-gray-200 w-full border border-gray-300 rounded-md p-0.5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRequest1;
