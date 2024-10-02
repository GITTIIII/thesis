import { IProcessPlan } from "@/interface/form";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkPlannedWorkSum(data: IProcessPlan[]): [boolean, number] {
  const plannedWorkStep = data.find((item) => item.step === "ปริมาณงานที่วางแผนไว้ (%)");

  // หากพบข้อมูลขั้นตอนที่ต้องการ
  if (plannedWorkStep) {
    // รวมค่าปริมาณงานในแต่ละเดือน
    const totalPlannedWork = plannedWorkStep.months.reduce(
      (acc, month) => acc + month,
      0
    );

    // คืนค่า true และ totalPlannedWork หากผลรวมเป็น 100, หรือ false และ totalPlannedWork หากไม่ครบ
    return [totalPlannedWork === 100, totalPlannedWork];
  }

  // หากไม่พบขั้นตอน "ปริมาณงานที่วางแผนไว้ (%)" คืนค่า [false, 0] เพื่อบ่งบอกว่าไม่พบข้อมูล
  return [false, 0];
}
