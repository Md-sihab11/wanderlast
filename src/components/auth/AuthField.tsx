import type { ComponentProps, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "cn";

type AuthFieldProps = ComponentProps<typeof Input> & {
  id: string;
  label: string;
  icon: ReactNode;
};

/* Label + icon-prefixed input, as used on the sign in / sign up forms */
export default function AuthField({
  id,
  label,
  icon,
  className,
  ...props
}: AuthFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id}
           name={props.name ?? id}
          className={cn("h-11 border-input pl-10", className)}
          {...props}
        />
      </div>
    </div>
  );
}
