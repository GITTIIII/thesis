"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import useSWR from "swr";
import { IInstitute } from "@/interface/institute";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  schoolNameTH: z.string().min(1, { message: "กรุณากรอกชื่อสาขาภาษาไทย / Thai school name requierd" }),
  schoolNameEN: z.string().min(1, { message: "กรุณากรอกชื่อสาขาภาษาอังกฤษ / English school name requierd" }),
  instituteID: z.string(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CreateSchool() {
  const { data: instituteData } = useSWR<IInstitute[]>("/api/institute", fetcher);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      schoolNameTH: "",
      schoolNameEN: "",
      instituteID: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const url = qs.stringifyUrl({
      url: `/api/school`,
    });

    try {
      const res = await axios.post(url, values);
      toast({
        title: "Success",
        description: "บันทึกสำเร็จแล้ว",
        variant: "default",
      });
      setTimeout(() => {
        form.reset();
        router.refresh();
        router.push("/user/superAdmin/program/school");
      }, 1000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast({
          title: "Error",
          description: err.response?.data?.message || "An error occurred",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full h-dvh grid place-items-center">
        <div className="w-96 bg-white shadow-lg p-4">
          <div className="text-2xl font-medium py-4">เพิ่มสาขา</div>
          <div>
            <FormField
              control={form.control}
              name="schoolNameTH"
              render={({ field }) => (
                <div>
                  <FormLabel htmlFor="schoolNameTH">
                    ชื่อสาขา <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="schoolNameEN"
              render={({ field }) => (
                <div>
                  <FormLabel htmlFor="schoolNameEN">
                    School Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </div>
              )}
            />
            <FormField
              control={form.control}
              name="instituteID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>สำนักวิชา</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="เลือกสำนักวิชา" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {instituteData?.map((institute) => (
                        <SelectItem key={institute.id} value={String(institute.id)}>
                          {institute.instituteNameTH}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-4 mt-4">
            <Button variant="outline" type="reset" onClick={() => router.push("/user/superAdmin/program/school")}>
              ยกเลิก
            </Button>
            <Button disabled={loading} type="submit">
              ยืนยัน
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
