## Environement File
สร้างไฟล์ .env 
มี url ของ Database เเละ Secret สำหรับการทำ Authentication
```bash
DATABASE_URL=
NEXTAUTH_SECRET=
```
cd thesis
## Getting Started
```bash
npm install next 
npm run dev
```
## Prisma Command
```bash
#ใช้ตอนเเก้ใข Schema ต้อง run สองคำสั่ง
npx prisma generate
npx prisma db push

#ใช้เข้า ui ของ prisma
npx prisma studio
```
