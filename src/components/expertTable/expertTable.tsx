import React from "react";
import { Table, TableHeader, TableColumn, Pagination, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";
import { IExpert } from "@/interface/expert";
import useSWR from "swr";
import { useToast } from "../ui/use-toast";

const columns = [
  { key: "index", label: "No." },
  { key: "prefix", label: "Prefix" },
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "actions", label: "Actions" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ExpertTable() {
  const { data: expertData, error } = useSWR<IExpert[]>("/api/expert", fetcher);
  const { toast } = useToast();
  const [page, setPage] = React.useState(1);
  const [filterValue, setFilterValue] = React.useState("");
  const rowsPerPage = 30;

  if (error) return <div>Failed to load experts</div>;
  if (!expertData) return <div>Loading...</div>;

  const pages = Math.ceil(expertData.length / rowsPerPage);

  const getItems = () => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return expertData.slice(start, end);
  };

  const getFilteredItems = () => {
    if (!filterValue) return getItems();
  
    return getItems().filter((item) =>
      item.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
      item.lastName.toLowerCase().includes(filterValue.toLowerCase())
    );
  };
  
  const filteredItems = getFilteredItems();

  const handleCopy = (prefix: string, firstName: string, lastName: string) => {
    const textToCopy = `${prefix} ${firstName} ${lastName}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Success",
        description: "คัดลอกสำเร็จ",
        variant: "default",
        duration: 1000,
      });
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
    });
  };

  const onSearchChange = (value?: string) => {
    setFilterValue(value || "");
    setPage(1);
  };

  return (
    <div className="w-full">
      <div className="flex items-center mb-4">
        <Input
          isClearable
          placeholder="Search by first or last name..."
          value={filterValue}
          onValueChange={onSearchChange}
          className="border border-gray-300 rounded-md shadow-sm focus:border-[#A67436] focus:ring-[#A67436] transition duration-150 ease-in-out w-full md:w-1/3"
        />
      </div>
      <Table
        aria-label="Example table with client side pagination"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page: number) => setPage(page)}
            />
          </div>
        }
        className="w-full border border-[#E0E0E0] rounded-lg shadow-md min-h-[222px]"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              className={`bg-gray-100 text-left px-4 py-2 text-gray-700 uppercase text-sm font-medium ${
                column.key === "actions" ? "w-24 text-center" : ""
              }`}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody>
          {filteredItems.map((item, rowIndex) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <TableCell key={column.key} className="px-4 py-2 border-t border-gray-200 text-gray-800">
                  {column.key === "index" ? (
                    (page - 1) * rowsPerPage + rowIndex + 1 // คำนวณลำดับที่แสดงในตาราง
                  ) : column.key === "actions" ? (
                    <button
                      onClick={() => handleCopy(item.prefix, item.firstName, item.lastName)}
                      className="px-2 py-1 bg-[#A67436] text-white rounded text-xs"
                    >
                      Copy
                    </button>
                  ) : (
                    item[column.key as keyof IExpert]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
