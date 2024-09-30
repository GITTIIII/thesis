import { Input } from "../ui/input";

interface SearchProps {
	studentID: string;
	setStudentID: (id: string) => void;
}

export const Search = ({ studentID, setStudentID }: SearchProps) => {
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStudentID(e.target.value);
	};
	return <Input className="bg-white ml-4" placeholder="ค้นหาด้วยรหัสนักศึกษา" value={studentID} onChange={handleInputChange} />;
};
