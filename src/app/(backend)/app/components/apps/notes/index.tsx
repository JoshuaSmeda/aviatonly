"use client";
import React, { useEffect, useState, useContext } from "react";
import { Card } from "@/components/ui/card";
import NotesSidebar from "@/app/components/apps/notes/notes-sidebar";
import NoteContent from "@/app/components/apps/notes/note-content";
import AddNotes from "@/app/components/apps/notes/add-notes";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { NotesProvider } from "@/app/context/notes-context/index";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { mutate } from "swr";
import { usePathname } from "next/navigation";
import { CustomizerContext } from "@/app/context/customizer-context";

interface colorsType {
  lineColor: string;
  disp: string | any;
  id: number;
}

const NotesApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  const { activeDir } = useContext(CustomizerContext);

  const location = usePathname();

  // Reset Notes on browser refresh
  const handleResetTickets = async () => {
    const response = await fetch("/api/notes", {
      method: "GET",
      headers: {
        broserRefreshed: "true",
      },
    });
    const result = await response.json();
    await mutate("/api/notes");
  };

  useEffect(() => {
    const isPageRefreshed = sessionStorage.getItem("isPageRefreshed");
    if (isPageRefreshed === "true") {
      console.log("page refreshed");
      sessionStorage.removeItem("isPageRefreshed");
      handleResetTickets();
    }
  }, [location]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.setItem("isPageRefreshed", "true");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const colorvariation: colorsType[] = [
    {
      id: 1,
      lineColor: "chart-4",
      disp: "chart-4",
    },
    {
      id: 2,
      lineColor: "primary",
      disp: "primary",
    },
    {
      id: 3,
      lineColor: "destructive",
      disp: "destructive",
    },
    {
      id: 4,
      lineColor: "chart-2",
      disp: "chart-2",
    },
    {
      id: 5,
      lineColor: "chart-3",
      disp: "chart-3",
    },
  ];

  return (
    <>
      <NotesProvider>
        <Card className="p-0 overflow-hidden">
          <div className="flex">
            {/* NOTES SIDEBAR */}
            <div>
              <Sheet open={isOpen} onOpenChange={handleClose}>
                <SheetContent
                  side={activeDir === "rtl" ? "right" : "left"}
                  showCloseButton={false}
                  className="!max-w-[320px] !sm:max-w-[320px] w-full h-full lg:z-0 lg:hidden block"
                >
                  <NotesSidebar />
                </SheetContent>
              </Sheet>
              <div className="w-full h-auto lg:block hidden">
                <NotesSidebar />
              </div>
            </div>

            {/* NOTES CONTENT */}
            <div className="w-full">
              <div className="flex justify-between items-center border-b border-border py-4 px-6">
                <div className="flex gap-3 items-center">
                  <Button
                    onClick={() => setIsOpen(true)}
                    className="!h-8 !w-8 !rounded-md  justify-center items-center  p-0 lg:!hidden flex  bg-primary/5 text-primary hover:text-white dark:hover:text-black"
                  >
                    <Icon icon="tabler:menu-2" height={18} />
                  </Button>
                  <h6 className="text-base"> Edit Note</h6>
                </div>
                <AddNotes colors={colorvariation} />
              </div>
              <NoteContent />
            </div>
          </div>
        </Card>
      </NotesProvider>
    </>
  );
};

export default NotesApp;
