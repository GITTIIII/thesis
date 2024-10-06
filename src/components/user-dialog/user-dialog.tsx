import React from "react";
import { IUser } from "@/interface/user";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function StudentDialog({ children, user }: { children: React.ReactNode; user: IUser }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="pb-2">ข้อมูลของนักศึกษารหัส {user.username}</DialogTitle>
          <DialogDescription className="text-black">
            <div className="grid gap-4">
              <div>
                <Label>ชื่อ-นามสกุล / Full Name</Label>
                <Input value={`${user.prefix?.prefixTH}${user.firstNameTH} ${user.lastNameTH}`} readOnly />
              </div>
              <div>
                <Label>ชื่อผู้ใช้งาน / Username</Label>
                <Input value={user.username} readOnly />
              </div>
              <div>
                <Label>อีเมล / Email</Label>
                <Input value={user.email} readOnly />
              </div>
              <div>
                <Label>เบอร์โทรศัพท์ / Phone Number</Label>
                <Input value={user.phone} readOnly />
              </div>
              <div>
                <Label>เพศ / Sex</Label>
                <Input value={user.sex === "Male" ? "ชาย" : "หญิง"} readOnly />
              </div>
              <div>
                <Label>ระดับการศึกษา / Degree</Label>
                <Input value={user.degree === "Master" ? "ปริญญาโท" : "ปริญญาตรี"} readOnly />
              </div>
              <div>
                <Label>สำนักวิชา / Institute</Label>
                <Input value={user.institute?.instituteNameTH} readOnly />
              </div>
              <div>
                <Label> สาขาวิชา / School</Label>
                <Input value={user.school?.schoolNameTH} readOnly />
              </div>
              <div>
                <Label>หลักสูตร / Program</Label>
                <Input value={user.program?.programNameTH} readOnly />
              </div>
              <div>
                <Label>อาจารย์ที่ปรึกษา / Advisor</Label>
                <Input value={`${user.advisor?.prefix?.prefixTH}${user.advisor?.firstNameTH} ${user.advisor?.lastNameTH}`} readOnly />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function AdvisorDialog({ children, user }: { children: React.ReactNode; user: IUser }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="pb-2">
            ข้อมูลของอาจารย์ {user.prefix?.prefixTH}
            {user.firstNameTH} {user.lastNameTH}
          </DialogTitle>
          <DialogDescription>
            <div className="grid gap-4">
              <div>
                <Label>ชื่อ-นามสกุล / Full Name</Label>
                <Input value={`${user.prefix?.prefixTH}${user.firstNameTH} ${user.lastNameTH}`} readOnly />
              </div>
              <div>
                <Label>ชื่อผู้ใช้งาน / Username</Label>
                <Input value={user.username} readOnly />
              </div>
              <div>
                <Label>อีเมล / Email</Label>
                <Input value={user.email} readOnly />
              </div>
              <div>
                <Label>เบอร์โทรศัพท์ / Phone Number</Label>
                <Input value={user.phone} readOnly />
              </div>
              <div>
                <Label>เพศ / Sex</Label>
                <Input value={user.sex === "Male" ? "ชาย" : "หญิง"} readOnly />
              </div>
              <div>
                <Label>สำนักวิชา / Institute</Label>
                <Input value={user.institute?.instituteNameTH} readOnly />
              </div>
              <div>
                <Label> สาขาวิชา / School</Label>
                <Input value={user.school?.schoolNameTH} readOnly />
              </div>
              <div>
                <Label> ตำแหน่ง / Position</Label>
                <Input value={user.position === "ADVISOR" ? "อาจารย์ที่ปรึกษา" : "หัวหน้าสาขา"} readOnly />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
