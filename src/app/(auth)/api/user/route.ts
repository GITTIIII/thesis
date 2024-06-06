import { db } from "@/lib/db";
import { hash } from "bcrypt"
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try{
        const body = await req.json();
        const { 
            firstName,
            lastName,
            username, 
            password,
            school,
            institute,
            role,
            sex,
            phone,
            email } = body;

        //check if username already exists
        const existUsername = await db.user.findUnique({
            where:{ username: username}
        });

        if(existUsername){
            return NextResponse.json({ user:null, message: "username already exists"}, { status: 409})
        }

        //check if email already exists
        const existEmail = await db.user.findUnique({
            where:{ email: email}
        });

        if(existEmail){
            return NextResponse.json({ user:null, message: "email already exists"}, { status: 409})
        }

        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data:{
                firstName,
                lastName,
                username,
                password: hashedPassword,
                school,
                institute,
                role,
                sex,
                phone,
                email,
            }
        })

        const { password: newUserPassword, ...rest } = newUser

        return NextResponse.json({ user: rest, message:"User Created"}, {status: 201});
    } catch(error){
        return NextResponse.json({ message:"Something wrong!"}, {status: 500});
    }
}