"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui", background: "#0f172a", color: "#e2e8f0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
        <div style={{ maxWidth: "28rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Đã xảy ra lỗi</h1>
          <p style={{ fontSize: "0.875rem", color: "#94a3b8", marginBottom: "1.5rem" }}>
            Thường do kết nối database hoặc cấu hình. Kiểm tra DATABASE_URL và AUTH_SECRET trên Vercel; với Supabase nên dùng Connection pooling (port 6543).
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/" style={{ padding: "0.5rem 1rem", background: "#f59e0b", color: "#1e293b", borderRadius: "0.75rem", textDecoration: "none", fontWeight: 600 }}>Về trang chủ</a>
            <a href="/auth/signin" style={{ padding: "0.5rem 1rem", border: "1px solid #475569", borderRadius: "0.75rem", color: "#e2e8f0", textDecoration: "none" }}>Đăng nhập</a>
            <button type="button" onClick={() => reset()} style={{ padding: "0.5rem 1rem", border: "1px solid #475569", borderRadius: "0.75rem", background: "transparent", color: "#e2e8f0", cursor: "pointer" }}>Thử lại</button>
          </div>
        </div>
      </body>
    </html>
  );
}
