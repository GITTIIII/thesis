"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "../ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useState } from "react";

const FormSchema = z.object({
  position: z.string(),
});

export function SelectPosition({ id }: { id: number }) {
  const [position, setPosition] = useState("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const payload = {
      id,
      position: data.position,
    };
    const res = await axios.patch("/api/position", payload);
    if (res.status === 200) {
      toast({
        title: "คุณได้ทำการเปลี่นนตำแหน่ง:" + data.position,
      });
    }
  }

  const handlePositionChange = (value: string) => {
    setPosition(value);
    form.setValue("position", value);
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="w-32">
      <Select onValueChange={handlePositionChange} defaultValue={"HEAD_OF_SCHOOL"}>
        <SelectTrigger>
          <SelectValue placeholder="เลือกตำแหน่ง" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HEAD_OF_SCHOOL">หัวหน้าสาขาวิชา</SelectItem>
          {/* <SelectItem value="HEAD_OF_SCHOOL">รักษาการ</SelectItem> */}
          <SelectItem value="ADVISOR">อาจารย์ที่ปรึกษา</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
