import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { authClient } from "@/lib/auth-client";

export default function GoogleButton({
  label = "Sign Up With Google",
}: {
  label?: string;
}) {

  const handleSocialLogin = async (provider: "google") => {
    await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
  };

  return (
    <Button
      onClick={() => handleSocialLogin("google")}
      type="button"
      variant="outline"
      className="h-11 w-full gap-2.5 text-sm font-medium"
    >
      <GoogleIcon className="size-4.5" />
      {label}
    </Button>
  );
}
