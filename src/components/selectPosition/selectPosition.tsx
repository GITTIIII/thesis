"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";
import { IUser } from "@/interface/user";
import { mutate } from "swr";

const FormSchema = z.object({
  position: z.string(),
});

export function SelectPosition({ user }: { user: IUser }) {
  const [position, setPosition] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = {
      id: user.id,
      position: data.position,
    };
    const res = await axios.patch("/api/position", payload);
    if (res.status === 200) {
      mutate("/api/getAdvisor");
      toast({
        title:
          `${user.prefix?.prefixTH}${user.firstNameTH} ${user.lastNameTH} เปลี่ยนตำแหน่งเป็น : ` +
          (data.position === "HEAD_OF_SCHOOL" ? "หัวหน้าสาขาวิชา / รักษาการ" : "อาจารย์ที่ปรึกษา"),
      });
    }
  }

  const handlePositionChange = (value: string) => {
    setPosition(value);
    form.setValue("position", value);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="w-36">
      <Select onValueChange={handlePositionChange} defaultValue={user.position.toString()}>
        <SelectTrigger>
          <SelectValue placeholder="เลือกตำแหน่ง" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HEAD_OF_SCHOOL">หัวหน้าสาขาวิชา / รักษาการ</SelectItem>
          <SelectItem value="ADVISOR">อาจารย์ที่ปรึกษา</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
