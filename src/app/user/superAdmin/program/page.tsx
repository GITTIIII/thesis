"use client";

import Link from "next/link";
import useSWR from "swr";
import { ISchool } from "@/interface/school";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil } from "lucide-react";

export type IProgramsOnSchools = {
  id: number;
  programNameTH: string;
  programNameEN: string;
  programYear: string;

  schools: any[] & { school: ISchool[] };
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProgramDashboard() {
  const { data: programData = [] } = useSWR<IProgramsOnSchools[]>("/api/schoolProgram", fetcher);
  console.log(programData);

  return (
    <div className="flex flex-col pb-4">
      <div className="flex justify-end px-8 py-4">
        <Button>
          <Link href="/user/superAdmin/program/create">เพิ่มหลักสูตร</Link>
        </Button>
      </div>
      <div className="grid grid-cols-4 gap-4 px-8">
        {programData.map((program) => (
          <Card key={program.id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div className="truncate hover:text-clip">{program.programNameTH}</div>
                <Button variant="ghost" className="h-0 p-0 items-start">
                  <Pencil className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>หลักสูตรปี พ.ศ. {program.programYear}</CardDescription>
            </CardHeader>
            <CardContent>
              {program.schools.map((schoolsData) => (
                <div key={schoolsData.school.id}>{schoolsData.school.schoolNameTH}</div>
              ))}
            </CardContent>
            <CardFooter className="justify-center">
              <Button>ดูรายละเอียด</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
