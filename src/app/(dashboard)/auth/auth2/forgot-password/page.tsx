import { Card } from "@/components/ui/card";
import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import FullLogo from "@/app/(dashboard)/dashboard/layout/shared/logo/full-logo";
import AuthForgotPassword from "../../authforms/auth-forgotpassword";
export const metadata: Metadata = {
  title: "Boxed Forgot Password Auth",
  description: "Reset your password by entering your email.",
};

const BoxedForgotpwd = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-muted ">
        <div className="flex h-full justify-center items-center px-4">
          <Card className="md:w-112.5 w-full border-none shadow-lg p-6">
            <div className="mx-auto  w-fit">
              <FullLogo />
            </div>
            <p className="text-muted-foreground text-sm text-center my-4">
              Please enter the email address associated with your account and We
              will email you a link to reset your password.
            </p>
            <AuthForgotPassword />
            <Button className="w-full " variant={"outline"}>
              <Link href="/auth/auth2/login">Back to Login</Link>
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BoxedForgotpwd;
