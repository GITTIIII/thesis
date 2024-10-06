"use client";

import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { ConfirmDeleteDialog } from "../alertDialog/ConfirmDeleteDialog";
import { IUser } from "@/interface/user";
import { IExpert } from "@/interface/expert";
import { UpdateStudentDialog } from "../user-dialog/update-student-dialog";
import { UpdateAdvisorDialog } from "../user-dialog/update-advisor-dialog";
import { UpdateHeadInstituteDialog } from "../user-dialog/update-head-dialog";
import { UpdateExpertDialog } from "../user-dialog/update-expert-dialog";

interface Props {
  downloadPath: string;
  updatePath: string;
  deleteAPI: string;
  fetchAPI: string;
}

export function FormActionMenu({ downloadPath, updatePath, deleteAPI, fetchAPI }: Props) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">เปิดเมนู</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => router.push(downloadPath)}>ดาวน์โหลด</DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(updatePath)}>แก้ไข</DropdownMenuItem>
        <ConfirmDeleteDialog
          title="คุณแน่ใจที่จะลบข้อมูลแบบฟอร์มใช่ไหม?"
          description="การดำเนินการนี้ไม่สามารถย้อนกลับได้ หากดำเนินการแล้วข้อมูลแบบฟอร์มจะถูกอย่างถาวร"
          deleteAPI={deleteAPI}
          fetchAPI={fetchAPI}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="text-red-500 w-28"
          >
            ลบ
          </DropdownMenuItem>
        </ConfirmDeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function StudentActionMenu({ user, deleteAPI, fetchAPI }: { user: IUser; deleteAPI: string; fetchAPI: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">เปิดเมนู</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
        <UpdateStudentDialog user={user}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="w-28"
          >
            แก้ไข
          </DropdownMenuItem>
        </UpdateStudentDialog>
        <ConfirmDeleteDialog
          title="คุณแน่ใจที่จะลบข้อมูลนักศึกษาใช่ไหม?"
          description="การดำเนินการนี้ไม่สามารถย้อนกลับได้ หากดำเนินการแล้วข้อมูลนักศึกษาจะถูกลบอย่างถาวร"
          deleteAPI={deleteAPI}
          fetchAPI={fetchAPI}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="text-red-500 min-w-28"
          >
            ลบ
          </DropdownMenuItem>
        </ConfirmDeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AdvisorActionMenu({ user, deleteAPI, fetchAPI }: { user: IUser; deleteAPI: string; fetchAPI: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">เปิดเมนู</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
        <UpdateAdvisorDialog user={user}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="w-28"
          >
            แก้ไข
          </DropdownMenuItem>
        </UpdateAdvisorDialog>
        <ConfirmDeleteDialog
          title="คุณแน่ใจที่จะลบข้อมูลอาจารย์ใช่ไหม?"
          description="การดำเนินการนี้ไม่สามารถย้อนกลับได้ หากดำเนินการแล้วข้อมูลอาจารย์จะถูกลบอย่างถาวร"
          deleteAPI={deleteAPI}
          fetchAPI={fetchAPI}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="text-red-500 min-w-28"
          >
            ลบ
          </DropdownMenuItem>
        </ConfirmDeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function HeadInstituteActionMenu({ user, deleteAPI, fetchAPI }: { user: IUser; deleteAPI: string; fetchAPI: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">เปิดเมนู</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
        <UpdateHeadInstituteDialog user={user}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="w-28"
          >
            แก้ไข
          </DropdownMenuItem>
        </UpdateHeadInstituteDialog>
        <ConfirmDeleteDialog
          title="คุณแน่ใจที่จะลบข้อมูลคณบดีใช่ไหม?"
          description="การดำเนินการนี้ไม่สามารถย้อนกลับได้ หากดำเนินการแล้วข้อมูลคณบดีจะถูกลบอย่างถาวร"
          deleteAPI={deleteAPI}
          fetchAPI={fetchAPI}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="text-red-500 min-w-28"
          >
            ลบ
          </DropdownMenuItem>
        </ConfirmDeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ExpertActionMenu({ user, deleteAPI, fetchAPI }: { user: IExpert; deleteAPI: string; fetchAPI: string }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">เปิดเมนู</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
        <UpdateExpertDialog user={user}>
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="w-28"
          >
            แก้ไข
          </DropdownMenuItem>
        </UpdateExpertDialog>
        <ConfirmDeleteDialog
          title="คุณแน่ใจที่จะลบข้อมูลคณบดีใช่ไหม?"
          description="การดำเนินการนี้ไม่สามารถย้อนกลับได้ หากดำเนินการแล้วข้อมูลคณบดีจะถูกลบอย่างถาวร"
          deleteAPI={deleteAPI}
          fetchAPI={fetchAPI}
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
            }}
            className="text-red-500 min-w-28"
          >
            ลบ
          </DropdownMenuItem>
        </ConfirmDeleteDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
