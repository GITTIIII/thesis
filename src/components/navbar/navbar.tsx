"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Img from "../../../public/asset/images";
import useComponentVisible from "../componentVisible/useComponentVisible";
import { signOut } from "next-auth/react";
import { use } from "react";
import { IUser } from "@/interface/user";
import profile from "@../../../public/asset/profile.png";
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

async function getUser() {
	const res = await fetch("/api/getCurrentUser");
	return res.json();
}

const userPromise = getUser();

const Navbar: React.FC<Props> = ({ menu, notification = false }) => {
	const user: IUser = use(userPromise);
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible();
	const message = [
		{
			topic: "topic 1 ",
			information:
				"ชิพเน็ตบุคโมไบล์ทรานแซกชั่นไลบรารี สแกนบิทแอพพลิเคชั่นโค้ด สเปซสแปมอัพเกรดกูเกิล",
		},
		{
			topic: "topic 2 ",
			information: "บั๊กทวิตเตอร์ โหลดโปรเซสเซอร์พอร์ทโน้ตบุ๊ค ชิพบั๊กดีบั๊ก",
		},
		{
			topic: "topic 3 ",
			information:
				"แฟล็กเคอร์เซอร์เดสก์ท็อปอูบันตู กราฟิกส์ทวีตเวอร์ชันเดลไฟสแปม สกรีนอูบุนตูแพตช์แอพพลิเคชั่น",
		},
	];
	// React.useEffect(() => {
	//   setProfile({
	//     Id: "B6900000",
	//     Name: "กรรณิกา นิกรนนท์",
	//     Avatar: `https://api.dicebear.com/8.x/lorelei/png?seed=${Math.random()}`,
	//   })
	// }, [])

	return (
		<>
			<nav className="flex px-6 h-16 w-full bg-white justify-between items-center shadow top-0 z-40">
				<ul className="flex gap-16 h-full items-center">
					<li>
						<Link href="">
							<Image src={Img["sutLogo"]} alt="" height={54} />
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
				<ul className=" items-center gap-6 flex">
					<li className=" hidden xl:flex">
						{notification && <Notification messages={message} />}
					</li>
					<li className=" hidden md:flex text-gray-700">
						<div>
							{user.role === "STUDENT"
								? `${user?.username}  ${user?.firstName} ${user?.lastName}`
								: `${user?.firstName} ${user?.lastName}`}
						</div>
					</li>
					<li>
						<Link href="">
							<div className="h-12 w-12 rounded-full border-[#6E6D70] content-center items-center overflow-hidden  hidden md:flex animate-fade-up animate-once">
								<Image
									src={user?.profileUrl ? user?.profileUrl : profile}
									width={48}
									height={48}
									alt="Profile"
								/>
							</div>
						</Link>
					</li>
					<li className="hidden xl:block">
						<Link
							href="/"
							onClick={() =>
								signOut({
									redirect: true,
									callbackUrl: `${window.location.origin}`,
								})
							}
						>
							<Logout />
						</Link>
					</li>
					<li
						className="xl:hidden"
						onClick={() => {
							setIsComponentVisible(!isComponentVisible);
						}}
					>
						<Hamburger />
					</li>
				</ul>
			</nav>
			{isComponentVisible && (
				<div ref={ref} className=" absolute text-gray-700 bg-white w-full z-40">
					{menu.map((e, index) => (
						<Link
							key={index}
							className="block px-4 py-2  hover:bg-gray-100 border-b-2 text-center transition-colors duration-200"
							href={e.path}
						>
							{e.menuItem}
						</Link>
					))}
					<Link
						href=""
						className="block px-4 py-2  hover:bg-gray-100 border-b-2 text-center md:hidden transition-colors duration-200"
					>
						{user.role === "STUDENT"
							? `${user?.username}  ${user?.firstName} ${user?.lastName}`
							: `${user?.firstName} ${user?.lastName}`}
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
						Logout
					</Link>
				</div>
			)}
		</>
	);
};
export default Navbar;
const Notification: React.FC<{ messages: Message[] }> = ({ messages }) => {
	const { ref, isComponentVisible, setIsComponentVisible } =
		useComponentVisible();
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
			<svg
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className="h-7 "
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
				<g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				></g>
				<g id="SVGRepo_iconCarrier">
					<path
						d="M12.02 2.90991C8.70997 2.90991 6.01997 5.59991 6.01997 8.90991V11.7999C6.01997 12.4099 5.75997 13.3399 5.44997 13.8599L4.29997 15.7699C3.58997 16.9499 4.07997 18.2599 5.37997 18.6999C9.68997 20.1399 14.34 20.1399 18.65 18.6999C19.86 18.2999 20.39 16.8699 19.73 15.7699L18.58 13.8599C18.28 13.3399 18.02 12.4099 18.02 11.7999V8.90991C18.02 5.60991 15.32 2.90991 12.02 2.90991Z"
						stroke="#6E6D70"
						stroke-width="1.5"
						stroke-miterlimit="10"
						stroke-linecap="round"
					></path>
					<path
						d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
						stroke="#6E6D70"
						stroke-width="1.5"
						stroke-miterlimit="10"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>
					<path
						d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601"
						stroke="#6E6D70"
						stroke-width="1.5"
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
								<p className=" text-sm h-6 truncate ">{msg.information}</p>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

const Logout = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-7 "
		>
			<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
			<g
				id="SVGRepo_tracerCarrier"
				stroke-linecap="round"
				stroke-linejoin="round"
			></g>
			<g id="SVGRepo_iconCarrier">
				<path
					d="M15 16.5V19C15 20.1046 14.1046 21 13 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3H13C14.1046 3 15 3.89543 15 5V8.0625M11 12H21M21 12L18.5 9.5M21 12L18.5 14.5"
					stroke="#6E6D70"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				></path>
			</g>
		</svg>
	);
};
const Hamburger = () => {
	return (
		<>
			<svg
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				stroke="#000000"
				className="h-7 "
			>
				<g id="SVGRepo_bgCarrier" stroke-width="0"></g>
				<g
					id="SVGRepo_tracerCarrier"
					stroke-linecap="round"
					stroke-linejoin="round"
				></g>
				<g id="SVGRepo_iconCarrier">
					<path
						d="M20 7L4 7"
						stroke="#6E6D70"
						stroke-width="1.5"
						stroke-linecap="round"
					></path>
					<path
						d="M20 12L4 12"
						stroke="#6E6D70"
						stroke-width="1.5"
						stroke-linecap="round"
					></path>
					<path
						d="M20 17L4 17"
						stroke="#6E6D70"
						stroke-width="1.5"
						stroke-linecap="round"
					></path>
				</g>
			</svg>
		</>
	);
};
