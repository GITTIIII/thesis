"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useState } from "react"
import Image from "next/image"
import createUser from "@../../../public/asset/createUser.png"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CreateUsers from "./creatUsers"
const CreateUser = () => {
  const [active, setActive] = useState("")

  return (
    <div className="w-full h-full p-12">
      <div className="flex items-center p-4">
        <Image src={createUser} width={100} height={100} alt="createUser" />
        <label className="text-2xl">เพิ่มรายชื่อผู้ใช้</label>
      </div>
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-1/2 h-16 grid-cols-3">
          <TabsTrigger
            className="h-full text-lg"
            value="student"
            onClick={() => setActive("student")}
          >
            นักศึกษา
          </TabsTrigger>
          <TabsTrigger
            className="h-full text-lg"
            value="studentExcel"
            onClick={() => setActive("studentExcel")}
          >
            นักศึกษาด้วย Excel
          </TabsTrigger>
          <TabsTrigger
            className="h-full text-lg"
            value="admin"
            onClick={() => setActive("admin")}
          >
            อาจารย์/กรรมการ
          </TabsTrigger>
        </TabsList>
        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>นักศึกษา</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 grid grid-cols-2">
              {/* เเถวซ้าย */}
              <div className="w-1/2 p-4 mx-auto">
                <div className="space-y-1 mb-2">
                  <Label htmlFor="firstname">ชื่อ</Label>
                  <Input id="firstName" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="lastname">นามสกุล</Label>
                  <Input id="lastName" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="username">รหัสนักศึกษา</Label>
                  <Input id="username" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Input id="password" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input id="email" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="phone">เบอร์โทร</Label>
                  <Input id="phone" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="sex">เพศ</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="เพศ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Male">ชาย</SelectItem>
                        <SelectItem value="Female">หญิง</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* เเถวขวา */}
              <div className="w-1/2 p-4 mx-auto">
                <div className="space-y-1 mb-2">
                  <Label htmlFor="educationLevel">ระดับการศึกษา</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="ระดับการศึกษา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Master">ปริญญาโท</SelectItem>
                        <SelectItem value="Doctoral">ปริญญาเอก</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="school">สำนักวิชา</Label>
                  <Input id="school" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="program">หลักสูตร</Label>
                  <Input id="program" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="programYear">ปีหลักสูตร</Label>
                  <Input id="programYear" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>ยืนยัน</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>อาจารย์/กรรมการ</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="w-1/2 p-4 mx-auto">
                <div className="space-y-1 mb-2">
                  <Label htmlFor="firstname">ชื่อ</Label>
                  <Input id="firstName" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="lastname">นามสกุล</Label>
                  <Input id="lastName" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="username">รหัสนักศึกษา</Label>
                  <Input id="username" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="password">รหัสผ่าน</Label>
                  <Input id="password" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="email">อีเมล</Label>
                  <Input id="email" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="phone">เบอร์โทร</Label>
                  <Input id="phone" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="sex">เพศ</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="เพศ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Male">ชาย</SelectItem>
                        <SelectItem value="Female">หญิง</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {/* เเถวขวา */}
              <div className="w-1/2 p-4 mx-auto">
                <div className="space-y-1 mb-2">
                  <Label htmlFor="educationLevel">ระดับการศึกษา</Label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="ระดับการศึกษา" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Master">ปริญญาโท</SelectItem>
                        <SelectItem value="Doctoral">ปริญญาเอก</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="school">สำนักวิชา</Label>
                  <Input id="school" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="program">หลักสูตร</Label>
                  <Input id="program" />
                </div>
                <div className="space-y-1 mb-2">
                  <Label htmlFor="programYear">ปีหลักสูตร</Label>
                  <Input id="programYear" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>ยืนยัน</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="studentExcel">
          <Card>
            <CardHeader>
              <CardTitle>นักศึกษา</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <CreateUsers />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CreateUser
