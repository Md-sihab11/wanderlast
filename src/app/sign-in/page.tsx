
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import GoogleButton from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const HandleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const user = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    if (!user.email || !user.password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.signIn.email({
        email: user.email,
        password: user.password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(
          error.message || "Invalid email or password."
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setErrorMessage(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Resume your adventure with Wanderlust"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
          >
            Sign Up
          </Link>
        </>
      }
    >
      <form onSubmit={HandleSubmit} className="space-y-4">
        <AuthField
          id="email"
          name="email"
          label="Email Address"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          icon={<Mail className="size-4" />}
          required
        />

        <AuthField
          id="password"
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          icon={<Lock className="size-4" />}
          required
        />

        <div className="flex items-center justify-between">
          <Label
            htmlFor="remember"
            className="gap-2 font-normal"
          >
            <Checkbox id="remember" name="remember" />
            Remember me
          </Label>

          <Link
            href="/forgot-password"
            className="text-sm font-medium text-cyan-600 transition-colors hover:text-cyan-700"
          >
            Forgot password?
          </Link>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-md bg-red-50 p-3 text-sm text-red-600"
          >
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-cyan-600! text-white hover:bg-cyan-700!"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="my-5 text-center text-sm text-muted-foreground">
        Or continue with
      </p>

      <GoogleButton />
    </AuthShell>
  );
}
