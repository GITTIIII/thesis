import { Payment, columns } from "./columns";
import { DataTable } from "./dataTable";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "manazone@example.com",
    },
    {
      id: "3409vsdflg",
      amount: 3000,
      status: "pending",
      email: "pluton@example.com",
    },
    {
      id: "qdqwj234",
      amount: 4500,
      status: "pending",
      email: "pungtonk@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "manazone@example.com",
    },
    {
      id: "3409vsdflg",
      amount: 3000,
      status: "pending",
      email: "pluton@example.com",
    },
    {
      id: "qdqwj234",
      amount: 4500,
      status: "pending",
      email: "pungtonk@example.com",
    },
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "manazone@example.com",
    },
    {
      id: "3409vsdflg",
      amount: 3000,
      status: "pending",
      email: "pluton@example.com",
    },
    {
      id: "qdqwj234",
      amount: 4500,
      status: "pending",
      email: "pungtonk@example.com",
    },
  ];
}

export default async function FormDashborad() {
  const data = await getData();
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
