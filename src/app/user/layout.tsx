import Navbar from "@/components/navbar/navbar";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

type menuItem = {
	menuItem: string;
	path: string;
};

let menu: menuItem[] = [];

const Layout = async ({ children }: { children: React.ReactNode }) => {
	const session = await getServerSession(authOptions);

	if (session?.user.role == "STUDENT") {
		menu = [
			{ menuItem: "Profile", path: "/user/profile" },
			{ menuItem: "Table", path: "/user/table" },
		];
	} else if (
		session?.user.role == "ADMIN" ||
		session?.user.role == "COMMITTEE"
	) {
		menu = [
			{ menuItem: "Profile", path: "/user/profile" },
			{ menuItem: "Table", path: "/user/table" },
		];
	} else if (session?.user.role == "SUPER_ADMIN") {
		menu = [
			{ menuItem: "Profile", path: "/user/profile" },
			{ menuItem: "Table", path: "/user/table" },
		];
	}

	return (
		<>
			<Navbar menu={menu} />
			{children}
		</>
	);
};
export default Layout;
