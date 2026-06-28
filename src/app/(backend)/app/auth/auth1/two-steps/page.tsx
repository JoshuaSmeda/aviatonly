"use client";

import React from "react";
import AuthTwoSteps from "../../authforms/auth-twosteps";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import Footer from "@/app/(dashboard-layout)/layout/footer/page";
import FullLogo from "@/app/(dashboard-layout)/layout/shared/logo/full-logo";

const TwoSteps = () => {
  return (
    <>
      <Card className="md:h-[calc(100vh-30px)] bg-transparent flex items-center justify-center px-4 border-none shadow-none">
        <div className="bg-card rounded-xl shadow-md max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* LEFT SIDE */}
          <div className="p-10 flex flex-col bg-card  ">
            {/* Logo */}
            <div className="mb-6">
              <FullLogo />
            </div>

            <div className="w-full">
              <h3 className="text-xl font-bold mb-2">Two Steps Verification</h3>

              <p className="text-muted-foreground text-sm ">
                We sent a verification code to your mobile. Enter the code below
                to verify your identity.
              </p>

              <h6 className="text-sm font-bold my-4">******1234</h6>

              {/* Two Step Form */}
              <AuthTwoSteps />

              <div className="flex gap-2 text-sm text-muted-foreground font-medium mt-6 items-center">
                <p>Didn’t get the code?</p>
                <Link href="/" className="text-primary text-sm font-medium">
                  Resend
                </Link>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:block relative h-112.5">
            <img
              src="/images/backgrounds/login-bg.png"
              alt="Two Steps Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </Card>

      {/* FOOTER */}
      <div className="max-w-341.75 mx-auto px-6">
        <Footer />
      </div>
    </>
  );
};

export default TwoSteps;
