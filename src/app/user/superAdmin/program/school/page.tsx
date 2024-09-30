"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ISchool } from "@/interface/school";
import ConfirmationModal from "@/components/confirmDialog/confirmModal";
import { useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { Trash2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function School() {
  const { data: schoolData } = useSWR<ISchool[]>("/api/school", fetcher);
  const [isModalOpen, setModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const response = await axios.delete(`/api/school/${id}`);
    setModalOpen(false);
    if (response.status === 200) {
      window.location.reload();
    }
  };

  return (
    <div className="flex flex-col mx-36">
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => {
          if (schoolToDelete) {
            handleDelete(schoolToDelete);
          }
        }}
      />
      <div className="flex justify-between py-4">
        <h1 className="text-3xl font-meduim">สาขา</h1>
        <Button>
          <Link href="/user/superAdmin/program/school/createSchool">เพิ่มสาขา</Link>
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {schoolData?.map((school: ISchool) => (
          <div key={school.id} className="bg-white shadow-md rounded-xl p-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-bold">{school.schoolNameTH}</p>
              <div
                className="hover:cursor-pointer"
                onClick={() => {
                  setSchoolToDelete(school.id);
                  setModalOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" color="red" />
              </div>
            </div>
            <p>{school.schoolNameEN}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
