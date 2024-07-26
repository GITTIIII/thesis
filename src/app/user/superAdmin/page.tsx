"use client"
import axios from "axios";
import { IComprehensiveExamCommitteeForm, IOutlineForm } from "@/interface/form";
import { IUser } from "@/interface/user";
import { use, useEffect, useState } from "react";

async function getAll01Form() {
	const res = await fetch("/api/01ComprehensiveExamCommitteeForm");
	return res.json();
}

const data = getAll01Form();

export default function Dashboard() {
	// const [demo, setUserData] = useState<IComprehensiveExamCommitteeForm[]>([]);
	const demo: IComprehensiveExamCommitteeForm = use(data);
	// useEffect(() => {
	// 	async function fetchData() {
	// 		const data = await getAll01Form();
	// 		setUserData(data);
	// 	}
	// 	fetchData();
	// }, []);

	return (
		<div>
			{demo?.map((data) => (
				<div key={data.id}>
					<div>{data.committeeName1}</div>
				</div>
			))}
		</div>
	);
}
