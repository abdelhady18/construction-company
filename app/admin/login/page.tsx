"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      const form = e.currentTarget;
      const email = form.email.value;
      const password = form.password.value;

      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/admin/dashboard");
        } else {
          setError("Invalid email or password");
        }
      } catch {
        setError("Invalid email or password");
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded-2xl shadow-lg border border-border w-full max-w-md">
        <h1 className="text-2xl font-bold text-heading text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email" name="email" type="email" required placeholder="admin@buildco.com" />
          <Input label="Password" name="password" type="password" required placeholder="••••••••" />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" variant="primary" disabled={loading} className="w-full">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
