"use client";

import React from "react";
import { useContext, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Settings } from "lucide-react";
import SimpleBar from "simplebar-react";
import { CustomizerContext } from "@/app/context/customizer-context";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Customizer = () => {
  const {
    activeDir,
    setActiveDir,
    activeMode,
    setActiveMode,
    isCollapse,
    setIsCollapse,
    activeTheme,
    setActiveTheme,
    activeLayout,
    setActiveLayout,
    isLayout,
    isCardShadow,
    setIsCardShadow,
    setIsLayout,

  } = useContext(CustomizerContext);
  // get value of custom theme color
  const [colorPrimary, setColorPrimary] = useState("var(--primary)");
  const [colorSecondary, setColorSecondary] = useState("var(--secondary)");

  // Helper function to get CSS custom properties
  const getCustomColors = React.useCallback(() => {
    if (typeof window === "undefined")
      return { primary: null, secondary: null };

    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    return {
      primary: computedStyle.getPropertyValue("--primary").trim() || null,
      secondary: computedStyle.getPropertyValue("--secondary").trim() || null,
    };
  }, []);

  // Update colors from CSS custom properties
  const updateColorsFromCSS = React.useCallback(() => {
    const colors = getCustomColors();

    if (colors.primary) {
      setColorPrimary(colors.primary);
    }
    if (colors.secondary) {
      setColorSecondary(colors.secondary);
    }
  }, [getCustomColors]);

  // Get initial colors on component mount and when theme changes
  useEffect(() => {
    updateColorsFromCSS();
  }, [updateColorsFromCSS, activeTheme]);

  // Optimized color change handlers
  const handlePrimaryColorChange = React.useCallback((value: string) => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--primary", value);
    }
    setColorPrimary(value);
  }, []);

  const handleSecondaryColorChange = React.useCallback((value: string) => {
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty("--secondary", value);
    }
    setColorSecondary(value);
  }, []);

  return (
    <Sheet>
      <SheetTrigger className="h-14 w-14 animate-spin flex justify-center items-center text-white dark:text-black  fixed bg-primary rounded-full cursor-pointer hover:bg-primary/80 bottom-6 end-6 z-20">
        <Settings className="size-5" />
      </SheetTrigger>
      <SheetContent
        side={activeDir === "rtl" ? "left" : "right"}
        showCloseButton={false}
        className="border-border"
      >
        <SheetHeader className="border-border border-b">
          <SheetTitle>Customizer</SheetTitle>
          <SheetDescription>
            Make changes to your customizer here.
          </SheetDescription>
          <SheetClose className="absolute top-5 end-5 p-2 hover:bg-primary/15 hover:text-primary rounded-full cursor-pointer">
            <Icon icon="tabler:x" width={20} height={20} />
          </SheetClose>
        </SheetHeader>
        <SimpleBar className="h-n80">
          <div className="px-6">
            {/* Theme Option */}
            <h4 className="text-base mb-2">Theme Option</h4>
            <div className="flex gap-4 mb-7">
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  activeMode === "light" &&
                  "active text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => setActiveMode("light")}
              >
                <span className="flex items-center">
                  <Icon icon="tabler:sun" className="me-2 text-2xl" />
                  Light
                </span>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  activeMode === "dark" &&
                  "active text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => {
                  setActiveMode("dark");
                }}
              >
                <span className="flex items-center">
                  <Icon icon="tabler:moon" className="me-2 text-2xl" /> Dark
                </span>
              </Button>
            </div>

            {/* Theme direction */}
            <h4 className="text-base mb-2">Theme Direction</h4>
            <div className="flex gap-4 mb-7">
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  activeDir === "ltr" &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => {
                  setActiveDir("ltr");
                }}
              >
                <span className="flex items-center">
                  <Icon
                    icon="tabler:text-direction-ltr"
                    className="me-2 text-2xl"
                  />{" "}
                  LTR
                </span>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  activeDir === "rtl" &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => {
                  setActiveDir("rtl");
                }}
              >
                <span className="flex items-center">
                  <Icon
                    icon="tabler:text-direction-rtl"
                    className="me-2 text-2xl"
                  />{" "}
                  RTL
                </span>
              </Button>
            </div>
            {/* custom theme color picker */}
            <h4 className="text-base mb-2">Choose Your Theme Colors</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <div className="border  text-lin border-border py-5 px-6 rounded-md cursor-pointer">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="color"
                    id="primaryColorPicker"
                    value={colorPrimary}
                    onClick={() => setActiveTheme("CUSTOM_THEME")}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <label htmlFor="primaryColorPicker">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full cursor-pointer flex items-center justify-center"
                        style={{
                          backgroundColor: colorPrimary,
                        }}
                      ></div>
                      <Icon
                        icon={"solar:pen-linear"}
                        width={18}
                        height={18}
                        className="cursor-pointer"
                      />
                    </div>
                  </label>
                </div>
              </div>
              {/*  */}
              <div className="border  text-lin border-border py-5 px-6 rounded-md cursor-pointer">
                <div className="flex items-center gap-2 relative">
                  <input
                    type="color"
                    id="secondaryColorPicker"
                    value={colorSecondary}
                    onClick={() => setActiveTheme("CUSTOM_THEME")}
                    onChange={(e) => handleSecondaryColorChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <label htmlFor="secondaryColorPicker">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-6 w-6 rounded-full cursor-pointer flex items-center justify-center"
                        style={{
                          backgroundColor: colorSecondary,
                        }}
                      ></div>
                      <Icon
                        icon={"solar:pen-linear"}
                        width={18}
                        height={18}
                        className="cursor-pointer"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
            {/* Theme layout */}
            <h4 className="text-base mb-2">Layout Type</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6 dark:hover:text-primary",
                  activeLayout === "vertical" &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => setActiveLayout("vertical")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="tabler:layout-sidebar-right"
                    className="me-2 text-2xl"
                  />
                  Vertical
                </span>
              </Button>
              <Button
                onClick={() => setActiveLayout("horizontal")}
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  activeLayout === "horizontal" &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
              >
                <span className="flex items-center">
                  <Icon icon="tabler:layout-navbar" className="me-2 text-2xl" />
                  Horizontal
                </span>
              </Button>
            </div>
            {/* Sidebar Type */}
            <h4 className="text-base mb-2">Container Option</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6 dark:hover:text-primary",
                  isLayout === "boxed" &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => setIsLayout("boxed")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="tabler:layout-distribute-vertical"
                    className="me-2 text-2xl"
                  />
                  Boxed
                </span>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  isLayout === "full" &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => setIsLayout("full")}
              >
                <span className="flex items-center">
                  <Icon
                    icon="tabler:layout-distribute-horizontal"
                    className="me-2 text-2xl"
                  />
                  Full
                </span>
              </Button>
            </div>
            {/* Card  With */}
            <h4 className="text-base mb-2">Card With</h4>
            <div className="flex flex-wrap  gap-4 mb-7">
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  !isCardShadow &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => setIsCardShadow(false)}
              >
                <span className="flex items-center">
                  <Icon icon="tabler:border-outer" className="me-2 text-2xl" />
                  Border
                </span>
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "hover:scale-105 transition-all cursor-pointer shadow-none px-5 py-6",
                  isCardShadow &&
                  "text-primary bg-primary/5 border-primary/20 hover:bg-primary/20"
                )}
                onClick={() => setIsCardShadow(true)}
              >
                <span className="flex items-center">
                  <Icon icon="tabler:border-none" className="me-2 text-2xl" />
                  Shadow
                </span>
              </Button>
            </div>
          </div>
        </SimpleBar>
      </SheetContent>
    </Sheet>
  );
};


