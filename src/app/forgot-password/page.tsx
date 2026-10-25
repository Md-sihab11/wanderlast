"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();

    if (!email) {
      setErrorMessage("Email is required.");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const { error } = await authClient.requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setErrorMessage(error.message || "Could not send the reset link.");
        return;
      }

      setSuccessMessage(
        "If an account exists for that email, a reset link has been sent."
      );
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <>
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700"
          >
            Sign In
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        {errorMessage && (
          <p
            role="alert"
            className="rounded-md bg-red-50 p-3 text-sm text-red-600"
          >
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p
            role="status"
            className="rounded-md bg-green-50 p-3 text-sm text-green-700"
          >
            {successMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full bg-cyan-600! text-white hover:bg-cyan-700!"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>
    </AuthShell>
  );
}
