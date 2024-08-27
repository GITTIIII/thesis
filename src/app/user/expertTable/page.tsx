"use client"
import learning1 from "@/../../public/asset/learning1.png";
import Image from "next/image";
import ExpertTable from "@/components/expertTable/expertTable"

const ExpertTablePage = () => {
	return (
		<>
			<div className="w-full h-max bg-transparent py-12 px-2 lg:px-28">
				<div className="h-full w-full flex items-center text-2xl">
          <div className="w-full bg-white m-0 p-5 rounded-md flex flex-row items-center">
					<Image src={learning1} width={100} height={100} alt="leaning1" />
          <div>
            <span className="ml-5 bg-[#FFF4EF] px-4 text-[#F26522] border-2 border-[#F26522] rounded-lg text-lg">
						  ตารางรายชื่อกรรมการผู้ได้รับการรับรองแล้ว
					  </span>
          </div>				
          </div>
				</div>
				<div className="h-full w-full flex items-center bg-[#fff] p-2 md:p-8 ">
					<div className="w-full h-full">
						<ExpertTable/>
					</div>
				</div>
			</div>
		</>
	);
};

export default ExpertTablePage;
