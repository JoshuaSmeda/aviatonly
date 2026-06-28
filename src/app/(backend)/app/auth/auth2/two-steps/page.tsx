import { Card } from "@/components/ui/card";
import Link from "next/link";
import AuthTwoSteps from "../../authforms/auth-twosteps";
import type { Metadata } from "next";
import FullLogo from "@/app/(dashboard-layout)/layout/shared/logo/full-logo";
export const metadata: Metadata = {
  title: "Boxed Two Steps Authentication",
  description: "Verify your account by entering the code sent to your phone.",
};
const BoxedTwoStep = () => {
  return (
    <>
      <div className="relative overflow-hidden h-screen bg-muted">
        <div className="flex h-full justify-center items-center px-4">
          <Card className="md:w-112.5 w-full border-none p-6">
            <div className="mx-auto  w-fit">
              <FullLogo />
            </div>
            <p className="text-muted-foreground text-sm font-medium text-center">
              We sent a verification code to your mobile. Enter the code from
              the mobile in the field below.
            </p>
            <h6 className="text-sm font-bold my-4 text-center">******1234</h6>
            <AuthTwoSteps />
            <div className="flex gap-2 text-base text-muted-foreground font-medium mt-6 items-center justify-left">
              <p>Didn't get the code?</p>
              <Link href={"/"} className="text-primary text-sm font-medium">
                Resend
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BoxedTwoStep;
