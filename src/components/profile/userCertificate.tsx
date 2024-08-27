"use client";
import axios from "axios";
import Image from "next/image";
import qs from "query-string";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useSWRConfig } from "swr";
import Link from "next/link";
import pdfIcon from "@/../../public/asset/pdf.png";
import pngIcon from "@/../../public/asset/png.png";
import jpgIcon from "@/../../public/asset/jpg.png";
import EditCertificate from "./editCertificate";
import { ICertificate } from "@/interface/certificate";
import { IUser } from "@/interface/user";

const UserCertificate = ({ user, certificateType }: { user: IUser | undefined; certificateType: string }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const { toast } = useToast();
	const { mutate } = useSWRConfig();
	const router = useRouter();

	const handleDeleteCertificate = async (certificateID: Number) => {
		if (!certificateID) return;
		setLoading(true);

		const url = qs.stringifyUrl({
			url: `/api/deleteCertificateById/${certificateID}`,
		});
		const res = await axios.delete(url);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "ลบไฟล์แล้ว",
				variant: "default",
			});
			router.refresh();
			mutate("/api/getCurrentUser");
			setLoading(false);
		} else {
			toast({
				title: "Error",
				description: res.statusText,
				variant: "destructive",
			});
			setLoading(false);
		}
	};

	return (
		<>
			<EditCertificate user={user} certificateType={certificateType} />
			{user &&
				user.certificate
					.filter((certificate: ICertificate) => certificate.certificateType === certificateType)
					.map((certificate: ICertificate) => (
						<div key={certificate.id} className="flex">
							{certificate.fileName ? (
								<>
									<div className="w-full h-max my-2 flex justify-start items-center rounded-lg p-4 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground">
										{certificate.fileType === "image/jpeg" && (
											<Image
												src={jpgIcon}
												width={32}
												height={32}
												style={{
													width: "auto",
													height: "auto",
												}}
												alt="jpeg"
											/>
										)}
										{certificate.fileType === "application/pdf" && (
											<Image
												src={pdfIcon}
												width={32}
												height={32}
												style={{
													width: "auto",
													height: "auto",
												}}
												alt="pdf"
											/>
										)}
										{certificate.fileType === "image/png" && (
											<Image
												src={pngIcon}
												width={32}
												height={32}
												style={{
													width: "auto",
													height: "auto",
												}}
												alt="png"
											/>
										)}
										<Link
											href={`/api/getFileUrl/${certificate.fileName}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm hover:text-[#F26522] hover:cursor-pointer hover:underline ml-2"
										>
											{certificate.fileName}
										</Link>
										<div className="ml-auto">
											<Button
												disabled={loading}
												type="button"
												variant="outline"
												onClick={() => handleDeleteCertificate(certificate.id)}
											>
												<Trash2 width={18} height={18} />
											</Button>
										</div>
									</div>
								</>
							) : null}
						</div>
					))}
		</>
	);
};

export default UserCertificate;
