import Link from "next/link";
import React from "react";

export default function AdminPage() {
	return (
		<div className="w-full h-full text-center  flex flex-col justify-center">
			<Link href="/user/table">Click Go to Table</Link>
		</div>
	);
}
