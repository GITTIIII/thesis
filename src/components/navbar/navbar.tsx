"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import useComponentVisible from "../componentVisible/useComponentVisible";
import sutLogo from "@../../../public/asset/sutLogo.jpg";
import { signOut } from "next-auth/react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Menu, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useSWR from 'swr'
import { useRouter } from "next/navigation";

interface Message {
	topic: string;
	information: string;
}

type Props = {
	menu: {
		menuItem: string;
		path: string;
	}[];
	notification?: boolean;
};

const fetcher = (url: string) => fetch(url).then((res)=> res.json())

export default function Navbar({ menu, notification = false }: Props) {
	const { data: user, isLoading } = useSWR("/api/getCurrentUser", fetcher)
	const router = useRouter()

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible();
	const message = [
		{
			topic: "topic 1 ",
			information: "ชิพเน็ตบุคโมไบล์ทรานแซกชั่นไลบรารี สแกนบิทแอพพลิเคชั่นโค้ด สเปซสแปมอัพเกรดกูเกิล",
		},
		{
			topic: "topic 2 ",
			information: "บั๊กทวิตเตอร์ โหลดโปรเซสเซอร์พอร์ทโน้ตบุ๊ค ชิพบั๊กดีบั๊ก",
		},
		{
			topic: "topic 3 ",
			information: "แฟล็กเคอร์เซอร์เดสก์ท็อปอูบันตู กราฟิกส์ทวีตเวอร์ชันเดลไฟสแปม สกรีนอูบุนตูแพตช์แอพพลิเคชั่น",
		},
	];

	return (
		<div>
			<nav className="w-full h-16 flex justify-between items-center px-6 bg-white shadow top-0 z-40">
				<ul className="flex gap-12 items-center">
					<li>
						<Link href="">
							<Image
								src={sutLogo}
								alt="sutLogo"
								style={{
									width: "256px",
									height: "auto",
								}}
								priority
							/>
						</Link>
					</li>
					{menu.map((e, index) => (
						<li
							key={index}
							className=" hover:border-b-2 hover:border-[#F26522] transition-colors text-gray-700 duration-500 border-b-2 border-b-transparent hidden xl:block"
						>
							<Link href={e.path}>{e.menuItem}</Link>
						</li>
					))}
				</ul>
				<ul className="flex items-center gap-6">
					<li className="hidden xl:flex">{notification && <Notification messages={message} />}</li>
					<li className="hidden md:flex text-gray-700">
						<div>
							{user?.role.toString() === "STUDENT"
								? `${user?.username} ${
										user.formLanguage === "en"
											? `${user?.firstNameEN} ${user?.lastNameEN}`
											: `${user?.firstNameTH} ${user?.lastNameTH}`
								  }`
								: user
								? `${user?.firstNameTH} ${user?.lastNameTH}`
								: ""}
						</div>
					</li>
					<li className="hover:cursor-pointer">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Avatar>
									<AvatarImage src={user?.profileUrl} alt="Profile" />
									<AvatarFallback><User /></AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={()=> router.push("/user/profile")}>โปรไฟล์</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={() =>
										signOut({
											redirect: true,
											callbackUrl: `${window.location.origin}`,
										})
									}
								>
									ออกจากระบบ
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</li>
					<li
						className="xl:hidden"
						onClick={() => {
							setIsComponentVisible(!isComponentVisible);
						}}
					>
						<Menu />
					</li>
				</ul>
			</nav>
			{isComponentVisible && (
				<div ref={ref} className="absolute text-gray-700 bg-white w-full z-40">
					{menu.map((e, index) => (
						<Link
							key={index}
							className="block px-4 py-2 hover:bg-gray-100 border-b-2 text-center transition-colors duration-200"
							href={e.path}
						>
							{e.menuItem}
						</Link>
					))}
					<Link
						href=""
						className="block px-4 py-2  hover:bg-gray-100 border-b-2 text-center md:hidden transition-colors duration-200"
					>
						{user?.role.toString() === "STUDENT"
							? `${user?.username} ${
									user.formLanguage === "th"
										? `${user?.firstNameTH} ${user?.lastNameTH}`
										: `${user?.firstNameEN} ${user?.lastNameEN}`
							  }`
							: user
							? `${user?.firstNameTH} ${user?.lastNameTH}`
							: ""}
					</Link>
					<Link
						href="/"
						onClick={() =>
							signOut({
								redirect: true,
								callbackUrl: `${window.location.origin}`,
							})
						}
						className="block px-4 py-2  hover:bg-gray-100 border-b-2 text-center transition-colors duration-200"
					>
						ออกจากระบบ
					</Link>
				</div>
			)}
		</div>
	);
}

const Notification: React.FC<{ messages: Message[] }> = ({ messages }) => {
	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible();
	return (
		<div
			className=" relative inline-block"
			onClick={() => {
				setIsComponentVisible(!isComponentVisible);
			}}
		>
			<span className="absolute flex h-2 w-2 right-[3px] top-[2px]">
				<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F26522] opacity-75"></span>
				<span className="relative inline-flex rounded-full h-2 w-2 bg-[#F26522]"></span>
			</span>
			<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-7 ">
				<g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
				<g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
				<g id="SVGRepo_iconCarrier">
					<path
						d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
						stroke="#6E6D70"
						strokeWidth="1.5"
						stroke-miterlimit="10"
						strokeLinecap="round"
					></path>
					<path
						d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
						stroke="#6E6D70"
						strokeWidth="1.5"
						stroke-miterlimit="10"
						strokeLinecap="round"
						strokeLinejoin="round"
					></path>
					<path
						d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601"
						stroke="#6E6D70"
						strokeWidth="1.5"
						stroke-miterlimit="10"
					></path>
				</g>
			</svg>
			{isComponentVisible && (
				<div
					ref={ref}
					className="origin-top-right absolute right-0 mt-2 w-[500px] p-2 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
				>
					<ul>
						{messages.map((msg: Message, index: number) => (
							<li
								key={index}
								className="block px-4 py-2 transition-colors duration-200 text-gray-700 hover:bg-gray-100"
							>
								<h3>{msg.topic}</h3>
								<p className="text-sm h-6 truncate">{msg.information}</p>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
