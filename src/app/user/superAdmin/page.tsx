import axios from "axios";
import { IComprehensiveExamCommitteeForm } from "@/interface/form";

async function get01Form(): Promise<IComprehensiveExamCommitteeForm[]> {
  const res = await axios.get(`/api/01ComprehensiveExamCommitteeForm`);
  if (res.status != 200) {
    console.error("Error fetching data:", res.status);
    throw new Error("Cannot fetch data!");
  } else {
    return res.data as IComprehensiveExamCommitteeForm[];
  }
}

export default async function Dashboard() {
  try {
    const demo = await get01Form();
    return (
      <div>
        {demo.map((data: IComprehensiveExamCommitteeForm) => (
          <div key={data.id}>
            <div>{data.committeeName1}</div>
          </div>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error rendering component:", error);
    return <div>Error rendering component!</div>;
  }
}
