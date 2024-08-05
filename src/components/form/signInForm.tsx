"use client";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
	username: z.string().min(1, { message: "กรุณากรอกชื่อผู้ใช้" }),
	password: z.string().min(1, { message: "กรุณากรอกรหัสผ่าน" }),
});

const SignInForm = () => {
	const router = useRouter();
	const { toast } = useToast();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		const signInData = await signIn("credentials", {
			username: values.username,
			password: values.password,
			redirect: false,
		});

		if (signInData?.error) {
			toast({
				title: "Error",
				description: signInData?.error,
				variant: "destructive",
			});
		} else {
			toast({
				title: "Success",
				description: "เข้าสู่ระบบสำเร็จ",
				variant: "default",
			});
			const session = await getSession();
			if (session?.user.role == "STUDENT") {
				router.push("/user/student");
			} else if (session?.user.role == "ADMIN") {
				router.push("/user/table");
			} else if (session?.user.role == "SUPER_ADMIN") {
				router.push("/user/superAdmin");
			}
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-3/4 sm:w-2/4">
				<div className="text-black mb-4">
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<div className="flex flex-row items-center mb-6 justify-center">
								<FormItem className="w-3/4">
									<FormLabel>ชื่อผู้ใช้</FormLabel>
									<FormControl>
										<Input className="text-sm p-2 w-full rounded-lg" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							</div>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<div className="flex flex-row items-center mb-6 justify-center">
								<FormItem className="w-3/4">
									<FormLabel>รหัสผ่าน</FormLabel>
									<FormControl>
										<Input type="password" autoComplete="true" className="text-sm p-2 w-full rounded-lg" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							</div>
						)}
					/>
				</div>
				<Button disabled={form.formState.isSubmitting} className="bg-[#F26522] w-2/4 mx-auto text-white rounded-xl">
					{form.formState.isSubmitting && <LoaderCircle className="mr-2 animate-spin" />}
					เข้าสู่ระบบ
				</Button>
			</form>
		</Form>
	);
};

export default SignInForm;
