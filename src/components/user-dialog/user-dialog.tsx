import React from "react";
import { IUser } from "@/interface/user";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IExpert } from "@/interface/expert";

export function StudentDialog({ children, user }: { children: React.ReactNode; user: IUser }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[50dvw] max-h-full pb-12">
        <DialogHeader>
          <DialogTitle className="pb-4 text-xl text-center">ข้อมูลของนักศึกษารหัส {user.username}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <div>
            <Label>ชื่อผู้ใช้งาน / Username</Label>
            <Input value={user.username} readOnly />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label>ชื่อ-นามสกุล (ภาษาไทย)</Label>
              <Input value={`${user.prefix?.prefixTH}${user.firstNameTH} ${user.lastNameTH}`} readOnly />
            </div>
            <div>
              <Label>ชื่อ-นามสกุล (ภาษาอังกฤษ)</Label>
              <Input value={`${user.prefix?.prefixEN}${user.firstNameEN || ""} ${user?.lastNameEN || ""}`} readOnly />
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
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function AdvisorDialog({ children, user }: { children: React.ReactNode; user: IUser }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[50dvw] max-h-full pb-12">
        <DialogHeader>
          <DialogTitle className="pb-4 text-xl text-center">
            ข้อมูลของอาจารย์ {user.prefix?.prefixTH}
            {user.firstNameTH} {user.lastNameTH}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ชื่อผู้ใช้งาน / Username</Label>
            <Input value={user.username} readOnly />
          </div>
          <div>
            <Label>ชื่อ-นามสกุล / Full Name</Label>
            <Input value={`${user.prefix?.prefixTH}${user.firstNameTH} ${user.lastNameTH}`} readOnly />
          </div>
          <div>
            <Label> ตำแหน่ง / Position</Label>
            <Input value={user.position === "ADVISOR" ? "อาจารย์ที่ปรึกษา" : "หัวหน้าสาขา"} readOnly />
          </div>
          <div>
            <Label>เพศ / Sex</Label>
            <Input value={user.sex === "Male" ? "ชาย" : "หญิง"} readOnly />
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
            <Label>สำนักวิชา / Institute</Label>
            <Input value={user.institute?.instituteNameTH} readOnly />
          </div>
          <div>
            <Label> สาขาวิชา / School</Label>
            <Input value={user.school?.schoolNameTH} readOnly />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function HeadInstituteDialog({ children, user }: { children: React.ReactNode; user: IUser }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[50dvw] max-h-full pb-12">
        <DialogHeader>
          <DialogTitle className="pb-4 text-xl text-center">
            ข้อมูลของ {user.prefix?.prefixTH}
            {user.firstNameTH} {user.lastNameTH}
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ชื่อผู้ใช้งาน / Username</Label>
            <Input value={user.username} readOnly />
          </div>
          <div>
            <Label>ชื่อ-นามสกุล / Full Name</Label>
            <Input value={`${user.prefix?.prefixTH}${user.firstNameTH} ${user.lastNameTH}`} readOnly />
          </div>
          <div>
            <Label> ตำแหน่ง / Position</Label>
            <Input value={user.position === "HEAD_OF_INSTITUTE" ? "คณบดี" : ""} readOnly />
          </div>
          <div>
            <Label>เพศ / Sex</Label>
            <Input value={user.sex === "Male" ? "ชาย" : "หญิง"} readOnly />
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
            <Label>สำนักวิชา / Institute</Label>
            <Input value={user.institute?.instituteNameTH} readOnly />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ExpertDialog({ children, user }: { children: React.ReactNode; user: IExpert }) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[50dvw] max-h-full pb-12">
        <DialogHeader>
          <DialogTitle className="pb-4 text-xl text-center">
            ข้อมูลของ {user.prefix}
            {user.firstName} {user.lastName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div>
            <Label>ชื่อ-นามสกุล </Label>
            <Input value={`${user.prefix}${user.firstName} ${user.lastName}`} readOnly />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
