import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const form = [
    {
        id: "1",
        username: "B6412253",
        studentName: "จตุรพักตร พรหมโคตร์",
        formNumber: "123",
        formType: "ทบ.22-2",
        formStatus: "อนุมัติ"
    },
    {
        id: "2",
        username: "B6412253",
        studentName: "จตุรพักตร พรหมโคตร์",
        formNumber: "123",
        formType: "ทบ.22-2",
        formStatus: "อนุมัติ"
    },
    {
        id: "3",
        username: "B6412253",
        studentName: "จตุรพักตร พรหมโคตร์",
        formNumber: "123",
        formType: "ทบ.22-2",
        formStatus: "อนุมัติ"
    },

]

function AdminTable() {
    return (
        <>
            <div className="w-full h-full bg-white shadow-2xl rounded-md px-2">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>รหัสนักศึกษา</TableHead>
                            <TableHead>ชื่อ นศ.</TableHead>
                            <TableHead>หมายเลขฟอร์ม</TableHead>
                            <TableHead>ประเภทฟอร์ม</TableHead>
                            <TableHead>รายละเอียด</TableHead>
                            <TableHead>สถานะ</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {form.map((form) => (
                            <TableRow key={form.id}>
                                <TableCell>{form.id}</TableCell>
                                <TableCell>{form.username}</TableCell>
                                <TableCell>{form.studentName}</TableCell>
                                <TableCell>{form.formNumber}</TableCell>
                                <TableCell>{form.formType}</TableCell>
                                <TableCell className="text-[#F26522]">
                                    <Link href={""}>
                                        คลิกเพื่อดูเพิ่มเติม
                                    </Link>
                                </TableCell>
                                <TableCell>{form.formStatus}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
        </>
    )
}

export default AdminTable