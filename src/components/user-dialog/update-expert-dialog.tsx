"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IPrefix } from "@/interface/prefix";
import useSWR, { mutate } from "swr";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { toast } from "../ui/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import axios from "axios";
import qs from "query-string";
import { IExpert } from "@/interface/expert";

const formSchema = z.object({
  id: z.number(),
  prefix: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function UpdateExpertDialog({ children, user }: { children: React.ReactNode; user: IExpert }) {
  const { data: prefixData } = useSWR<IPrefix[]>("/api/prefix", fetcher);
  const prefixTH = prefixData?.map((prefix) => prefix.prefixTH);
  const prefixEN = prefixData?.map((prefix) => prefix.prefixEN);
  const allPrefix = prefixTH?.concat(prefixEN || []);

  const [isOpen, isClose] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      prefix: "",
      firstName: "",
      lastName: "",
    },
  });

  useEffect(() => {
    form.reset(user);
  }, [form, user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const url = qs.stringifyUrl({
      url: `/api/expert`,
    });
    const res = await axios.patch(url, values);
    if (res.status === 200) {
      isClose(false);
      mutate("/api/expert");
      toast({
        title: "บันทึกสำเร็จแล้ว",
        description: "ข้อมูลผู้ใช้ถูกแก้ไขเรียบร้อยแล้ว",
        variant: "default",
      });
      form.reset();
      router.refresh();
    } else {
      toast({
        title: "พบข้อผิดพลาด",
        description: res.statusText,
        variant: "destructive",
      });
    }
  }

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={isClose} defaultOpen={isOpen}>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-full">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-xl text-center">แก้ไขข้อมูลผู้เชี่ยวชาญ</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="prefix"
                  render={({ field }) => (
                    <FormItem className="flex flex-col mt-2">
                      <FormLabel>คำนำหน้า</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn("w-[50dwv] justify-between", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? allPrefix?.find((prefix) => prefix === field.value) : "เลือกคำนำหน้า"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[50dwv] p-0">
                          <Command>
                            <CommandInput className="h-9" />
                            <CommandList>
                              <CommandEmpty>ไม่พบคำนำหน้า</CommandEmpty>
                              <CommandGroup>
                                {allPrefix?.map((prefix, key) => (
                                  <CommandItem
                                    value={prefix}
                                    key={key}
                                    onSelect={() => {
                                      form.setValue("prefix", prefix);
                                    }}
                                  >
                                    {prefix}
                                    <CheckIcon className={cn("ml-auto h-4 w-4", prefix === field.value ? "opacity-100" : "opacity-0")} />
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
                <FormField
                  control={form.control}
                  name="firstName"
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
                  name="lastName"
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
              </div>
            </form>
          </Form>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                ยกเลิก
              </Button>
            </DialogClose>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting}>
              ยืนยัน
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
