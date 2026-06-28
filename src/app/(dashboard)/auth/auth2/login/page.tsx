import { Card } from "@/components/ui/card";
import SocialButtons from "../../authforms/social-buttons";
import AuthLogin from "../../authforms/auth-login";
import Link from "next/link";
import type { Metadata } from "next";
import FullLogo from "@/app/(dashboard)/dashboard/layout/shared/logo/full-logo";

export const metadata: Metadata = {
  title: "Boxed Login Authentication",
  description: "Log in to your account.",
};

const BoxedLogin = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-accent  px-4">
        <Card className="w-full max-w-md border-none shadow-lg  px-8">
          {/* Logo */}
          <div className="mx-auto  w-fit">
            <FullLogo />
          </div>

          <SocialButtons title="or sign in with" />
          <AuthLogin />

          {/* Footer */}
          <div className="flex gap-2 text-base font-medium mt-6 items-center justify-center">
            <p className="text-muted-foreground">New to ShadcnSpace Dashboard ?</p>
            <Link
              href={"/auth/auth2/register"}
              className="text-primary/80 hover:text-primary text-sm font-medium"
            >
              Create an account
            </Link>
          </div>
        </Card>
      </div>
    </>
  );
};

export default BoxedLogin;
