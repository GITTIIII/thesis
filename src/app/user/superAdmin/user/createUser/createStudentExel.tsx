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
interface IResult {
  id: string;
  name: string;
  message: string[];
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
  { key: "institute", value: "สำนักวิชา" },
  { key: "school", value: "สาขาวิชา" },
  { key: "program", value: "หลักสูตร" },
  { key: "advisor", value: "อาจารย์ที่ปรึกษา" },
];

export default function CreateStudentExel() {
  const { toast } = useToast();
  const router = useRouter();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [fileObject, setFileObject] = useState<File>();
  const [data, setData] = useState<any[]>([]);
  const [result, setResult] = useState<IResult[]>([]);
  const [list, setList] = useState<{ key: string; value: string }[]>([
    { key: "A", value: "username" },
    { key: "B", value: "prefix" },
    { key: "C", value: "firstName" },
    { key: "D", value: "lastName" },
    { key: "E", value: "password" },
    { key: "F", value: "email" },
    { key: "G", value: "degree" },
    { key: "H", value: "institute" },
    { key: "I", value: "school" },
    { key: "J", value: "program" },
    { key: "K", value: "advisor" },
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
          const modifyData = resp.rows?.map((itm: any) => {
            const rowData: RowData = {};
            alphabet.forEach((alp, key) => {
              rowData[alp] = itm[key] || "";
            });
            return rowData;
          });

          setData(modifyData);
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
      body: data,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data) {
          setResult(result.data);
          setDisabled(false);
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
      {result.length != 0 && (
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
            {result.map((stdItem, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{stdItem.id}</TableCell>
                <TableCell>{stdItem.name}</TableCell>
                <TableCell>
                  {stdItem.message.length === 0 ? (
                    <>
                      <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-emerald-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="-ms-1 me-1.5 size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>

                        <p className="whitespace-nowrap text-sm">บันทึกสำเร็จ</p>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center justify-center rounded-full bg-red-100 px-2.5 py-0.5 text-red-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="-ms-1 me-1.5 size-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                          />
                        </svg>

                        <p className="whitespace-nowrap text-sm">บันทึกไม่สำเร็จ</p>
                      </span>
                    </>
                  )}
                </TableCell>
                <TableCell className=" space-x-2">
                  {stdItem.message?.map((status, idx) => (
                    <>
                      <span className="inline-flex items-center justify-center rounded-full border border-amber-500 px-2.5 py-0.5 text-amber-700">
                        <p className="whitespace-nowrap text-sm">{status}</p>
                      </span>
                    </>
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
              >{`บันทึกสำเร็จ ${countStatus(result)[0]}`}</TableCell>
              <TableCell className="text-right text-red-800">{`บันทึกไม่สำเร็จ ${
                countStatus(result)[1]
              }`}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      )}
    </div>
  );
}

function countStatus(stdList: IResult[]) {
  let x = 0;
  let y = 0;

  stdList.forEach((std) => {
    if (std.message.length === 0) {
      x++;
    } else {
      y++;
    }
  });

  return [x, y];
}
