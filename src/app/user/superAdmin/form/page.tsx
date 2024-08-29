"use client";

import { useState } from "react";
import axios from "axios";
import useSWR from "swr";
import { formColumns } from "./columns";
import { DataTable } from "./dataTable";
import {
  IComprehensiveExamCommitteeForm,
  IQualificationExamCommitteeForm,
  IOutlineForm,
  IThesisProgressForm,
} from "@/interface/form";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export default function FormDashborad() {
  const [selectedForm, setSelectedForm] = useState("form01");
  const handleSelectChange = (value: string) => {
    setSelectedForm(value);
  };

  const { data: form01Data = [] } = useSWR<IComprehensiveExamCommitteeForm[]>(
    "/api/01ComprehensiveExamCommitteeForm",
    fetcher
  );
  const { data: form02Data = [] } = useSWR<IQualificationExamCommitteeForm[]>(
    "/api/02QualificationExamCommitteeForm",
    fetcher
  );
  const { data: form05Data = [] } = useSWR<IOutlineForm[]>("/api/05OutlineForm", fetcher);
  const { data: form06Data = [] } = useSWR<IThesisProgressForm[]>("/api/06ThesisProgressForm", fetcher);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="p-4">
          <Select onValueChange={handleSelectChange} value={selectedForm}>
            <SelectTrigger className="w-max border-none shadow-none text-xl focus:outline-none focus:ring-0 focus:ring-ring">
              <SelectValue defaultValue={selectedForm} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>ฟอร์มในระบบ</SelectLabel>
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
              <div>FORM 3</div>
            </TabsContent>
            <TabsContent value="form04">
              <div>FORM 4</div>
            </TabsContent>
            <TabsContent value="form05">
              <DataTable columns={formColumns.form05Columns} data={form05Data} />
            </TabsContent>
            <TabsContent value="form06">
              <DataTable columns={formColumns.form06Columns} data={form06Data} />
            </TabsContent>
            <TabsContent value="form07">
              <div>FORM 7</div>
            </TabsContent>
            <TabsContent value="form08">
              <div>FORM 8</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
