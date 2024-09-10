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
			{canUpload && <EditCertificate user={user} certificateType={certificateType} />}
			{user &&
				user.certificate &&
				user.certificate
					.filter((certificate: ICertificate) => certificate.certificateType === certificateType)
					.map((certificate: ICertificate) => (
						<div key={certificate.id}>
							{certificate.fileName ? (
								<>
									<div className="w-full h-max mb-2 flex justify-start items-center rounded-md p-4 border border-input bg-background shadow hover:bg-accent hover:text-accent-foreground">
										{certificate.fileType === "image/jpeg" && (
											<Image
												src={jpgIcon}
												width={28}
												height={28}
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
												width={28}
												height={28}
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
												width={28}
												height={28}
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
											className="text-sm overflow-hidden hover:text-[#F26522] hover:cursor-pointer hover:underline ml-2"
										>
											{certificate.fileName}
										</Link>
										{canUpload && (<div className="ml-auto">
											<Button
												disabled={loading}
												type="button"
												variant="outline"
												onClick={() => handleDeleteCertificate(certificate.id)}
											>
												<Trash2 width={20} height={20} />
											</Button>
										</div>)}
									</div>
								</>
							) : null}
						</div>
					))}
		</>
	);
};

export default UserCertificate;
