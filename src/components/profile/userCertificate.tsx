"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { ICertificate } from "@/interface/certificate";
import { IUser } from "@/interface/user";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import qs from "query-string";
import pdfIcon from "@/../../public/asset/pdf.png";
import pngIcon from "@/../../public/asset/png.png";
import jpgIcon from "@/../../public/asset/jpg.png";
import EditCertificate from "./editCertificate";

const UserCertificate = ({
	user,
	certificateType,
	canUpload,
}: {
	user: IUser | undefined;
	certificateType: string;
	canUpload: boolean;
}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const { toast } = useToast();
	const router = useRouter();

	const handleDeleteCertificate = async (certificateID: Number) => {
		if (!certificateID) return;
		setLoading(true);

		const url = qs.stringifyUrl({
			url: process.env.NEXT_PUBLIC_URL + `/api/deleteCertificateById/${certificateID}`,
		});
		const res = await axios.delete(url);
		if (res.status === 200) {
			toast({
				title: "Success",
				description: "ลบไฟล์แล้ว",
				variant: "default",
			});
			router.refresh();
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

	const filteredCertificates =
		user?.certificate?.filter((certificate: ICertificate) => certificate.certificateType === certificateType) || [];

	return (
		<>
			{canUpload && <EditCertificate user={user} certificateType={certificateType} />}
			{user && user.certificate && filteredCertificates.length > 0
				? filteredCertificates.map((certificate: ICertificate) => (
						<div key={certificate.id}>
							{certificate.fileName ? (
								<>
									<div className="w-full h-max mb-2 flex justify-start items-center rounded-md p-4 border border-input shadow bg-background hover:bg-accent hover:text-accent-foreground">
										{certificate.fileType === "image/jpeg" && (
											<Image
												src={jpgIcon}
												width={28}
												height={28}
											
												alt="jpeg"
											/>
										)}
										{certificate.fileType === "application/pdf" && (
											<Image
												src={pdfIcon}
												width={28}
												height={28}
												
												alt="pdf"
											/>
										)}
										{certificate.fileType === "image/png" && (
											<Image
												src={pngIcon}
												width={28}
												height={28}
												
												alt="png"
											/>
										)}
										<Link
											href={process.env.NEXT_PUBLIC_URL + `/api/getFileUrl/${certificate.fileName}`}
											target="_blank"
											rel="noopener noreferrer"
											className="text-sm overflow-hidden hover:text-[#F26522] hover:cursor-pointer hover:underline ml-2"
										>
											{certificate.fileName}
										</Link>
										{canUpload && (
											<div className="ml-auto">
												<Button
													disabled={loading}
													type="button"
													variant="outline"
													onClick={() => handleDeleteCertificate(certificate.id)}
												>
													<Trash2 width={20} height={20} />
												</Button>
											</div>
										)}
									</div>
								</>
							) : null}
						</div>
				  ))
				: null}
		</>
	);
};

export default UserCertificate;
