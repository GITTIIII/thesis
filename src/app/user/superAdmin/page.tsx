import Link from "next/link";
import { File, PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SuperAdminNavigate from "@/components/superAdminNavigate/superAdminNavigate";
import SuperAdminStudentTable from "@/components/superAdminTable/superAdminStudentTable";
import SuperAdminAdvisorTable from "@/components/superAdminTable/superAdminAdvisorTable";
import SuperAdminCommitteeTable from "@/components/superAdminTable/superAdminCommitteeTable";

export default function SuperAdmin() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6"></header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="student">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="student">บัณฑิตศึกษา</TabsTrigger>
                <TabsTrigger value="advisor">อาจารย์ที่ปรึกษา</TabsTrigger>
                <TabsTrigger value="committee">กรรมการ</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <Link href="/user/superAdmin/createUser">
                  <Button size="sm" variant="outline" className="h-7 gap-1">
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">นำเข้ารายชื่อ</span>
                  </Button>
                </Link>
                <Link href="/user/superAdmin/createUser">
                  <Button size="sm" className="h-7 gap-1 bg-[#F26522]">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">เพิ่มรายชื่อ</span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="student">
              <Card>
                <CardHeader>
                  <CardTitle>รายชื่อบัณฑิตศึกษา</CardTitle>
                  <CardDescription>สามารถคลิกที่เมนูด้านขวาเพื่อดูข้อมูลเพิ่มเติมได้</CardDescription>
                </CardHeader>
                <CardContent>
                  <SuperAdminStudentTable filterRole="STUDENT" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="advisor">
              <Card>
                <CardHeader>
                  <CardTitle>รายชื่ออาจารย์ที่ปรึกษา</CardTitle>
                  <CardDescription>สามารถคลิกที่รายชื่ออาจารย์ที่ปรึกษาเพื่อดูข้อมูลเพิ่มเติมได้</CardDescription>
                </CardHeader>
                <CardContent>
                  <SuperAdminAdvisorTable filterRole="ADMIN" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="committee">
              <Card>
                <CardHeader>
                  <CardTitle>รายชื่อกรรมการ</CardTitle>
                  <CardDescription>สามารถคลิกที่รายชื่ออกรรมการเพื่อดูข้อมูลเพิ่มเติมได้</CardDescription>
                </CardHeader>
                <CardContent>
                  <SuperAdminCommitteeTable filterRole="COMMITTEE" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
