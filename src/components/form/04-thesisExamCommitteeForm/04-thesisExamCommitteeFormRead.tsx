import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import InputForm from "../../inputForm/inputForm";
import { CircleAlert } from "lucide-react";
import Link from "next/link";
import { IExamCommitteeForm } from "@/interface/form";
import useSWR from "swr";
import Image from "next/image";
import signature from "../../../../public/asset/signature.png";
import { Label } from "@/components/ui/label";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ThesisOutlineCommitteeFormRead = ({ formId }: { formId: number }) => {
    const router = useRouter();
    const { data: formData, error } = useSWR<IExamCommitteeForm>(`/api/get04FormById/${formId}`, fetcher);

    if (error) {
        return <div>Error loading data</div>;
    }

    if (!formData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="w-full h-full bg-white p-4 lg:p-12 rounded-lg">
            <div className="w-full flex px-0 lg:px-20 mb-2">
                <Button
                    variant="outline"
                    type="reset"
                    onClick={() => router.push("/user/table?formType=thesisOutlineCommitteeForm")}
                    className="bg-[#FFFFFF] w-auto text-lg text-[#A67436] rounded-xl border-[#A67436]"
                >
                    ย้อนกลับ
                </Button>
            </div>
            <div className="flex flex-col justify-center md:flex-row">
                <div className="w-full sm:2/4">
                    <h1 className="text-center font-semibold mb-2">รายละเอียดการสอบ</h1>
                    <InputForm value={`${formData?.times}`} label="สอบครั้งที่ / Exam. No." />
                    <InputForm value={`${formData?.trimester}`} label="ภาคเรียน / Trimester" />
                    <InputForm value={`${formData?.academicYear}`} label="ปีการศึกษา / Academic year" />
                    <InputForm value={`${formData?.examDate ? new Date(formData?.examDate).toLocaleDateString("th") : ""}`} label="วันที่สอบ / Date of the examination" />

                    <h1 className="text-center font-semibold mb-2">ข้อมูลนักศึกษา</h1>
                    <InputForm value={`${formData?.student.username}`} label="รหัสนักศึกษา / Student ID" />
                    <InputForm value={`${formData?.student.firstNameTH} ${formData?.student.lastNameTH}`} label="ชื่อ-นามสกุล / Fullname" />
                    <InputForm value={`${formData?.student?.school.schoolNameTH}`} label="สาขาวิชา / School" />
                    <InputForm value={`${formData?.student?.program.programNameTH}`} label="หลักสูตร / Program" />
                    <InputForm value={`${formData?.student.program.programYear}`} label="ปีหลักสูตร (พ.ศ.) / Program Year (B.E.)" />
                </div>

                <div className="w-full sm:2/4">
                    <h1 className="text-center font-semibold mb-2">ขอเสนอเเต่งตั้งคณะกรรมการสอบประมวลความรู้</h1>
                    <div className="flex items-center justify-center text-sm">
                        <CircleAlert className="mr-1" />
                        สามารถดูรายชื่อกรรมการที่ได้รับการรับรองเเล้ว
                        <Button variant="link" className="p-1 text-[#A67436]">
                            <Link href="/user/expertTable">คลิกที่นี่</Link>
                        </Button>
                    </div>
                    {
                        formData?.committeeMembers.map((member, index: number) => (
                            <InputForm key={index} value={`${member.name}`} label="กรรมการ / Committee" />
                        ))
                    }
                    <div className="h-max flex flex-col justify-center mt-4 sm:mt-0 items-center p-4 lg:px-20">
                        <h1 className="font-bold">ลายเซ็นหัวหน้าสาขาวิชา</h1>
                        <div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                            <Image
                                src={formData?.headSchoolSignUrl ? formData?.headSchoolSignUrl : signature}
                                width={100}
                                height={100}
                                style={{
                                    width: "auto",
                                    height: "auto",
                                }}
                                alt="signature"
                            />
                        </div>
                        <Label className="mb-2">
                            {formData?.headSchool
                                ? `${formData?.headSchool.prefix?.prefixTH}${formData?.headSchool.firstNameTH} ${formData?.headSchool.lastNameTH}`
                                : ""}
                        </Label>
                        <Label className="mb-5">{`หัวหน้าสาขาวิชา ${
                            formData?.headSchool ? formData?.headSchool?.school?.schoolNameTH : ""
                        }`}</Label>

                        <h1 className="font-bold">ลายเซ็นอาจารย์ที่ปรึกษา</h1>
                        <div className="w-60 my-4 h-max flex justify-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
                            <Image
                                src={formData?.advisorSignUrl ? formData?.advisorSignUrl : signature}
                                width={100}
                                height={100}
                                style={{
                                    width: "auto",
                                    height: "auto",
                                }}
                                alt="signature"
                            />
                        </div>
                        <Label className="mb-2">
                            {formData?.advisor
                                ? `${formData?.advisor.prefix?.prefixTH}${formData?.advisor.firstNameTH} ${formData?.advisor.lastNameTH}`
                                : ""}
                        </Label>
                        <Label className="mb-5">{`อาจารย์ที่ปรึกษา ${
                            formData?.advisor ? formData?.advisor?.school?.schoolNameTH : ""
                        }`}</Label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThesisOutlineCommitteeFormRead;
