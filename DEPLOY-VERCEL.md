# Deploy TodoList lên Vercel

## 1. Chuẩn bị database (Production)

Vercel chạy serverless, **không dùng SQLite**. Bạn cần Postgres (miễn phí có thể dùng):

- [Neon](https://neon.tech) — tạo project → copy **Connection string**
- [Supabase](https://supabase.com) — Project Settings → Database → **Connection string** (URI)
- [Railway](https://railway.app) — tạo Postgres → copy `DATABASE_URL`

Sau khi có `DATABASE_URL` (Postgres). **Supabase:** thêm `?sslmode=require` vào cuối URL nếu cần.

Đồng bộ schema lên DB (trong thư mục `web`, thay `YOUR_DATABASE_URL` bằng URL thật):

```powershell
cd web
$env:DATABASE_URL="YOUR_DATABASE_URL"
npx prisma db push
```

(Nếu đã có migration: `npx prisma migrate deploy`.)

## 2. Deploy từ Vercel Dashboard (khuyến nghị)

1. Vào [vercel.com](https://vercel.com), đăng nhập (dùng GitHub).
2. **Add New** → **Project** → Import repo **nghinh/todolist**.
3. **Root Directory:** phải đặt là **`web`** (app Next.js nằm trong thư mục `web`). Cách tìm:
   - Vào project → **Settings** (sidebar trái).
   - Chọn **Build and Deployment** (mục riêng, **không** phải General).
   - Kéo xuống tới **Root Directory** → bấm **Edit** → nhập **`web`** → **Save**.
4. **Environment Variables:** Settings → Environment Variables — thêm:
   - `AUTH_SECRET`: chạy `npx auth secret` (trong thư mục `web`) hoặc tạo chuỗi bí mật bất kỳ (ví dụ 32 ký tự).
   - `DATABASE_URL`: connection string Postgres (có `?sslmode=require` nếu dùng Neon/Supabase).
5. Bấm **Deploy** (hoặc Deployments → Redeploy). Đợi build xong, bạn sẽ có link dạng `https://todolist-xxx.vercel.app`.

## 3. (Tùy chọn) Deploy bằng Vercel CLI

```bash
cd web
npm i -g vercel
vercel login
vercel
```

Khi hỏi, chọn link với repo hiện tại hoặc tạo project mới. Sau đó thêm biến môi trường trong Dashboard (Project → Settings → Environment Variables) như bước 2.

## Lưu ý

- **AUTH_SECRET** và **DATABASE_URL** bắt buộc; thiếu một trong hai app có thể lỗi khi chạy (đăng nhập, lưu task). Trên Vercel: Project → Settings → Environment Variables.
- Build cần **NODE_ENV=production** (script `build` đã dùng `cross-env NODE_ENV=production next build`; Vercel tự set sẵn).
- **Supabase + Vercel:** Nếu gặp lỗi "Something went wrong" hoặc lỗi kết nối, dùng **Connection pooling** thay vì kết nối trực tiếp: Supabase Dashboard → Project Settings → Database → **Connection string** → chọn **"Use connection pooling"** (hoặc URI có port **6543** và host `pooler.supabase.com`). Dán URI đó vào `DATABASE_URL` trên Vercel rồi redeploy.
- Đã chạy `prisma migrate deploy` (hoặc `prisma db push`) lên DB production trước khi deploy lần đầu.
- Nếu đổi DB hoặc schema, chạy lại `prisma migrate deploy` với `DATABASE_URL` production rồi redeploy.
- **Đăng ký lỗi:** Form sẽ hiển thị lỗi cụ thể (kết nối DB, bảng chưa có, v.v.). Xem thêm Vercel → Deployments → chọn deployment → **Functions** / **Logs** để thấy exception khi submit form đăng ký.
