import type { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: "Sign in | AVIATONLY",
  description: "Log in to your AVIATONLY dashboard account.",
};

import Link from "next/link";

import { Card } from "@/components/ui/card";
import FullLogo from "@/app/(dashboard)/dashboard/layout/shared/logo/full-logo";
import SocialButtons from "../../authforms/social-buttons";
import AuthLogin from "../../authforms/auth-login";
import Footer from "@/app/(dashboard)/dashboard/layout/footer/page";

const Login = () => {
  return (
    <>
      <Card className="md:h-[calc(100vh-30px)]  bg-transparent flex items-center justify-center px-4 border-none shadow-none">
        <div className="bg-card rounded-xl shadow-md max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* LEFT SIDE */}
          <div className="p-10 flex flex-col  bg-card ">
            {/* Logo */}
            <div className="mb-6">
              <FullLogo />
            </div>

            <div className="w-full">
              <h3 className="text-xl font-bold">Welcome to AVIATONLY</h3>
              <p className="text-muted-foreground text-sm font-medium">
                Sign in to your seller and operations dashboard
              </p>
              <SocialButtons title="or sign in with" />
              <Suspense fallback={<p className="mt-6 text-sm text-muted-foreground">Loading sign-in form...</p>}>
                <AuthLogin />
              </Suspense>
              <div className="flex gap-2 text-base text-muted-foreground font-medium mt-6 items-center">
                <p>New to AVIATONLY?</p>
                <Link
                  href={"/auth/auth1/register"}
                  className="text-primary text-base font-medium"
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:block relative">
            <img
              src="/images/backgrounds/login-bg.png"
              alt="Login Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>

      <div className="max-w-341.75 mx-auto px-6">
        <Footer />
      </div>
    </>
  );
};

export default Login;
