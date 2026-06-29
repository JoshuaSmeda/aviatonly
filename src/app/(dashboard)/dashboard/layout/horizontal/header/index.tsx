"use client";

import { useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import Search from "../../shared/header/search";
import Profile from "../../shared/header/profile";
import { Language } from "../../shared/header/language";
import FullLogo from "../../shared/logo/full-logo";
import { CustomizerContext } from "@/app/context/customizer-context";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Notifications from "../../shared/header/notifications";
import Message from "../../shared/header/message";
import { Cart } from "../../shared/header/cart";
import { cn } from "@/lib/utils";
import LightDark from "../../shared/header/light-dark";
import Navigation from "../navbar";
import OrganizationSwitcher from "@/components/dashboard/auth/organization-switcher";

import type { AuthUser } from "@/lib/auth/session"

const HorizontalHeader = ({ user }: { user: AuthUser }) => {
  const { setIsCollapse, isCollapse, isLayout, activeMode, setActiveMode } =
    useContext(CustomizerContext);
  const { toggleSidebar, state } = useSidebar();
  useEffect(() => {
    if (state == "collapsed") {
      setIsCollapse(true);
    } else {
      setIsCollapse(false);
    }
  }, [state]);

  return (
    <>
      <header className={cn(
        isLayout === "full" ? "w-full px-5" : "container mx-auto",

      )}>
        <nav>
          <div className="mx-auto flex flex-wrap items-center justify-between p-2">
            <div className="flex gap-2 items-center">
              <div className="block">
                <FullLogo />
              </div>
              <div className="lg:hidden block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-muted-foreground hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/5 dark:hover:text-primary rounded-full transition cursor-pointer"
                  onClick={toggleSidebar}
                >
                  <Icon
                    icon="solar:sidebar-minimalistic-outline"
                    className="size-5"
                  />
                </Button>
              </div>
              <div className="sm:block hidden border-s border-border ps-4 ms-2">
                <Search />
              </div>
            </div>

            <div className="flex sm:gap-1 gap-0 items-center">
              <OrganizationSwitcher />
              {/* Theme Toggle */}
              <LightDark />
              {/* Language Dropdown*/}
              <Language />

              <Cart />

              {/* Notifications Dropdown */}
              <Notifications className="sm:block hidden" />

              {/* Message Dropdown */}
              <Message />

              {/* Profile Dropdown */}
              <Profile user={user} />
            </div>
          </div>
        </nav>
      </header>
      <div
        className={cn("sticky top-0 z-2 bg-background border border-border rounded-lg mt-2 px-2 py-2 hidden lg:block ",
          isLayout === "full" ? "w-full px-5" : "container mx-auto",

        )}

      >

        <Navigation />
      </div>
    </>
  );
};

export default HorizontalHeader;
