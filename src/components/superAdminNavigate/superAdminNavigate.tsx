import { Album, BookOpen, PenTool, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function SuperAdminNavigate() {
  return (
    <div className="w-full flex p-8 gap-4 justify-center">
      <Link href="/user/superAdmin">
        <div className="w-48 shadow-lg rounded-3xl">
          <div className="flex items-center justify-center w-full h-20 rounded-3xl bg-[#E4C86A]">
            <Album
              size={64}
              color="#ffffff"
              className="opacity-70 mx-auto absolute"
            />
            <p className="relative z-1">Thesis</p>
          </div>
          <div className="p-4 text-sm text-center">
            The collection of SUT Thesis
          </div>
        </div>
      </Link>
      <Link href="/user/superAdmin">
        <div className="w-48 shadow-lg rounded-3xl">
          <div className="flex items-center justify-center w-full h-20 rounded-3xl bg-[#D4D4D4]">
            <BookOpen
              size={64}
              color="#ffffff"
              className="opacity-70 mx-auto absolute"
            />
            <p className="relative z-1">Documentation</p>
          </div>
          <div className="p-4 text-sm text-center">
            The collection of docs related to thesis
          </div>
        </div>
      </Link>
      <Link href="/user/superAdmin">
        <div className="w-48 shadow-lg rounded-3xl">
          <div className="flex items-center justify-center w-full h-20 rounded-3xl bg-[#EDBBB2]">
            <PenTool
              size={64}
              color="#ffffff"
              className="opacity-70 mx-auto absolute"
            />
            <p className="relative z-1">Student</p>
          </div>
          <div className="p-4 text-sm text-center">
            Graduate and PhD students
          </div>
        </div>
      </Link>
      <Link href="/user/superAdmin">
        <div className="w-48 shadow-lg rounded-3xl">
          <div className="flex items-center justify-center w-full h-20 rounded-3xl bg-[#D9C8B6]">
            <GraduationCap
              size={64}
              color="#ffffff"
              className="opacity-70 mx-auto absolute"
            />
            <p className="relative z-1">Advisor & Committee</p>
          </div>
          <div className="p-4 text-sm text-center">
            Advisor and Committee Information
          </div>
        </div>
      </Link>
    </div>
  );
}
