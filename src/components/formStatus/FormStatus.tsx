import { IOutlineForm } from "@/interface/form";

export const FindStatus05 = ({ formData }: { formData: IOutlineForm }) => {
  let status = "";

  if (formData?.outlineCommitteeStatus === "APPROVED" && formData?.instituteCommitteeStatus === "APPROVED") {
    status = "approve";
  } else if (
    formData?.outlineCommitteeStatus === "NOT_APPROVED" ||
    formData?.instituteCommitteeStatus === "NOT_APPROVED"
  ) {
    status = "notApprove";
  } else if (formData?.outlineCommitteeStatus === null || formData?.instituteCommitteeStatus === null) {
    status = "waiting";
  }

  return (
    <>
      {status != "" && status === "approve" ? (
        <div className="w-24 text-center text-green-500  rounded-xl border-2 border-green-400 py-1">อนุมัติ</div>
      ) : status === "waiting" ? (
        <div className="w-24 text-center text-yellow-500  rounded-xl border-2 border-yellow-400 py-1">รอดำเนินการ</div>
      ) : status == "notApprove" ? (
        <div className="w-24 text-center text-red-500  rounded-xl border-2 border-red-400 py-1">ไม่อนุมัติ</div>
      ) : null}
    </>
  );
};
