"use client";

import useSWR from "swr";
import { useSelectForm } from "@/hook/selectFormHook";
import { formColumns } from "./form-columns";
import { DataTable } from "../../../../components/tanStackTable/dataTable";
import {
  IComprehensiveExamCommitteeForm,
  IQualificationExamCommitteeForm,
  IOutlineCommitteeForm,
  IExamCommitteeForm,
  IOutlineForm,
  IThesisProgressForm,
  IThesisExamAppointmentForm,
  IExamForm,
} from "@/interface/form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FormDashborad() {
  const { selectedForm, setSelectedForm } = useSelectForm();

  const handleSelectChange = (value: string) => {
    setSelectedForm(value);
  };

  const { data: form01Data = [] } = useSWR<IComprehensiveExamCommitteeForm[]>("/api/01ComprehensiveExamCommitteeForm", fetcher);
  const { data: form02Data = [] } = useSWR<IQualificationExamCommitteeForm[]>("/api/02QualificationExamCommitteeForm", fetcher);
  const { data: form03Data = [] } = useSWR<IOutlineCommitteeForm[]>("/api/03ThesisOutlineCommitteeForm", fetcher);
  const { data: form04Data = [] } = useSWR<IExamCommitteeForm[]>("/api/04ThesisExamCommitteeForm", fetcher);
  const { data: form05Data = [] } = useSWR<IOutlineForm[]>("/api/05OutlineForm", fetcher);
  const { data: form06Data = [] } = useSWR<IThesisProgressForm[]>("/api/06ThesisProgressForm", fetcher);
  const { data: form07Data = [] } = useSWR<IThesisExamAppointmentForm[]>("/api/07ThesisExamAppointmentForm", fetcher);
  const { data: form08Data = [] } = useSWR<IExamForm[]>("/api/08ThesisExamForm", fetcher);

  return (
    <div className="py-6 mx-6">
      <Card>
        <CardHeader className="pt-4 pb-0">
          <Select onValueChange={handleSelectChange} value={selectedForm}>
            <SelectTrigger className="w-max border-none shadow-none text-xl focus:outline-none focus:ring-0 focus:ring-ring">
              <SelectValue defaultValue={selectedForm} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>แบบฟอร์ม</SelectLabel>
                <SelectItem value="form01">แบบคำขออนุมัติแต่งตั้งกรรมการสอบประมวลความรู้</SelectItem>
                <SelectItem value="form02">แบบคำขออนุมัติแต่งตั้งกรรมการสอบวัดคุณสมบัติ</SelectItem>
                <SelectItem value="form03">แบบคำขออนุมัติแต่งตั้งกรรมการสอบโครงร่างวิทยานิพนธ์</SelectItem>
                <SelectItem value="form04">แบบคำขออนุมัติแต่งตั้งกรรมการสอบวิทยานิพนธ์</SelectItem>
                <SelectItem value="form05">แบบคำขออนุมัติโครงร่างวิทยานิพนธ์ (ทบ.20)</SelectItem>
                <SelectItem value="form06">แบบรายงานความคืบหน้าของการทำวิทยานิพนธ์ (ทบ.21)</SelectItem>
                <SelectItem value="form07">คำขอนัดสอบวิทยานิพนธ์ (ทบ.22)</SelectItem>
                <SelectItem value="form08">แบบประเมินการสอบวิทยานิพนธ์ (ทบ.23)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedForm}>
            <TabsContent value="form01">
              <DataTable columns={formColumns.form01Columns} data={form01Data} />
            </TabsContent>
            <TabsContent value="form02">
              <DataTable columns={formColumns.form02Columns} data={form02Data} />
            </TabsContent>
            <TabsContent value="form03">
              <DataTable columns={formColumns.form03Columns} data={form03Data} />
            </TabsContent>
            <TabsContent value="form04">
              <DataTable columns={formColumns.form04Columns} data={form04Data} />
            </TabsContent>
            <TabsContent value="form05">
              <DataTable columns={formColumns.form05Columns} data={form05Data} />
            </TabsContent>
            <TabsContent value="form06">
              <DataTable columns={formColumns.form06Columns} data={form06Data} />
            </TabsContent>
            <TabsContent value="form07">
              <DataTable columns={formColumns.form07Columns} data={form07Data} />
            </TabsContent>
            <TabsContent value="form08">
              <DataTable columns={formColumns.form08Columns} data={form08Data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
