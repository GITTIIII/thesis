"use client";
import AdminTable from "@/components/adminTable/adminTable";
import ExpertTable from "@/components/expertTable/expertTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IExpert } from "@/interface/expert";
import { IUser } from "@/interface/user";

export function DisplayTable({ expertData, adminData }: { expertData: IExpert[]; adminData: IUser[] }) {
	return (
		<Tabs defaultValue="expert" className="w-full h-max">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="expert">ผู้เชี่ยวชาญ</TabsTrigger>
				<TabsTrigger value="admin">บุคลากร</TabsTrigger>
			</TabsList>
			<TabsContent value="expert">
				<Card>
					<CardHeader>
						<CardTitle>ผู้เชี่ยวชาญ</CardTitle>
						<CardDescription>ผู้เชี่ยวชาญ</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<ExpertTable expertData={expertData} />
					</CardContent>
				</Card>
			</TabsContent>
			<TabsContent value="admin">
				<Card>
					<CardHeader>
						<CardTitle>บุคลากร</CardTitle>
						<CardDescription>บุคลากร</CardDescription>
					</CardHeader>
					<CardContent className="space-y-2">
						<AdminTable adminData={adminData} />
					</CardContent>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
