"use client";

import React from "react";
import SocialButtons from "../../authforms/social-buttons";

import { Card } from "@/components/ui/card";

import Link from "next/link";

import AuthRegister from "../../authforms/auth-register";
import Footer from "@/app/(dashboard)/dashboard/layout/footer/page";
import FullLogo from "@/app/(dashboard)/dashboard/layout/shared/logo/full-logo";

const Register = () => {
  return (
    <>
      <Card className="md:h-[calc(100vh-30px)] bg-transparent flex items-center justify-center px-4 border-none shadow-none">
        <div className="bg-card rounded-xl shadow-md max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* LEFT SIDE */}
          <div className="p-10 flex flex-col bg-card ">
            {/* Logo */}
            <div className="mb-6">
              <FullLogo />
            </div>

            <div className="w-full">
              <h3 className="text-xl font-bold">Welcome to AVIATONLY</h3>
              <p className="text-muted-foreground text-sm font-medium">
                Create an account to buy or sell aircraft on AVIATONLY
              </p>

              {/* Social Buttons */}
              <SocialButtons title="or sign up with" />

              <AuthRegister />

              {/* Already have account */}
              <div className="flex gap-2 text-base text-muted-foreground font-medium mt-6 items-center">
                <p>Already have an account?</p>
                <Link
                  href={"/auth/auth1/login"}
                  className="text-primary text-base font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:block relative">
            <img
              src="/images/backgrounds/login-bg.png"
              alt="Register Preview"
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

export default Register;
