import { Button } from "@/components/ui/button";
import Img from "../../../../../public/asset/images";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
export default function StudentPage() {
	return (
		<div className=" relativ overflow-clip ">
			<div className="z-10">
				<div>
					<div className="flex w-full h-72 md:h-[600px] justify-center items-center">
						<div className="h-full gap-8 flex-col content-center mx-16">
							<h3 className="text-3xl md:text-6xl font-semibold animate-jump-in animate-delay-300 animate-once">
								THESIS
							</h3>
							<p className="min-w-[300px] md:w-96 h-28 text-lg md:text-xl text-ellipsis">
								x xxxx xxxxxxx xx xxxx xxxxxxxxxxxx xxxx xx xxxx xxxxx xxxx
								xxxxxxxxxxxxxx xx xxxx xxxx
							</p>
							<Link href="/user/table" className="text-[#F26522] hover:underline">เริ่มการส่งวิทยานิพนธ์</Link>
						</div>
						<Image
							className="w-80 hidden md:block xl:w-[430px]"
							src={Img["book"]}
							alt=""
						/>
					</div>
					<div className="gap-3 flex flex-col items-center lg:mt-12">
						<h3 className="w-fit text-2xl md:text-4xl font-semibold">
							ลำดับการส่งวิทยานิพนธ์
						</h3>
						<div className="flex px-6 lg:gap-11">
							<div>
								<Image
									className="hidden xl:block w-[450px] h-[450px]"
									src={Img["checkList"]}
									alt=""
								/>
							</div>
							<div className="flex-col max-w-[800px]">
								{procedure.map((e, key) => (
									<div key={key} className="flex my-2 gap-6 items-center mx-3">
										<div>
											<p className=" w-14 h-14 rounded-full bg-[#ebd9c3] text-center content-center text-3xl font-semibold">
												{key + 1}
											</p>
										</div>
										<p className="w-full text-lg md:text-xl content-center">
											{e}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
				<div className="flex w-full md:h-[400px] justify-center items-center gap-18">
					<div className="h-full flex-col content-center mx-16">
						<h3 className="w-fit text-2xl md:text-4xl my-6 font-semibold">
							ชะลอการเผยแพร่วิทยานิพนธ์
						</h3>
						<p className="lg:w-[700px] text-lg md:text-xl text-ellipsis  my-4">
							ความประสงค์ขอชะลอการเผยแพร่วิทยานิพนธ์ในฐานข้อมูลคลัง
							ปัญญามหาวิทยาลัยเทคโนโลยีสุรนารี
							เพราะจะนำข้อมูลในวิทยานิพนธ์ไปทำการตีพิมพ์ในวารสารต่อไป
						</p>
						<div>ชะลอการเผยแพร่วิทยานิพนธ์</div>
					</div>

					<Image
						className="hidden xl:block w-[450px] h-[450px]"
						src={Img["calendar"]}
						alt=""
					/>
				</div>
			</div>
		</div>
	);
}
