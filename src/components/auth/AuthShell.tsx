import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
};

/* Shared centred layout for the sign in / sign up screens: heading, card and footer line */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-14">
      <header className="w-full max-w-md text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-muted-foreground">{subtitle}</p>
      </header>

      <div className="mt-8 w-full max-w-md rounded-xl border bg-card p-6 shadow-sm">
        {children}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </p>
      </div>
    </main>
  );
}
