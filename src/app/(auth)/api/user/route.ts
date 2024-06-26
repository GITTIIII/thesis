import { authOptions } from "@/lib/auth";
import { hash } from "bcrypt"
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try{
        const body = await req.json();
        const { 
            firstName,
            lastName,
            username, 
            password,
            email, 
            phone,
            sex,
            education_level,
            school,
            program,
            program_year,
            position,
            role,
            formState,
            signatureUrl,
            profileUrl,
        } = body;

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
                email, 
                phone,
                sex,
                education_level,
                school,
                program,
                program_year,
                position,
                role,
                formState,
                signatureUrl,
                profileUrl,
            }
        })

        const { password: newUserPassword, ...rest } = newUser

        return NextResponse.json({ user: rest, message:"User Created"}, {status: 201});
    } catch(error){
        return NextResponse.json({ message:"Something wrong!"}, {status: 500});
    }
}

export async function GET(){
    const session = await getServerSession(authOptions);
    const username = session?.user.username

    if(!session) {
        return null;
    }

    const user = await db.user.
    findUnique({
        where: {
            username: username
        }
    });

    return NextResponse.json(user);
} 

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const {
            id,
            firstName,
            lastName,
            username,
            password,
            email,
            phone,
            sex,
            education_level,
            school,
            program,
            program_year,
            position,
            role,
            formState,
            signatureUrl,
            profileUrl,
        } = body;
        console.log(body)

        if (!id) {
            return NextResponse.json({ message: "User ID is required for update" }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { id: id }
        });

        if (!existingUser) {
            return NextResponse.json({ user: null, message: "User not found" }, { status: 404 });
        }

        const hashedPassword = password ? await hash(password, 10) : existingUser.password;

        const updatedUser = await db.user.update({
            where: { id: id },
            data: {
                firstName: firstName || existingUser.firstName,
                lastName: lastName || existingUser.lastName,
                username: username || existingUser.username,
                password: hashedPassword,
                email: email || existingUser.email,
                phone: phone || existingUser.phone,
                sex: sex || existingUser.sex,
                education_level: education_level || existingUser.education_level,
                school: school || existingUser.school,
                program: program || existingUser.program,
                program_year: program_year || existingUser.program_year,
                position: position || existingUser.position,
                role: role || existingUser.role,
                formState: formState || existingUser.formState,
                signatureUrl: signatureUrl || existingUser.signatureUrl,
                profileUrl: profileUrl || existingUser.profileUrl,
            }
        });

        const { password: updatedUserPassword, ...rest } = updatedUser;

        return NextResponse.json({ user: rest, message: "User Updated" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 });
    }
}


