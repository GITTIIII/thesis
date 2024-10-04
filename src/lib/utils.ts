import { IProcessPlan } from "@/interface/form";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkPlannedWorkSum(data: IProcessPlan[]): [boolean, number] {
  const plannedWorkStep = data.find((item) => item.step === "ปริมาณงานที่วางแผนไว้ (%)");

  if (plannedWorkStep) {
    const totalPlannedWork = plannedWorkStep.months.reduce(
      (acc, month) => acc + month,
      0
    );

    return [totalPlannedWork === 100, totalPlannedWork];
  }

  return [false, 0];
}
export const checkForZero = (data: IProcessPlan[]) => {
  const stepToCheck = "ปริมาณงานที่วางแผนไว้ (%)";

  const step = data.find((item) => item.step === stepToCheck);

  if (step) {
    return step.months.includes(0);
  } else {
    return false;
  }
};
