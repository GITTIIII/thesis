"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import qs from "query-string";
import { useToast } from "@/components/ui/use-toast";
import InputForm from "../../inputForm/inputForm";
import { IUser } from "@/interface/user";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SignatureDialog from "@/components/signatureDialog/signatureDialog";
import { DatePicker } from "@/components/datePicker/datePicker";
import { IOutlineForm, IThesisExamAssessmentForm } from "@/interface/form";
import { ConfirmDialog } from "@/components/confirmDialog/confirmDialog";
import { IExpert } from "@/interface/expert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, Trash, Trash2, Trash2Icon, X } from "lucide-react";

const ThesisExamAssessmentFormRead = ({
	user,
	formData,
	approvedForm,
	expert,
	instituteCommittee,
	adminNotNone,
}: {
	user: IUser;
	formData: IThesisExamAssessmentForm;
	approvedForm: IOutlineForm;
	expert: IExpert[];
	instituteCommittee: IUser[];
	adminNotNone: IUser[];
}) => {
	const router = useRouter();

	return (
		<div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
			<div className="w-full flex px-0 xl:px-20 mb-2">
				<Button
					variant="outline"
					type="reset"
					onClick={() => router.back()}
					className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
				>
					ย้อนกลับ
				</Button>
			</div>
			<div className="flex flex-col justify-center md:flex-row mb-4">
				{/* ฝั่งซ้าย */}
				<div className="w-full">
					<h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
					<InputForm value={`${formData.student.firstNameTH} ${formData.student.lastNameTH}`} label="ชื่อ-นามสกุล / Full name" />
					<InputForm value={`${formData.student.username} `} label="รหัสนักศึกษา / StudentID" />
					<InputForm value={`${formData.student.email} `} label="อีเมล์ / Email" />
					<InputForm value={`${formData.student.phone} `} label="เบอร์โทรศัพท์ / Telephone" />
					<InputForm value={`${formData.student.school?.schoolNameTH}`} label="สาขาวิชา / School" />
					<InputForm value={`${formData.student.institute?.instituteNameTH}`} label="สำนักวิชา / Institute" />
				</div>
				<div className="border-l border-[#eeee]"></div>

				{/* ฝั่งขวา */}
				<div className="w-full ">
					<div className="w-full sm:w-3/4 mx-auto flex flex-col item-center justify-center rounded-lg mb-2">
						<div className="text-center font-semibold mb-2">โครงร่างวิทยานิพนธ์</div>
						<InputForm value={`${approvedForm?.thesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
						<InputForm value={`${approvedForm?.thesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />

						<div className="m-auto w-full sm:w-[300px] mb-6">
							<RadioGroup disabled className="mt-2 flex flex-col justify-center ">
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={formData.disClosed} value="1" />
									<Label className="font-normal">
										วิทยานิพนธ์เผยแพร่ได้ / <br />
										This Thesis can be disclosed.
									</Label>
								</div>
								<div className="flex items-center space-x-3 space-y-0">
									<RadioGroupItem checked={!formData.disClosed} value="2" />
									<Label className="ml-2 font-normal">
										วิทยานิพนธ์ปกปิด (โปรดกรอก ทบ.24) / <br />
										This Thesis is subject to nondisclosure (Please attach form No.24).
									</Label>
								</div>
							</RadioGroup>
						</div>
						<InputForm value={`${formData.examDate.toLocaleDateString("th")}`} label="วันที่นัดสอบ / Date of the examination" />
					</div>
				</div>
			</div>

			<div className="w-full xl:w-1/2 h-full mx-auto bg-white p-4 flex flex-col items-center gap-4">
				<h1 className="text-center font-semibold">ผลการพิจารณาการสอบวิทยานิพนธ์ / Results of Thesis Examination</h1>

				<div className="w-full sm:w-[300px] flex justify-center">
					<RadioGroup disabled className="mt-2 flex flex-col justify-center ">
						<div className="flex items-center space-x-3 space-y-0">
							<RadioGroupItem checked={formData?.result == "ดีมาก"} value="ดีมาก" />
							<Label className="ml-2 font-normal">ดีมาก / Excellent</Label>
						</div>
						<div className="flex items-center space-x-3 space-y-0">
							<RadioGroupItem checked={formData?.result == "ผ่าน"} value="ผ่าน" />
							<Label className="ml-2 font-normal">ผ่าน / Pass</Label>
						</div>
						<div className="flex items-center space-x-3 space-y-0">
							<RadioGroupItem checked={formData?.result == "ไม่ผ่าน"} value="ไม่ผ่าน" />
							<Label className="ml-2 font-normal">ไม่ผ่าน / Fail</Label>
						</div>
					</RadioGroup>
				</div>

				{formData?.result != "ผ่าน" && (
					<>
						<h1 className="text-center font-semibold">
							ความเห็นของคณะกรรมการสอบวิทยานิพนธ์ ในกรณีที่ผลการพิจารณาดีมากหรือไม่ผ่าน / <br />
							Comments of thesis examining committee, in case of excellent or fail results{" "}
						</h1>

						{formData.result == "ดีมาก" && (
							<>
								<InputForm value={`${formData.presentationComment} `} label="การนำเสนอ / Presentation" />
								<InputForm value={`${formData.explanationComment} `} label="การอธิบาย / Explanation" />
								<InputForm value={`${formData.answerQuestionComment} `} label="การตอบคำถาม / Answer question" />
							</>
						)}

						{formData.result == "ไม่ผ่าน" && <InputForm value={`${formData.failComment}`} label="" />}
					</>
				)}
				<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />

				<div className="flex flex-row items-center space-x-3 space-y-0 my-2">
					<Checkbox disabled={true} checked={formData.reviseTitle} />
					<Label>ปรับเปลี่ยนชื่อวิทยานิพนธ์ / Revise thesis title</Label>
				</div>

				{formData.reviseTitle != undefined && (
					<>
						<InputForm value={`${formData.newThesisNameTH}`} label="ชื่อภาษาไทย / Thesis name (TH)" />
						<InputForm value={`${formData.newThesisNameEN}`} label="ชื่อภาษาอังกฤษ / Thesis name (EN)" />
					</>
				)}
				<div className="w-full mx-auto px-4 m-0 text-xs text-justify">
					<span className="font-bold">หมายเหตุ:</span>&nbsp;กรณีนักศึกษามีส่วนที่ต้องปรับปรุงต้องดำเนินการให้แล้วเสร็จ
					<span className="font-bold underline">ภายในระยะเวลา 30 วัน</span>
					และไม่เกินวันสุดท้ายของภาคการศึกษาที่ขอสอบวิทยานิพนธ์ หากดำเนินการไม่ทันภาคการศึกษาดังกล่าว
					นักศึกษาต้องลงทะเบียนรักษาสภาพในภาคการศึกษาถัดไปและกำหนดให้วันที่นักศึกษาส่งเล่มวิทยานิพนธ์เป็นวันที่สำเร็จการศึกษา
				</div>
				<div className="w-full mx-auto px-4 m-0 text-xs text-justify">
					<span className="font-bold">Remask:</span>&nbsp;In the event thesis amendments are required, the student&nbsp;
					<span className="font-bold underline">must complete all amendments within 30 days</span>&nbsp; and no later than the
					last day of the term in which the thesis examination took place. Failure to do so will result in the student maintaining
					student status in the following term. The thesis submission date shall be deemed the students graduation date.
				</div>
				<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />

				<div className="h-max flex flex-col justify-center  items-center lg:px-20">
					<SignatureDialog disable={true} signUrl={formData?.headOfCommitteeSignUrl} />

					{formData?.headOfCommittee && (
						<Label className="mb-2">
							{`${formData?.headOfCommittee?.prefix}${formData?.headOfCommittee?.firstName} ${formData?.headOfCommittee?.lastName}`}
						</Label>
					)}

					<Label className="my-2">{`(ประธานคณะกรรมการ)`}</Label>
				</div>
				<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
				<div className="h-max flex flex-col justify-center  items-center lg:px-20">
					<SignatureDialog disable={true} signUrl={formData?.advisorSignUrl} />
					<Label className="mb-2">{`${formData?.student?.advisor?.prefix?.prefixTH}${formData?.student?.advisor?.firstNameTH} ${formData?.student?.advisor?.lastNameTH}`}</Label>
					<Label className="my-2">{`(อาจารย์ที่ปรึกษาวิทยานิพนธ์)`}</Label>
				</div>
				<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
				{Array.isArray(formData?.student?.coAdvisedStudents) &&
					formData.student.coAdvisedStudents.map((coAdvisorStudent, index) => (
						<div key={index} className="h-max flex flex-col justify-center items-center lg:px-20">
							{coAdvisorStudent?.coAdvisor && (
								<div className="flex flex-col items-center space-y-2">
									<SignatureDialog
										disable={true}
										signUrl={formData?.coAdvisors ? formData?.coAdvisors[index]?.coAdvisor?.signatureUrl : ""}
									/>
									<Label className="mb-2">
										{`${coAdvisorStudent?.coAdvisor?.prefix?.prefixTH || ""} ${
											coAdvisorStudent?.coAdvisor?.firstNameTH || ""
										} ${coAdvisorStudent?.coAdvisor?.lastNameTH || ""}`}
									</Label>
									<Label className="my-2">(อาจารย์ที่ปรึกษาวิทยานิพนธ์ร่วม)</Label>
								</div>
							)}
						</div>
					))}
				<hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />
				{formData.committees?.map((committeeField, index) => (
					<div key={committeeField.id} className="h-max flex flex-col justify-center items-center lg:px-20">
						<SignatureDialog
							disable={true}
							signUrl={formData?.committees ? formData?.committees[index]?.committee?.signatureUrl : ""}
						/>
						{formData?.committees?.[index] && (
							<Label className="mb-2">
								{(() => {
									const expertFound = expert.find(
										(exp: IExpert) => exp.id === formData?.committees?.[index]?.committee.committeeID
									);

									return expertFound
										? `${expertFound.prefix || ""} ${expertFound.firstName || ""} ${expertFound.lastName || ""}`
										: "";
								})()}
							</Label>
						)}
						<Label className="mt-2">(คณะกรรมการ)</Label>
					</div>
				))}

				{formData.committees && <hr className="่่mx-auto w-full border-t-2 border-[#eeee]" />}
			</div>
			<div className="w-full xl:w-1/2 h-full mx-auto bg-white p-4 flex flex-col items-center gap-4">
				<h1 className="text-center font-semibold">
					ผลการพิจารณาของคณะกรรมการประจำสำนักวิชา <br />
					Institute Committee Decision
				</h1>
				<div className="w-max h-max flex flex-col sm:flex-row mt-2 items-center">
					<Label className="mr-2">ครั้งที่ / Meeting no.</Label>
					<Label>{formData?.times ? formData?.times : "__________"}</Label>

					<Label className="mx-2">วันที่ / Date</Label>

					<Label>
						{formData?.dateInstituteCommitteeSign
							? new Date(formData.dateInstituteCommitteeSign).toLocaleDateString("th")
							: "__________"}
					</Label>
				</div>

				<div className="m-auto w-full sm:w-[300px] mb-6">
					<RadioGroup disabled className="mt-2 flex flex-col justify-center ">
						<div className="flex items-center space-x-3 space-y-0">
							<RadioGroupItem checked={formData.instituteCommitteeStatus == "เห็นชอบ"} value="เห็นชอบ" />
							<Label className="font-normal">เห็นชอบ / Approve</Label>
						</div>
						<div className="flex items-center space-x-3 space-y-0">
							<RadioGroupItem checked={formData.instituteCommitteeStatus == "ไม่เห็นชอบ"} value="ไม่เห็นชอบ" />
							<Label className="ml-2 font-normal">ไม่เห็นชอบ / Disapprove</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="w-60">
					<Textarea
						disabled
						placeholder="ความเห็น..."
						className="resize-none h-full text-md mb-2"
						defaultValue={formData?.instituteCommitteeComment}
					/>
				</div>

				<SignatureDialog disable={true} signUrl={formData?.instituteCommitteeSignUrl} />

				{formData?.instituteCommitteeID && (
					<Label className="mb-2">
						{formData?.instituteCommitteeID
							? `${formData?.instituteCommittee?.prefix?.prefixTH}${formData?.instituteCommittee?.firstNameTH} ${formData?.instituteCommittee?.lastNameTH}`
							: ""}
					</Label>
				)}

				<Label className="my-2">{`(คณบดี)`}</Label>
			</div>
		</div>
	);
};

export default ThesisExamAssessmentFormRead;
