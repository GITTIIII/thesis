"use client";
import React, { useEffect, useState, ChangeEvent } from "react";
import {
  GoAlertFill,
  GoCheckCircleFill,
  GoChevronDown,
  GoChevronRight,
  GoTrash,
  GoX,
} from "react-icons/go";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
// @ts-ignore
import { ExcelRenderer } from "react-excel-renderer";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
interface RowData {
  [key: string]: string | number;
}
const alphabet = "ABCDEFGHIJKLMNOPQ".split("");
const userProperty = [
  { key: "prefix", value: "คำนำหน้า" },
  { key: "firstName", value: "ชื่อ" },
  { key: "lastName", value: "นามสกุล" },
  { key: "username", value: "รหัสนักศึกษา" },
  { key: "password", value: "รหัสผ่าน" },
  { key: "email", value: "อีเมล" },
  { key: "phone", value: "เบอร์โทร" },
  { key: "sex", value: "เพศ" },
  { key: "degree", value: "ระดับการศึกษา" },
  { key: "instituteName", value: "สำนักวิชา" },
  { key: "schoolName", value: "สาขาวิชา" },
  { key: "program", value: "หลักสูตร" },
  { key: "programYear", value: "ปีการศึกษา" },
];

export default function CreateStudentExel() {
  const { toast } = useToast();
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [fileObject, setFileObject] = useState<File>();
  const [data, setData] = useState<any[]>([]);
  const [list, setList] = useState<{ key: string; value: string }[]>([
    { key: "A", value: "username" },
    { key: "B", value: "prefix" },
    { key: "C", value: "firstName" },
    { key: "D", value: "lastName" },
    { key: "E", value: "password" },
    { key: "F", value: "email" },
    { key: "G", value: "degree" },
    { key: "H", value: "instituteName" },
    { key: "I", value: "schoolName" },
  ]);
  const ListTemPlate = ({
    index,
    value,
  }: {
    index: number;
    value: { key: string; value: string };
  }) => {
    const userPropertyIndex = userProperty.findIndex(
      (userP) => userP.key === value.value
    );
    const userPropertyValue =
      userPropertyIndex !== -1 ? userProperty[userPropertyIndex].value : "เลือกค่าคีย์";
    return (
      <div className="flex justify-between">
        <div>
          <Select
            onValueChange={(e) =>
              setList(() => {
                const prev = [...list];
                prev[index].key = e;
                return prev;
              })
            }
          >
            <SelectTrigger className="h-full ">
              <SelectValue placeholder={`${list[index].key}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {alphabet.map((alp, index) => (
                  <SelectItem value={alp} key={index}>
                    {alp}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <GoChevronRight size={30} color="#898A8D" />
        </div>
        <div className=" flex gap-[0.10rem]">
          <Select
            onValueChange={(e) =>
              setList(() => {
                const prev = [...list];
                prev[index].value = e;
                return prev;
              })
            }
          >
            <SelectTrigger className="h-12 w-44 focus-visible:ring-offset-0 focus-visible:ring-0">
              <SelectValue placeholder={userPropertyValue} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {userProperty.map((userP) => (
                  <SelectItem value={userP.key} key={userP.key}>
                    {userP.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div
            className=" h-full p-1 rounded-sm bg-[#f8d7da] border border-[#f5c6cb] flex items-center justify-center   hover:cursor-pointer"
            onClick={() => setList(list.filter((item) => item !== value))}
          >
            <GoTrash color="#721c24" />
          </div>
        </div>
      </div>
    );
  };

  const AddList = () => {
    return (
      <div
        className="border h-12 flex items-center justify-center rounded-md border-dashed bg-background hover:transition hover:scale-[1.01]"
        onClick={() =>
          setList((prevList) => [
            ...prevList,
            { key: "เลือกคอลัมน์", value: "เลือกค่าคีย์" },
          ])
        }
      >
        <GoX
          size={30}
          style={{
            color: "#898A8D",
            transform: "rotate(45deg)",
          }}
        />
      </div>
    );
  };
  useEffect(() => {
    setData([]);
    if (fileObject) {
      ExcelRenderer(fileObject, (err: any, resp: any) => {
        if (err) {
          console.log(err);
        } else {
          const modifyData = resp.rows?.map((itm: any, index: any) => {
            const rowData: RowData = {};
            alphabet.forEach((alp, key) => {
              rowData[alp] = itm[key] || "";
            });
            setData((prevData) => [...prevData, rowData]);
          });
        }
      });
    }
  }, [fileObject]);
  const onSubmit = async () => {
    setDisabled(true);
    if (
      list.some((item) => item.key === "เลือกคอลัมน์" || item.value === "เลือกค่าคีย์")
    ) {
      toast({
        variant: "destructive",
        description: (
          <div className=" flex items-center">
            {<GoAlertFill className="mr-2 " size={30} />}
            <p>
              โปรดเลือกคอลัมและกรอกค่าคีย์ให้ครบทุกข้อ ถ้ามีรายการใดที่ไม่ได้เลือก
              กรุณาลบข้อมูลนั้น
            </p>
          </div>
        ),
      });
      setDisabled(false);
      return;
    }
    if (!fileObject) {
      toast({
        variant: "destructive",
        description: (
          <div className=" flex items-center">
            {<GoAlertFill className="mr-2" size={30} />}
            <p>กรุณาอัปโหลดไฟล์ Excel</p>
          </div>
        ),
      });
      setDisabled(false);
      return;
    }
    let columnKey: RowData = {};

    list.forEach((item) => {
      columnKey[item.key] = item.value;
    });

    var data = new FormData();
    if (fileObject) {
      data.append("file", fileObject);
    }
    data.append("columnKey", JSON.stringify(columnKey));
    fetch(`/api/user/importExcel`, {
      method: "POST",
      // headers: {},
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.message === "Users Created") {
          toast({
            description: (
              <div className=" flex items-center">
                {<GoCheckCircleFill color={"#28A645"} className="mr-2" size={30} />}
                <p>{`สร้างผู้ใช้เรียบร้อยแล้ว จำนวน ${result.result.count} คน`}</p>
              </div>
            ),
          });
          setTimeout(() => {
            router.push("/user/superAdmin");
          }, 3000);
        } else if (result.Error.code === "P2002") {
          toast({
            variant: "destructive",
            description: (
              <div className=" flex items-center">
                {<GoAlertFill className="mr-2" size={30} />}
                <p>
                  มีข้อมูลที่ซ้ำกันในฟิลด์ที่ต้องไม่ซ้ำ <br />
                  (เช่น รหัสนักศึกษา,อีเมล) <br />
                  กรุณาตรวจสอบข้อมูลที่กรอกและลองอีกครั้ง
                </p>
              </div>
            ),
          });
          setDisabled(false);
        } else {
          setDisabled(false);
          toast({
            variant: "destructive",
            description: (
              <div className=" flex items-center">
                {<GoAlertFill className="mr-2" size={30} />}
                <div>
                  {Object.keys(result.Error).map((key) => (
                    <p key={key}>{`${key}: ${result.Error[key]}`}</p>
                  ))}
                </div>
              </div>
            ),
          });
        }
      })
      .catch((error) => {});
  };
  return (
    <div className=" space-y-16">
      <ResizablePanelGroup direction="horizontal">
        {/* Left Panel: Form Inputs */}
        <ResizablePanel defaultSize={30}>
          <div className="mt-8 w-fit flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="excel">อัพโหลด excel</Label>
                <Input
                  id="picture"
                  type="file"
                  onChange={(e) => {
                    const selectFile = e.target.files ? e.target.files[0] : null;
                    if (selectFile) {
                      setFileObject(selectFile);
                    }
                  }}
                  accept=".xlsx"
                />
              </div>
              {list.map((value, key) => (
                <ListTemPlate value={value} key={key} index={key} />
              ))}
              <AddList />
              <Button onClick={onSubmit} disabled={disabled}>
                {disabled && (
                  <AiOutlineLoading3Quarters className="mr-2 h-4 w-4 animate-spin" />
                )}
                ยืนยัน
              </Button>
            </div>
          </div>
        </ResizablePanel>

        {/* Handle for resizing */}
        <ResizableHandle withHandle />

        {/* Right Panel: Table Display */}
        <ResizablePanel
          className="text-sm p-4 overflow-scroll"
          style={{ overflow: "scroll" }}
        >
          <div className="border min-w-[1250px] h-full rounded-sm bg-white ">
            <Table>
              <TableHeader>
                <TableRow>
                  {list.map((data, key) => (
                    <TableHead key={key}>
                      <div className="flex flex-col text-center items-center">
                        <p>{data.key}</p>
                        <GoChevronDown />
                        <p>
                          {
                            userProperty.find(
                              (prop) =>
                                prop.key ===
                                list.find((item) => item.key === data.key)?.value
                            )?.value
                          }
                        </p>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((d, rowKey) => (
                  <TableRow key={rowKey}>
                    {alphabet.map((letter, cellKey) => (
                      <>
                        {d[letter] && (
                          <TableCell className="text-center" key={cellKey}>
                            {d[letter]}
                          </TableCell>
                        )}
                      </>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">รหัสนักศึกษา</TableHead>
            <TableHead className="text-center">ชื่อ นามสกุล</TableHead>
            <TableHead className="text-center">สถานะ</TableHead>
            <TableHead className="text-center">หมายเหตุ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {std.map((stdItem, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{stdItem.id}</TableCell>
              <TableCell>{stdItem.name}</TableCell>
              <TableCell>
                {stdItem.status ? (
                  <>
                    <div className="text-center text-sm text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800">
                      <div>
                        <span className="font-medium">บันทึกสำเร็จ</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className=" text-center text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                      role="alert"
                    >
                      <div>
                        <span className="font-medium">บันทึกไม่สำเร็จ</span>
                      </div>
                    </div>
                  </>
                )}
              </TableCell>
              <TableCell className=" space-x-2">
                {stdItem.operationStatus?.map((status, idx) => (
                  <div
                    key={idx}
                    className=" inline px-2  text-center text-sm *:text-yellow-800 border border-yellow-300 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
                  >
                    <span className="font-medium">{status}</span>
                  </div>
                ))}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-right text-green-800"
            >{`บันทึกสำเร็จ ${10}`}</TableCell>
            <TableCell className="text-right text-red-800">{`บันทึกไม่สำเร็จ ${10}`}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

const std = [
  {
    id: "B6419936",
    name: "ธีรโชติ สนนอก",
    status: false,
    operationStatus: ["ชื่อทีข้อผิดพลาด", "ชื่อทีข้อผิดพลาด2", "ชื่อทีข้อผิดพลาด3"],
  },
  {
    id: "B6419936",
    name: "ธีรโชติ สนนอก",
    status: false,

    operationStatus: ["ชื่อทีข้อผิดพลาด", "ชื่อทีข้อผิดพลาด2", "ชื่อทีข้อผิดพลาด3"],
  },
  {
    id: "B6419936",
    name: "ธีรโชติ สนนอก",
    status: true,
  },
];
