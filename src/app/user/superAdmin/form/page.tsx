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
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const [filtered, setFiltered] = React.useState("none");

  const form01DataWithFilter = React.useMemo(() => {
    switch (filtered) {
      case "01approved":
        return form01Data.filter((form01) => form01.headSchoolSignUrl !== null);
      case "01wait":
        return form01Data.filter((form01) => form01.headSchoolSignUrl === null);
      default:
        return form01Data;
    }
  }, [form01Data, filtered]);

  const form02DataWithFilter = React.useMemo(() => {
    switch (filtered) {
      case "02approved":
        return form02Data.filter((form02) => form02.headSchoolSignUrl !== null);
      case "02wait":
        return form02Data.filter((form02) => form02.headSchoolSignUrl === null);
      default:
        return form02Data;
    }
  }, [form02Data, filtered]);

  const form03DataWithFilter = React.useMemo(() => {
    switch (filtered) {
      case "03approved":
        return form03Data.filter((form03) => form03.headSchoolSignUrl !== null);
      case "03wait":
        return form03Data.filter((form03) => form03.headSchoolSignUrl === null);
      default:
        return form03Data;
    }
  }, [form03Data, filtered]);

  const form04DataWithFilter = React.useMemo(() => {
    switch (filtered) {
      case "04approved":
        return form04Data.filter((form04) => form04.headSchoolSignUrl !== null);
      case "04wait":
        return form04Data.filter((form04) => form04.headSchoolSignUrl === null);
      default:
        return form04Data;
    }
  }, [form04Data, filtered]);

  const form05DataWithFilter = React.useMemo(() => {
    switch (filtered) {
      case "05approved":
        return form05Data.filter((form05) => form05.formStatus === "อนุมัติ");
      case "05wait":
        return form05Data.filter((form05) => form05.formStatus !== "อนุมัติ");
      default:
        return form05Data;
    }
  }, [form05Data, filtered]);

  const form06DataWithFilter = React.useMemo(() => {
    switch (filtered) {
      case "06approved":
        return form06Data.filter((form06) => form06.headSchoolSignUrl !== null);
      case "06wait":
        return form06Data.filter((form06) => form06.headSchoolSignUrl === null);
      default:
        return form06Data;
    }
  }, [form06Data, filtered]);

  const form07DataWithFilter = React.useMemo(() => {
    switch (filtered) {
      case "07approved":
        return form07Data.filter((form07) => form07.headSchoolSignUrl !== null);
      case "07wait":
        return form07Data.filter((form07) => form07.headSchoolSignUrl === null);
      default:
        return form07Data;
    }
  }, [form07Data, filtered]);

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
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="01approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="01wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form01Columns} data={form01DataWithFilter} />
            </TabsContent>
            <TabsContent value="form02">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="02approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="02wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form02Columns} data={form02DataWithFilter} />
            </TabsContent>
            <TabsContent value="form03">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="03approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="03wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form03Columns} data={form03DataWithFilter} />
            </TabsContent>
            <TabsContent value="form04">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="04approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="04wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form04Columns} data={form04DataWithFilter} />
            </TabsContent>
            <TabsContent value="form05">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="05approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="05wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form05Columns} data={form05DataWithFilter} />
            </TabsContent>
            <TabsContent value="form06">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="06approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="06wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form06Columns} data={form06DataWithFilter} />
            </TabsContent>
            <TabsContent value="form07">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="07approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="07wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form07Columns} data={form07DataWithFilter} />
            </TabsContent>
            <TabsContent value="form08">
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button>
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>ตัวกรอง</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={filtered} onValueChange={setFiltered}>
                      <DropdownMenuRadioItem value="none">ทั้งหมด</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="08approved">อนุมัติแล้ว</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="08wait">ยังไม่อนุมัติ</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <DataTable columns={formColumns.form08Columns} data={form08Data} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
