"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { signIn } from "~/server/auth";
import { db } from "~/server/db";

const SALT_ROUNDS = 10;

export type SignUpResult =
  | { ok: true }
  | { ok: false; error: string };

export async function signUp(
  email: string,
  password: string,
): Promise<SignUpResult> {
  const trimmedEmail = email.trim().toLowerCase();
  if (!trimmedEmail || !password) {
    return { ok: false, error: "Email và mật khẩu không được để trống." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Mật khẩu cần ít nhất 8 ký tự." };
  }

  try {
    const existing = await db.user.findUnique({
      where: { email: trimmedEmail },
    });
    if (existing) {
      return { ok: false, error: "Email này đã được đăng ký." };
    }

    const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);
    await db.user.create({
      data: {
        email: trimmedEmail,
        name: trimmedEmail.split("@")[0] ?? trimmedEmail,
        passwordHash,
      },
    });

    const result = await signIn("credentials", {
      email: trimmedEmail,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { ok: false, error: result.error };
    }
    if (!result?.ok) {
      return { ok: false, error: "Đăng nhập sau khi tạo tài khoản thất bại." };
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    if (message.includes("reach") || message.includes("P1001") || message.includes("connection"))
      return { ok: false, error: "Không kết nối được database. Trên Vercel dùng DATABASE_URL có Connection pooling (Supabase: port 6543)." };
    if (message.includes("does not exist") || message.includes("P2021") || message.includes("relation"))
      return { ok: false, error: "Bảng chưa có trên database. Chạy: cd web && npx prisma db push (với DATABASE_URL production)." };
    if (message.length <= 150 && !message.includes("password") && !message.includes("secret"))
      return { ok: false, error: message };
    return { ok: false, error: "Không thể tạo tài khoản. Kiểm tra kết nối database hoặc thử lại sau." };
  }

  redirect("/tasks?onboarding=1");
}

export async function signUpFormAction(
  _prev: SignUpResult | null,
  formData: FormData,
): Promise<SignUpResult> {
  const email = (formData.get("email") as string) ?? "";
  const password = (formData.get("password") as string) ?? "";
  return signUp(email, password);
}
