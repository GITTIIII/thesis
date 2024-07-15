import Link from "next/link";
import { File, ListFilter, PlusCircle, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SuperAdminNavigate from "@/components/superAdminNavigate/superAdminNavigate";
import SuperAdminTable from "@/components/superAdminTable/superAdminTable";

export default function SuperAdmin() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <SuperAdminNavigate />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="ค้นหารายชื่อ"
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              ></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>การตั้งค่า</DropdownMenuItem>
              <DropdownMenuItem>ช่วยเหลือ</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>ออกจากระบบ</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="student">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="student">บัญฑิตศึกษา</TabsTrigger>
                <TabsTrigger value="admin">กรรมการ</TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-7 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        คัดกรอง
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>คัดกรองโดย</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>
                      ทั้งหมด
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      ปริญญาโท
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>
                      ปริญญาเอก
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="outline" className="h-7 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    นำเข้ารายชื่อ
                  </span>
                </Button>
                <Link href="/user/superAdmin/createUser">
                  <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      เพิ่มรายชื่อ
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="student">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>รายชื่อนักศึกษาบัณฑิตศึกษา</CardTitle>
                  <CardDescription>
                    สามารถคลิกที่รายชื่อนักศึกษาเพื่อดูข้อมูลเพิ่มเติมได้
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SuperAdminTable filterRole="STUDENT" />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="admin">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>รายชื่ออาจารย์ที่ปรึกษา / กรรมการ</CardTitle>
                  <CardDescription>
                    สามารถคลิกที่รายชื่อ อาจารย์ที่ปรึกษา / กรรมการ
                    เพื่อดูข้อมูลเพิ่มเติมได้
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SuperAdminTable filterRole="ADMIN" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
