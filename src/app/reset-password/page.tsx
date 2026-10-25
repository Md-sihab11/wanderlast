"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "This reset link is missing or invalid. Request a new one."
  );
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirm-password") ?? "");

    setErrorMessage("");
    setSuccessMessage("");

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both fields.");
      return;
    }
    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!token) {
      setErrorMessage("This reset link is missing or invalid.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        token,
        newPassword: password,
      });

      if (error) {
        setErrorMessage(error.message || "Could not reset the password.");
        return;
      }

      setSuccessMessage("Password updated. Redirecting to sign in...");
      router.push("/sign-in");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Set New Password"
      subtitle="Choose a new password for your Wanderlust account"
      footer={
        <>
          Back to{" "}
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
          id="password"
          name="password"
          label="New Password"
          type="password"
          autoComplete="new-password"
          placeholder="Create a password"
          icon={<Lock className="size-4" />}
          required
        />

        <AuthField
          id="confirm-password"
          name="confirm-password"
          label="Confirm Password"
          type="password"
          autoComplete="new-password"
          placeholder="Confirm your password"
          icon={<Lock className="size-4" />}
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
          disabled={loading || !token}
          className="h-11 w-full bg-cyan-600! text-white hover:bg-cyan-700!"
        >
          {loading ? "Updating..." : "Reset Password"}
        </Button>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
