"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import FullLogo from "@/app/(dashboard-layout)/layout/shared/logo/full-logo";
import Footer from "@/app/(dashboard-layout)/layout/footer/page";
import AuthForgotPassword from "../../authforms/auth-forgotpassword";

const Forgotpwd = () => {
  return (
    <>
      <div className="md:h-[calc(100vh-30px)] bg-transparent flex items-center justify-center px-4 border-none shadow-none gap-6">
        <div className="bg-card rounded-xl shadow-md max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* LEFT SIDE */}
          <div className="p-10 flex flex-col bg-card ">
            {/* Logo */}
            <div className="mb-6">
              <FullLogo />
            </div>

            <div className="w-full">
              <h3 className="text-xl font-bold">Forgot Password</h3>
              <p className="text-muted-foreground text-sm  mb-4">
                Please enter the email address associated with your account and
                we will email you a link to reset your password.
              </p>

              {/* Forgot Password Form */}
              <AuthForgotPassword />

              {/* Back to Login Button */}
              <Button className="w-full mt-4 " variant={"outline"}>
                <Link href="/auth/auth1/login">Back to Login</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:block relative h-112.5">
            <img
              src="/images/backgrounds/login-bg.png"
              alt="Forgot Password Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="max-w-341.75 mx-auto px-6">
        <Footer />
      </div>
    </>
  );
};

export default Forgotpwd;
