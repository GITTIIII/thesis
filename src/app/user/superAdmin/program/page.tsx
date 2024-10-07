import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import { ConfirmDeleteDialog } from "@/components/alertDialog/ConfirmDeleteDialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default async function ProgramDashboard() {
  const programData = await db.program.findMany({ include: { schools: { include: { school: true } } } });

  return (
    <div className="flex flex-col mx-36">
      <div className="flex justify-between py-4">
        <div className="text-3xl font-medium">หลักสูตร</div>
        <div className="flex gap-4">
          <Button>
            <Link href="/user/superAdmin/program/school">จัดการสาขา</Link>
          </Button>
          <Button>
            <Link href="/user/superAdmin/program/createProgram">เพิ่มหลักสูตร</Link>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {programData.map((program) => (
          <Card key={program.id}>
            <Collapsible>
              <CardHeader>
                <CardTitle className="flex justify-between">
                  <div className="truncate hover:text-clip">{program.programNameTH}</div>
                  <div className="h-0 p-0 items-start flex gap-2 hover:cursor-pointer">
                    {/* <Pencil className="h-4 w-4" /> */}
                    <ConfirmDeleteDialog
                      title="คุณแน่ใจที่จะลบหลักสูตรนี้?"
                      description="ต้องการลบหลักสูตรนี้หรือไม่"
                      deleteAPI={`/api/program/${program.id}`}
                      fetchAPI="/api/program"
                    >
                      <Trash2 className="h-4 w-4" color="red" />
                    </ConfirmDeleteDialog>
                  </div>
                </CardTitle>
                <CardDescription>หลักสูตรปี พ.ศ. {program.programYear}</CardDescription>
              </CardHeader>
              <CollapsibleContent>
                <CardContent>
                  {program.schools.map((schoolsData) => (
                    <div key={schoolsData.school.id}>{schoolsData.school.schoolNameTH}</div>
                  ))}
                </CardContent>
              </CollapsibleContent>
              <CardFooter className="flex justify-center">
                <CollapsibleTrigger>
                  <Button variant="ghost">
                    ดูรายละเอียดสาขา <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
              </CardFooter>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}
