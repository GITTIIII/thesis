"use client";
import { Button } from "@/components/ui/button";
import Img from "../../../../../public/asset/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
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
export default function StudentPage() {
  useEffect(() => {
    AOS.init({ once: false, duration: 450, easing: "ease-in-out", mirror: true });
    setInterval(() => {
      AOS.refresh();
    });
  }, []);
  return (
    <>
      <div className="z-10">
        <div>
          <div className="flex w-full  min-h-screen  md:h-[600px] justify-center items-center   ">
            <div className="h-fit  space-y-6 content-center mx-16">
              <h3 className="text-3xl md:text-6xl font-semibold" data-aos="fade-up">
                THESIS
              </h3>
              <p
                className="min-w-[500px]  md:w-96 h-28 text-lg md:text-xl text-ellipsis "
                data-aos="fade-up"
                data-aos-duration="550"
              >
                เว็บไซต์นี้ช่วยให้นักศึกษาจัดการขั้นตอนการส่งวิทยานิพนธ์
                ตั้งแต่การยื่นโครงร่าง, ขอสอบ, ไปจนถึงการส่งฉบับสมบูรณ์
                และอัปโหลดเข้าฐานข้อมูลของมหาวิทยาลัย
              </p>
              <Link href="/user/table" className="text-[#F26522] hover:underline">
                <p data-aos-duration="650">เริ่มการส่งวิทยานิพนธ์</p>
              </Link>
            </div>
            <Image
              data-aos="zoom-in"
              className="w-80 hidden md:block xl:w-[430px] h-fit"
              src={Img["book"]}
              alt=""
            />
          </div>
          <div className="gap-3  min-h-screen flex flex-col items-center lg:mt-12  justify-center">
            <h3 className="w-fit text-3xl md:text-4xl font-semibold" data-aos="fade-up">
              ลำดับการส่งวิทยานิพนธ์
            </h3>
            <div className="flex px-6 lg:gap-11">
              <div data-aos="zoom-in">
                <Image
                  className="hidden xl:block w-[450px] h-[450px]"
                  src={Img["checkList"]}
                  alt=""
                />
              </div>
              <div className="flex-col max-w-[800px]">
                {procedure.map((e, key) => (
                  <div
                    key={key}
                    className="flex my-2 gap-6 items-center mx-3"
                    data-aos="fade-up-left"
                  >
                    <div>
                      <p className=" w-10 h-10 rounded-full bg-[#ebd9c3] text-center content-center text-2xl font-semibold">
                        {key + 1}
                      </p>
                    </div>
                    <p className="w-full text-lg md:text-base content-center">{e}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full  min-h-screen md:h-[400px] justify-center items-center gap-18">
          <div className="h-full flex-col content-center mx-16">
            <h3
              data-aos="fade-up"
              className="w-fit text-2xl md:text-4xl my-6 font-semibold"
            >
              ชะลอการเผยแพร่วิทยานิพนธ์
            </h3>
            <p
              className="lg:w-[700px] text-lg md:text-xl text-ellipsis  my-4"
              data-aos="fade-up-right"
            >
              ความประสงค์ขอชะลอการเผยแพร่วิทยานิพนธ์ในฐานข้อมูลคลัง
              ปัญญามหาวิทยาลัยเทคโนโลยีสุรนารี
              เพราะจะนำข้อมูลในวิทยานิพนธ์ไปทำการตีพิมพ์ในวารสารต่อไป
            </p>
            <div data-aos="fade-up-right">ชะลอการเผยแพร่วิทยานิพนธ์</div>
          </div>

          <Image
            data-aos="zoom-in"
            className="hidden xl:block w-[450px] h-[450px]"
            src={Img["calendar"]}
            alt=""
          />
        </div>
      </div>
    </>
  );
}
