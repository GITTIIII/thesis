"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IUser } from "@/interface/user";
import { IExpert } from "@/interface/expert";
import { IPrefix } from "@/interface/prefix";
import useSWR from "swr";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formSchema = z.object({
  id: z.number(),
  prefixID: z.number(),
  firstNameTH: z.string(),
  lastNameTH: z.string(),
  firstNameEN: z.string().optional(),
  lastNameEN: z.string().optional(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  sex: z.string(),
  degree: z.string(),
  instituteID: z.number(),
  schoolID: z.number(),
  programID: z.number(),
  advisorID: z.number(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UpdateStudentDialog({ children, user }: { children: React.ReactNode; user: IUser }) {
  const { data: prefixData } = useSWR<IPrefix[]>("/api/prefix", fetcher);
  console.log("prefixData:", prefixData);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      prefixID: 0,
      firstNameTH: "",
      lastNameTH: "",
      firstNameEN: "",
      lastNameEN: "",
      username: "",
      email: "",
      phone: "",
      sex: "",
      degree: "",
      instituteID: 0,
      schoolID: 0,
      programID: 0,
      advisorID: 0,
    },
  });

  useEffect(() => {
    form.reset(user);
  }, [form, user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("values:", values);
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[50dvw] max-h-full overflow-y-auto">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลนักศึกษา</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="prefixID"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>คำนำหน้า{field.value}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? prefixData?.find((prefix) => prefix.id === field.value)?.prefixTH : "เลือกคำนำหน้า"}
                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput className="h-9" />
                          <CommandList>
                            <CommandEmpty>ไม่พบคำนำหน้า</CommandEmpty>
                            <CommandGroup>
                              {prefixData?.map((prefix) => (
                                <CommandItem
                                  value={prefix.id.toString()}
                                  key={prefix.id}
                                  onSelect={() => {
                                    form.setValue("prefixID", prefix.id);
                                  }}
                                >
                                  {prefix.prefixTH}
                                  <CheckIcon className={cn("ml-auto h-4 w-4", prefix.id === field.value ? "opacity-100" : "opacity-0")} />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="prefixID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>คำนำหน้า / prefix</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {prefixData?.map((prefix) => (
                          <SelectItem key={prefix.id} value={prefix.id.toString()}>
                            {prefix.prefixTH} / {prefix.prefixEN}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstNameTH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อ</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastNameTH"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>นามสกุล</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstNameEN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastNameEN"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล / Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เบอร์โทรศัพท์</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เพศ / sex</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="degree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ระดับการศึกษา / degree</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="instituteID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>สำนักวิชา / institute</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="schoolID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>สาขาวิชา / school</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="programID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>หลักสูตร / program</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advisorID"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อาจารย์ที่ปรึกษา / advisor</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                ยกเลิก
              </Button>
            </DialogClose>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
