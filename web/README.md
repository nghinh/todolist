# TodoList

Ứng dụng quản lý task cá nhân: tạo task, đặt hạn/ưu tiên, xem "Hôm nay", gắn task với dự án. Xây bằng [T3 Stack](https://create.t3.gg/) (Next.js, tRPC, Prisma, NextAuth, Tailwind).

## Chạy local

1. **Cài đặt và biến môi trường**

   ```bash
   cd web
   npm install
   cp .env.example .env
   ```

2. **Cấu hình `.env`**

   - `AUTH_SECRET`: tạo bằng `npx auth secret`, paste vào.
   - `DATABASE_URL`: mặc định SQLite `file:./db.sqlite` (đã có trong `.env.example`). Dùng Postgres khi deploy.

3. **Khởi tạo database**

   ```bash
   npx prisma db push
   # hoặc dùng migration: npx prisma migrate dev
   ```

4. **Chạy dev**

   ```bash
   npm run dev
   ```

   Mở [http://localhost:3000](http://localhost:3000). Tạo tài khoản tại "Tạo tài khoản" rồi đăng nhập.

## Scripts

| Lệnh | Mô tả |
|------|--------|
| `npm run dev` | Chạy Next.js dev server |
| `npm run build` | Build production |
| `npm run start` | Chạy server sau khi build |
| `npm run db:generate` | Tạo migration (Prisma) |
| `npm run db:migrate` | Chạy migration (deploy) |
| `npm run db:push` | Đồng bộ schema DB không dùng migration |
| `npm run db:studio` | Mở Prisma Studio |

## Deploy (Vercel)

1. Push repo lên GitHub, kết nối với Vercel.
2. **Environment variables** trên Vercel:
   - `AUTH_SECRET`: dùng `npx auth secret` tạo giá trị.
   - `DATABASE_URL`: chuỗi kết nối Postgres (Neon, Supabase, Railway, …).
3. Build: Vercel dùng `npm run build` trong thư mục `web` (hoặc root nếu cấu hình).
4. Sau lần deploy đầu: chạy migration trên DB production (từ máy local với `DATABASE_URL` production, hoặc qua script/post-deploy):
   ```bash
   npx prisma migrate deploy
   ```

## Công nghệ

- [Next.js](https://nextjs.org) (App Router)
- [NextAuth](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [tRPC](https://trpc.io)
- [Tailwind CSS](https://tailwindcss.com)
