"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
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
    return { ok: false, error: "Email and password are required." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }

  const existing = await db.user.findUnique({
    where: { email: trimmedEmail },
  });
  if (existing) {
    return { ok: false, error: "An account with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
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
    return { ok: false, error: "Sign-in after sign-up failed." };
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
