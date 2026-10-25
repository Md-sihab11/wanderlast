'use client'
import Image from "next/image";
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@base-ui/react";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Destinations", href: "/destinations" },
  { label: "Add Destination", href: "/add-destination" },
  { label: "My Bookings", href: "/my-bookings" },
];

const authLinks = [
  { label: "Login", href: "/sign-in" },
  { label: "Sign Up", href: "/sign-up" },
];

export default function Navbar() {

  const { data: session } = authClient.useSession()
  console.log(session)

  const HandleSignOut = async () => {
    await authClient.signOut();
  }

  return (
    <header className="relative flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 md:px-12">
      {/* Left: primary navigation */}
      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={`text-sm font-medium transition-colors hover:text-cyan-600 ${link.active
              ? "border-b-2 border-cyan-600 pb-1 text-cyan-600"
              : "text-foreground"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Center: logo */}
      <Link href="/" className="absolute left-1/2 -translate-x-1/2">
        <Image
          src="/images/Wanderlast.png"
          alt="Wanderlust"
          width={162}
          height={24}
          className="h-7 w-auto"
        />
      </Link>

      {/* Right: profile & auth */}
      <div className="flex items-center gap-6">
        {session?.user ? (
          <>
            <Link
              href="/profile"
              className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-cyan-600"
            >
              <User className="size-4" />
              Profile
            </Link>
            <Button
              onClick={HandleSignOut}
              className="flex items-center gap-1.5"
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </>
        ) : (
          authLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-cyan-600"
            >
              {link.label}
            </Link>
          ))
        )}
      </div>
    </header>
  );
}
