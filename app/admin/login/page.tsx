"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCsrfToken } from "next-auth/react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    getCsrfToken().then(setCsrfToken);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");

      const form = e.currentTarget;
      const data = new FormData(form);
      data.set("csrfToken", csrfToken);
      data.set("callbackUrl", "/admin/dashboard");
      data.set("json", "true");

      try {
        const res = await fetch("/api/auth/callback/credentials", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams(data as unknown as Record<string, string>),
          redirect: "manual",
        });

        if (res.type === "opaqueredirect" || res.status === 302 || res.status === 303) {
          router.push("/admin/dashboard");
        } else {
          const body = await res.json().catch(() => ({}));
          if (body.url) {
            router.push("/admin/dashboard");
          } else {
            setError("Invalid email or password");
          }
        }
      } catch {
        setError("Invalid email or password");
      }
    },
    [csrfToken, router]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-surface p-8 rounded-2xl shadow-lg border border-border w-full max-w-md">
        <h1 className="text-2xl font-bold text-heading text-center mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Email" name="email" type="email" required placeholder="admin@buildco.com" />
          <Input label="Password" name="password" type="password" required placeholder="••••••••" />
          <input type="hidden" name="csrfToken" value={csrfToken} />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" variant="primary" className="w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
