"use client";

import axios from "axios";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { MoreHorizontal } from "lucide-react";

interface ActionMenuProps {
  deleteAPI: string;
}

export default function ActionMenu({ deleteAPI }: ActionMenuProps) {
  const { toast } = useToast();
  const handleDelete = () => {
    axios.delete(deleteAPI).then((res) => {
      if (res.status === 200) {
        toast({
          title: "ลบสำเร็จ",
          variant: "default",
          description: "ลบแบบฟอร์มสำเร็จ",
        });
        window.location.reload();
      } else {
        console.error("Error deleting:", res.data);
        toast({
          title: "เกิดข้อผิดพลาด",
          variant: "destructive",
          description: "ลบแบบไม่ฟอร์มสำเร็จ",
        });
      }
    });
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">เปิดเมนู</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
          <DropdownMenuItem>ดาวน์โหลด</DropdownMenuItem>
          <DropdownMenuItem>แก้ไข</DropdownMenuItem>
          <AlertDialogTrigger className="w-full">
            <DropdownMenuItem className="text-red-500">ลบ</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>คุณแน่ใจที่จะลบแบบฟอร์มนี้ใช่ไหม?</AlertDialogTitle>
            <AlertDialogDescription>
              การดำเนินการนี้ไม่สามารถย้อนกลับได้ การดำเนินการนี้จะลบแบบฟอร์มของคุณอย่างถาวร
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </DropdownMenu>
    </AlertDialog>
  );
}
