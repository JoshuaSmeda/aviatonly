import { Card } from "@/components/ui/card";
import React from "react";
import SocialButtons from "../../authforms/social-buttons";
import Link from "next/link";
import AuthRegister from "../../authforms/auth-register";
import type { Metadata } from "next";
import FullLogo from "@/app/(dashboard)/dashboard/layout/shared/logo/full-logo";
export const metadata: Metadata = {
  title: "Boxed Register Authentication",
  description: "Sign up to create your account and start using the app.",
};

const BoxedRegister = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-muted">
        <div className="flex h-full justify-center items-center px-4">
          <Card className="md:w-112.5 w-full border-none shadow-lg p-6">
            <div className="mx-auto  w-fit">
              <FullLogo />
            </div>
            <SocialButtons title="or sign up with" />
            <AuthRegister />
            <div className="flex gap-2 text-base text-muted-foreground font-medium mt-6 items-center justify-start">
              <p>Already have an Account?</p>
              <Link
                href={"/auth/auth2/login"}
                className="text-primary/80 text-base hover:text-primary font-medium"
              >
                Sign in
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BoxedRegister;
