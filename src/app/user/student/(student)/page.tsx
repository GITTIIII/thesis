// "use client";
import checkList from "@/../../public/asset/checkList.png";
import calendar from "@/../../public/asset/calendar.png";
import Image from "next/image";
import "./styles.css";
import Link from "next/link";
const procedure = [
  "จัดทำโครงร่างวิทยานิพนธ์ตามรูปแบบที่มหาวิทยาลัยกำหนดตามเอกสารหมายเลข 1",
  "เสนอโครงร่างวิทยานิพนธ์ให้เป็นไปตามขั้นตอนที่มหาวิทยาลัยกำหนดตามเอกสารหมายเลข 2 และให้เป็นไปตามแบบ ทบ.20เอกสารหมายเลข 3",
  "รายงานความคืบหน้าวิทยานิพนธ์ โดยใช้แบบ ทบ.21 เอกสารหมายเลข 4",
  "รายงานความคืบหน้าวิทยานิพนธ์ โดยใช้แบบ ทบ.21 เอกสารหมายเลข 4",
  "ยื่นคำร้องขอสอบวิทยานิพนธ์ พร้อม (ร่าง) วิทยานิพนธ์ ตามแบบ ทบ.22-1 เอกสารหมายเลข 5",
  "ยื่นคำขออนุมัติแต่งตั้ง คณะกรรมการสอบวิทยานิพนธ์ ตามแบบ ทบ. 22-2 เอกสารหมายเลข 6",
  "รายงานผลการพิจารณา การสอบวิทยานิพนธ์ ตามแบบ ทบ. 23 เอกสารหมายเลข 7",
  "นำส่งวิทยานิพนธ์ฉบับสมบูรณ์ ให้แก่ศูนย์บริการการศึกษา พร้อมอัปโหลดไฟล์วิทยานิพนธ์ เข้าฐานข้อมูลคลังปัญญา มหาวิทยาลัยเทคโนโลยีสุรนารี (SUTIR)",
];
export default async function StudentPage() {
  return (
    <div className="bg-mineshaft-50 flex flex-col items-center w-full">
      <div className="h-full flex justify-center overflow-hidden w-full">
        <div className="relative z-10 h-full w-full flex flex-col bg-white justify-center overflow-hidden max-w-[100rem] animate-fadeIn">
          <div className="relative gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 grid grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping2500 bg-mineshaft-50 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2000 bg-mineshaft-100/50 hover:bg-primary-200 hidden xl:block border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 block z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="border-t  hidden sm:block animate-ping3500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="relative gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 grid grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping500 bg-mineshaft-50 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1000 bg-mineshaft-50 opacity-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping2000 bg-mineshaft-50 opacity-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping2500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="border-t  hidden xl:block animate-ping2000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="grid gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping1000 bg-mineshaft-100/40 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping2000 bg-mineshaft-100/50 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1500 bg-mineshaft-100/50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="border-t  hidden xl:block animate-ping1500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="grid gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping3500 bg-mineshaft-50 hover:bg-primary-200 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1500 bg-mineshaft-200/20 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="border-t  hidden xl:block animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="grid gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping1500 bg-mineshaft-50 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping2500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-100 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2500 bg-mineshaft-100 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping3500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="border-t  hidden xl:block animate-ping1500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="grid gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping2500 bg-mineshaft-50 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1500 bg-mineshaft-100/30 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2500 bg-mineshaft-100/60 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping3500 bg-mineshaft-200/40 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping3500 bg-mineshaft-200/40 hover:bg-primary-200 border-t border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2500 bg-mineshaft-100/60 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping2500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="border-t hidden xl:block animate-ping3500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="grid gap-0.5 sm:gap-1 mb-0.5 sm:mb-1 grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping1500 bg-mineshaft-50 hover:bg-primary-100 pl-6 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2000 bg-mineshaft-100/50 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2500 bg-mineshaft-200/40 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2000 bg-mineshaft-300/30 hover:bg-primary-300 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-200/50 hover:bg-primary-300 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1500 bg-mineshaft-200/40 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2000 bg-mineshaft-100/50 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1000 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="border-t  hidden xl:block animate-ping2500 bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="grid gap-0.5 sm:gap-1 grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full">
            <div className="aspect-w-1 aspect-h-1 hidden xl:block z-30 animate-ping2500 bg-mineshaft-100/50 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping3500 bg-mineshaft-100/50 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-200/20 hover:bg-primary-200 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-200/30 hover:bg-primary-300 hover:bg-primary-400 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1500 bg-mineshaft-300/30 hover:bg-primary-400 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 bg-white"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping2500 bg-mineshaft-300/30 hover:bg-primary-400 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping1000 bg-mineshaft-200/30 hover:bg-primary-300 hover:bg-primary-50 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 z-30 animate-ping3500 bg-mineshaft-200/20 hover:bg-primary-200 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="aspect-w-1 aspect-h-1 hidden sm:block z-30 animate-ping1500 bg-mineshaft-100/50 hover:bg-primary-200 hover:bg-primary-100 border border-mineshaft-200"></div>
            <div className="animate-ping2500 hidden xl:block bg-mineshaft-50 hover:bg-primary-100 border border-mineshaft-200"></div>
          </div>
          <div className="absolute flex w-full h-full flex-col justify-start items-center pt-16 sm:pt-16 md:pt-20 lg:pt-28 xl:pt-40 2xl:pt-10 min-w-3xl animate-fadeIn">
            <div className="flex-1 flex items-center px-2 z-30 my-3 md:my-8">
              <div className="mx-2 md:mx-6 max-w-screen min-w-fit mb-4 flex flex-col items-center pb-80 lg:pb-64 xl:pb-40">
                <div>
                  <h1 className="flex flex-col md:flex-row text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight justify-center text-center md:h-max">
                    <span className="text-black mr-2 leading-10 md:leading-[3.0rem] lg:leading-[4.6rem] xl:leading-[5.4rem] pb-4">
                      ENGi Postgrad
                      <br />
                      <div className="relative  text-xl md:text-4xl lg:text-5xl xl:text-5xl text-center inline sm:px-1.5 sm:mx-1.5">
                        <div className="relative z-10 inline text-black">
                          Management Information System
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-primary mb-0.5 md:mb-2.5 h-1/3 md:h-1/3"></div>
                      </div>
                    </span>
                  </h1>
                </div>

                <div className="hidden md:block">
                  <p className="text-center max-w-xs md:max-w-lg lg:max-w-2xl font-light text-sm md:text-md lg:text-xl lg:mt-4 mb-2 lg:mb-6 py-1 text-mineshaft-700">
                    <span className="mt-8 text-balance">
                      เว็บไซต์นี้ช่วยให้นักศึกษาจัดการขั้นตอนการส่งวิทยานิพนธ์
                      ตั้งแต่การยื่นโครงร่าง, ขอสอบ, ไปจนถึงการส่งฉบับสมบูรณ์
                      และอัปโหลดเข้าฐานข้อมูลของมหาวิทยาลัย
                    </span>
                  </p>
                </div>

                <div className="flex md:ml-0 flex-row justify-center w-full md:mb-0 space-x-2 sm:space-x-4 mt-4">
                  <Link
                    href="/user/table"
                    className="relative inline-block text-sm md:text-lg group"
                  >
                    <span className="relative z-10 block px-3 md:px-5 py-2 md:py-3 overflow-hidden leading-tight text-gray-800 transition-colors duration-300 ease-out border border-gray-900 group-hover:border-primary group-hover:text-white">
                      <span className="absolute inset-0 w-full h-full px-3 md:px-5 py-2 md:py-3 bg-black"></span>
                      <span className="absolute left-0 w-80 h-80 -ml-1 transition-all duration-300 origin-top-right -rotate-90 -translate-x-full translate-y-12 bg-primary group-hover:-rotate-180 ease"></span>
                      <span className="relative text-white group-hover:text-black">
                        ดำเนินการตามขั้นตอนบัณฑิตศึกษา
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-black/90 max-w-[100rem] flex flex-col w-full">
        <div className=" relative border-b border-x flex flex-col items-start bg-white">
          <span className="text-center w-full text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-none pt-14 md:pt-28">
            ข้อความสักอย่าง
          </span>
          <span className="text-center w-full text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-10 mt-2 block pb-14 md:pb-28 px-6">
            ข้อความสักอย่าง
            <span className="block sm:hidden h-0">
              <br />
            </span>
            <div className="relative text-center inline px-1.5 mr-1.5">
              <div className="relative z-10 inline text-black">ข้อความสักอย่าง</div>
              <div className="absolute bottom-0 left-0 w-full bg-primary mb-1 md:mb-2 h-1/3"></div>
            </div>
            ข้อความสักอย่าง
          </span>
        </div>
        <CustomGrid rows={2} />

        <div className=" border-x border-mineshaft-100">
          <div className="flex w-full bg-white px-6 sm:px-16 pt-8 flex-col gap-y-6 sm:gap-y-8">
            <div className="relative flex  w-full pb-4 lg:pb-32 pt-4 sm:pt-8 lg:pt-28 bg-white px-6 sm:px-16">
              <div className="w-[40%]  justify-center items-center xl:flex hidden">
                <Image src={checkList} className=" w-3/4 aspect-square" alt="leaning1" />
              </div>
              <div className="xl:w-[60%]">
                <div>
                  <h1 className="flex flex-col md:flex-row  text-2xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold tracking-tight justify-center text-center md:h-max">
                    <span className="text-black mr-2 leading-10 md:leading-[3.0rem] lg:leading-[4.6rem] xl:leading-[5.4rem] pb-4">
                      ลำดับการส่ง
                      <div className="relative  text-center inline sm:px-1.5 sm:mx-1.5">
                        <div className="relative z-10 inline text-black">วิทยานิพนธ์</div>
                        <div className="absolute bottom-0 left-0 w-full bg-primary mb-0.5 md:mb-2.5 h-1/3 md:h-1/3"></div>
                      </div>
                    </span>
                  </h1>
                </div>
                <div>
                  <ul className=" space-y-7">
                    {procedure.map((text, index) => (
                      <li className="pb-3 sm:pb-4" key={index}>
                        <div className="flex items-center space-x-4 rtl:space-x-reverse">
                          <div className=" ">
                            <p className=" flex justify-center items-center xl:text-4xl lg:text-3xl md:text-2xl text-xl w-12 aspect-square font-medium text-gray-900 truncate dark:text-white">
                              {index + 1}
                            </p>
                          </div>
                          <div className="inline-flex items-center xl:text-xl lg:text-lg md:text-md text-sm  text-gray-900 dark:text-white">
                            {text}
                          </div>
                        </div>
                        <div className="border-t rounded-lg border-mineshaft-200" />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <CustomGrid rows={2} />
          <div className="flex w-full bg-white px-6 sm:px-16 pt-8 flex-col gap-y-6 sm:gap-y-8">
            <div className="relative flex  w-full pb-4 lg:pb-32 pt-4 sm:pt-8 lg:pt-28 bg-white px-6 sm:px-16">
              <div className="xl:w-[60%]   self-center  ">
                <div>
                  <h1 className="flex flex-col md:flex-row  text-2xl md:text-4xl lg:text-5xl xl:text-5xl font-semibold tracking-tight justify-center text-center md:h-max">
                    <span className="text-black mr-2 leading-10 md:leading-[3.0rem] lg:leading-[4.6rem] xl:leading-[5.4rem] pb-4">
                      <div className="relative  text-center inline sm:px-1.5 sm:mx-1.5">
                        <div className="relative z-10 inline text-black">
                          ชะลอการเผยแพร่
                        </div>
                        <div className="absolute bottom-0 left-0 w-full bg-primary mb-0.5 md:mb-2.5 h-1/3 md:h-1/3"></div>
                      </div>
                      วิทยานิพนธ์
                    </span>
                  </h1>
                </div>
                <div className=" text-center   xl:text-2xl lg:text-xl md:text-lg text-md  text-gray-900 dark:text-white">
                  ความประสงค์ขอชะลอการเผยแพร่วิทยานิพนธ์ในฐานข้อมูลคลัง
                  ปัญญามหาวิทยาลัยเทคโนโลยีสุรนารี
                  เพราะจะนำข้อมูลในวิทยานิพนธ์ไปทำการตีพิมพ์ในวารสารต่อไป
                </div>
              </div>
              <div className="w-[40%]  justify-center items-center xl:flex hidden">
                <Image src={calendar} className=" w-3/4 aspect-square" alt="calendar" />
              </div>
            </div>
          </div>
          <CustomGrid rows={2} />
        </div>
      </div>
    </div>
  );
}

const CustomGrid = ({ rows = 2 }) => {
  return (
    <div>
      {[...Array(rows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="w-full grid grid-cols-[repeat(9,_minmax(0,1fr))] sm:grid-cols-[repeat(11,_minmax(0,1fr))] xl:grid-cols-[repeat(13,_minmax(0,1fr))] w-full border-t border-mineshaft-100 bg-mineshaft-50"
        >
          <div className="aspect-w-1 aspect-h-1 pl-6 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 hidden sm:block border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 hidden sm:block border-r border-mineshaft-100"></div>
          <div className="aspect-w-1 aspect-h-1 hidden xl:block border-r border-mineshaft-100"></div>
        </div>
      ))}
    </div>
  );
};
