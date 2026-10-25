
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";

import AuthShell from "@/components/auth/AuthShell";
import AuthField from "@/components/auth/AuthField";
import GoogleButton from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirm-password") ?? ""
    );

    setErrorMessage("");
    setSuccessMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
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

    setLoading(true);

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/sign-in",
      });

      if (error) {
        console.error("Signup error:", error);
        setErrorMessage(error.message || "Signup failed");
        return;
      }

      console.log("Signup successful:", data);

      setSuccessMessage("Account created successfully!");

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
      title="Create Account"
      subtitle="Start your adventure with Wanderlust"
      footer={
        <>
          Already have an account?{" "}
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
          id="name"
          name="name"
          label="Full Name"
          type="text"
          autoComplete="name"
          placeholder="Enter your name"
          icon={<User className="size-4" />}
          required
        />

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
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p role="status" className="text-sm text-green-600">
            {successMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="mt-1 h-11 w-full bg-cyan-600! text-white hover:bg-cyan-700!"
        >
          {loading ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      <p className="my-5 text-center text-sm text-muted-foreground">
        Or sign up with
      </p>

      <GoogleButton />
    </AuthShell>
  );
}
