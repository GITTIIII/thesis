"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
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
import { useToast } from "../ui/use-toast";
import { mutate } from "swr";

interface Props {
  children: React.ReactNode;
  deleteAPI: string;
  title: string;
  description: string;
  fetchAPI: string;
}

export function ConfirmDeleteDialog({ children, title, description, deleteAPI, fetchAPI }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = () => {
    axios.delete(deleteAPI).then((res) => {
      if (res.status === 200) {
        mutate(fetchAPI);
        toast({
          title: "ลบข้อมูลสำเร็จ",
          variant: "default",
          description: "ลบข้อมูลสำเร็จแล้ว",
        });
      } else {
        console.error("Error deleting:", res.data);
        toast({
          title: "เกิดข้อผิดพลาด",
          variant: "destructive",
          description: "เกิดข้อผิดพลาดในการลบข้อมูล",
        });
      }
    });
  };

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-none">ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>ยืนยัน</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
