"use client";
import { Card } from "@/components/ui/card";
import React, { useState, useContext } from "react";
import EmailFilter from "@/components/dashboard/apps/email/email-filter";
import EmailSearch from "@/components/dashboard/apps/email/email-search";
import EmailList from "@/components/dashboard/apps/email/email-list";
import EmailContent from "@/components/dashboard/apps/email/email-content";
import { EmailContextProvider } from "@/app/context/email-context/index";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { CustomizerContext } from "@/app/context/customizer-context";

const EmaiilApp = () => {
  const [isOpenEmail, setIsOpenEmail] = useState(false);
  const handleCloseEmail = () => setIsOpenEmail(false);
  const { activeDir } = useContext(CustomizerContext);

  const [isOpenMail, setIsOpenMail] = useState(false);
  return (
    <>
      <EmailContextProvider>
        <Card className="p-0 overflow-hidden h-full">
          <div className="flex">
            {/* ------------------------------------------- */}
            {/* Left Part */}
            {/* ------------------------------------------- */}
            <Sheet open={isOpenEmail} onOpenChange={handleCloseEmail}>
              <SheetContent
                side={activeDir === "rtl" ? "right" : "left"}
                className="!max-w-60 !sm:max-w-60 w-full h-full lg:z-0 lg:hidden block"
                showCloseButton={false}
              >
                <VisuallyHidden>
                  <SheetTitle>title</SheetTitle>
                </VisuallyHidden>
                <EmailFilter />
              </SheetContent>
            </Sheet>
            <div className="max-w-60 sm:max-w-60 w-full h-auto lg:block hidden">
              <EmailFilter />
            </div>

            {/* ------------------------------------------- */}
            {/* Middle part */}
            {/* ------------------------------------------- */}
            <div className="left-part lg:max-w-[340px] max-w-full md:border-e md:border-border border-e-0  w-full px-0 pt-0">
              <EmailSearch onClick={() => setIsOpenEmail(true)} />
              <EmailList openMail={setIsOpenMail} />
            </div>
            {/* ------------------------------------------- */}
            {/* Detail part */}
            {/* ------------------------------------------- */}
            <EmailContent
              openMailValue={isOpenMail}
              onCloseMail={() => setIsOpenMail(false)}
            />
          </div>
        </Card>
      </EmailContextProvider>
    </>
  );
};
export default EmaiilApp;
