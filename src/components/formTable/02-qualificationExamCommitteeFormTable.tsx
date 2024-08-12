"use Client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { IQualificationExamCommitteeForm } from "@/interface/form";
import { IUser } from "@/interface/user";

async function getFormData(stdId: number | undefined) {
  if (stdId) {
    const res = await fetch(`/api/get02FormByStdId/${stdId}`, {
      next: { revalidate: 10 },
    });
    return res.json();
  }
}

export default function QualificationExamCommitteeFormTable({
  userData,
}: {
  userData: IUser | undefined;
}) {
  const [formData, setFormData] = useState<IQualificationExamCommitteeForm[]>();

  useEffect(() => {
    async function fetchData() {
      const formData = await getFormData(userData?.id);
      setFormData(formData);
    }
    fetchData();
  }, [userData]);

  return (
    <>
      <div className="w-full h-full bg-white shadow-2xl rounded-md p-2 ">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">ลำดับ</TableHead>
              <TableHead className="text-center">วันที่สร้าง</TableHead>
              <TableHead className="text-center">ภาคการศึกษา</TableHead>
              <TableHead className="text-center">ปีการศึกษา</TableHead>
              <TableHead className="text-center">รหัสนักศึกษา</TableHead>
              <TableHead className="text-center">ชื่อ นศ.</TableHead>
              <TableHead className="text-center">สอบครั้งที่</TableHead>
              <TableHead className="text-center">วันที่สอบ</TableHead>
              <TableHead className="text-center">รายละเอียด</TableHead>
              <TableHead className="text-center">ดาวน์โหลดฟอร์ม</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formData
              ?.filter(
                (formData) =>
                  (userData?.role.toString() === "STUDENT" &&
                    userData?.id === formData?.student?.id) ||
                  userData?.role.toString() != "STUDENT"
              )
              .map((formData, index) => (
                <TableRow
                  key={formData.id}
                  className={(index + 1) % 2 == 0 ? `bg-[#f0c38d3d]` : ""}
                >
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">{formData.date}</TableCell>
                  <TableCell className="text-center">{formData.trimester}</TableCell>
                  <TableCell className="text-center">{formData.academicYear}</TableCell>
                  <TableCell className="text-center">
                    {formData?.student.username}
                  </TableCell>
                  <TableCell className="text-center">
                    {`${formData?.student?.firstNameTH} ${formData?.student?.lastNameTH}`}
                  </TableCell>
                  <TableCell className="text-center">{formData.times}</TableCell>
                  <TableCell className="text-center">{formData.examDay}</TableCell>
                  <TableCell className="text-[#F26522] text-center">
                    <Link
                      href={`/user/form/qualificationExamCommitteeForm/${formData.id}`}
                    >
                      คลิกเพื่อดูเพิ่มเติม
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`/api/02QualificationExamCommitteeForm/download?id=${formData.id}`}
                    >
                      <Button type="button" variant="outline">
                        <Download className="mr-2" />
                        ดาวน์โหลด
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
