import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "./db";
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session:{
        strategy: "jwt"
    },
    pages:{
        signIn: "/sign-in",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text"},
                password: { label: "Password", type: "password"}
            },
            async authorize(credentials) {
                if(!credentials?.username || !credentials?.password) {
                    throw new Error('ไม่ได้ระบุ "ชื่อผู้ใช้" หรือ "รหัสผ่าน"');
                }
                
                const existingUser = await db.user.findUnique({
                    where:{ username: credentials?.username}
                })

                if(!existingUser){
                    throw new Error('ไม่พบชื่อผู้ใช้');
                }
            
                const passwordMatch = await compare(credentials.password, existingUser.password);

                if(!passwordMatch){
                    throw new Error('รหัสผ่านไม่ถูกต้อง');
                }

                return {
                    id: `${existingUser.id}`,
                    username: existingUser.username,
                    email: existingUser.email,
                    role: existingUser.role,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                return{
                    ...token,
                    username: user.username,
                    role: user.role,
                }
            }
            return token
        },
        async session({ session, token, user }) {
            return{
                ...session,
                user:{
                    ...session.user,
                    username: token.username,
                    role: token.role,
                }
                
            }
            return session
        },
    },
}