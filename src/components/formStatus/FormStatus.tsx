const FormStatus = ({ formStatus }: { formStatus: string }) => {


  
	return (
		<>
			{formStatus != "" && formStatus === "อนุมัติ" ? (
				<div className="w-24 text-center text-green-500  rounded-xl border-2 border-green-400 py-1">อนุมัติ</div>
			) : formStatus === "รอดำเนินการ" ? (
				<div className="w-24 text-center text-yellow-500  rounded-xl border-2 border-yellow-400 py-1">รอดำเนินการ</div>
			) : formStatus === "เเก้ไข" ? (
				<div className="w-24 text-center text-yellow-500  rounded-xl border-2 border-yellow-400 py-1">เเก้ไข</div>
			) : formStatus == "ไม่อนุมัติ" ? (
				<div className="w-24 text-center text-red-500  rounded-xl border-2 border-red-400 py-1">ไม่อนุมัติ</div>
			) : null}
		</>
	);
};

export default FormStatus;
