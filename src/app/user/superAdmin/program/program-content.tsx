import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { ISchool } from "@/interface/school";

export type IProgramsOnSchools = {
  id: number;
  programNameTH: string;
  programNameEN: string;
  programYear: string;

  schools: any[] & { school: ISchool[] };
};

export default function ProgramContent(programData: IProgramsOnSchools | any) {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between py-4">
        <h1 className="text-3xl font-medium">หลักสูตร</h1>
        <div className="flex gap-4">
          <Button>
            <Link href="/user/superAdmin/program/school">จัดการสาขา</Link>
          </Button>
          <Button>
            <Link href="/user/superAdmin/program/create">เพิ่มหลักสูตร</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {programData.map((program: any) => (
          <Card key={program.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <div className="truncate hover:text-clip">{program.programNameTH}</div>
                <div className="h-0 p-0 items-start flex gap-2 hover:cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  <Trash2 className="h-4 w-4" color="red" />
                </div>
              </CardTitle>
              <CardDescription>หลักสูตรปี พ.ศ. {program.programYear}</CardDescription>
            </CardHeader>
            <CardContent>
              {program.schools.map((schoolsData: any) => (
                <div key={schoolsData.school.id}>{schoolsData.school.schoolNameTH}</div>
              ))}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button>ดูรายละเอียด</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
