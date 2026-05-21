"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    const res = await signIn("credentials", {
      email: data.get("email") as string,
      password: data.get("password") as string,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded-2xl shadow-lg border border-border w-full max-w-md">
        <h1 className="text-2xl font-bold text-heading text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email" name="email" type="email" required placeholder="admin@buildco.com" />
          <Input label="Password" name="password" type="password" required placeholder="••••••••" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" variant="primary" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
