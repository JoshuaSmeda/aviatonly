"use client";
import { Card } from "@/components/ui/card";
import React, { useContext, useState } from "react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";
import { ChatProvider } from "@/app/context/chat-context";
import ChatListing from "./chat-listing";
import ChatContent from "./chat-content";
import ChatMsgSent from "./chat-msgsent";
import { Separator } from "@/components/ui/separator";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CustomizerContext } from "@/app/context/customizer-context";

const ChatsApp = () => {
  const [isOpenChat, setIsOpenChat] = useState(false);
  const { activeDir } = useContext(CustomizerContext);
  return (
    <>
      <ChatProvider>
        <Card className="p-0 overflow-hidden">
          <div className="flex h-[calc(100vh-300px)]">
            {/* ------------------------------------------- */}
            {/* Left Part */}
            {/* ------------------------------------------- */}
            <Sheet
              open={isOpenChat}
              onOpenChange={(
                open: boolean | ((prevState: boolean) => boolean)
              ) => setIsOpenChat(open)}
            >
              <SheetContent
                side={activeDir === "rtl" ? "right" : "left"}
                showCloseButton={false}
                className="!max-w-[350px] !sm:max-w-[350px] w-full h-full lg:z-0 lg:hidden block"
              >
                <SheetClose className="absolute top-0 end-0 p-2 btn-circle-hover y rounded-full">
                  <Icon icon="tabler:x" width={20} height={20} />
                </SheetClose>

                <ChatListing />
              </SheetContent>
            </Sheet>
            <div className="max-w-[300px] sm:max-w-[350px] w-full h-full lg:block hidden border-e">
              <ChatListing />
            </div>
            {/* ------------------------------------------- */}
            {/* Right part */}
            {/* ------------------------------------------- */}
            <div className="grow w-[70%] flex flex-col h-full">
              <div className="flex-1 min-h-0 overflow-hidden">
                <ChatContent onClickMobile={() => setIsOpenChat(true)} />
              </div>
              <div className="shrink-0">
                <Separator />
                <ChatMsgSent />
              </div>
            </div>
          </div>
        </Card>
      </ChatProvider>
    </>
  );
};

export default ChatsApp;
