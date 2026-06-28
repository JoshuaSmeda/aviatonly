"use client";
import React, { useState, useContext, Activity } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SimpleBar from "simplebar-react";

import {
  ChatContext,
  ChatContextProps,
} from "@/app/context/chat-context/index";
import { formatDistanceToNowStrict } from "date-fns";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MessageType } from "@/app/(dashboard-layout)/types/apps/chat";
import ChatInsideSidebar from "./chatinside-sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
type Props = {
  onClickMobile: (event: React.MouseEvent<HTMLElement>) => void;
};

const ChatContent = ({ onClickMobile }: Props) => {
  const { selectedChat, chatData }: ChatContextProps = useContext(ChatContext);

  const [isRightSide, setIsRightSide] = useState(true);
  const handleButtonClick = () => {
    setIsRightSide(!isRightSide);
  };
  const handleClose = () => setIsOpenMedia(false);

  const [isOpenMedia, setIsOpenMedia] = useState(false);

  return (
    <>
      <div className="p-5">
        <div>
          {selectedChat ? (
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3 ">
                <Button
                  className="!h-8 !w-8 flex justify-center items-center lg:!hidden bg-primary/5 text-primary hover:text-white dark:hover:text-black"
                  onClick={onClickMobile}
                >
                  <Icon icon="tabler:menu-2" height={18} />
                </Button>
                <div className="relative sm:min-w-12 min-w-9">
                  <Image
                    src={selectedChat.thumb}
                    height={48}
                    width={48}
                    alt="user"
                    className="rounded-full sm:h-12 sm:w-12 h-9 w-9"
                  />
                  <Badge
                    className={cn(
                      "p-0 h-2 w-2 absolute bottom-1 end-0",
                      selectedChat.status === "online"
                        ? "bg-chart-2"
                        : selectedChat.status === "busy"
                          ? "bg-destructive"
                          : selectedChat.status === "away"
                            ? "bg-chart-4"
                            : "bg-chart-5"
                    )}
                  />
                </div>
                <div>
                  <h5 className="text-base sm:mb-1">{selectedChat.name}</h5>
                  <div className="text-sm  text-muted-foreground line-clamp-1">
                    {selectedChat.status}
                  </div>
                </div>
              </div>
              <div className="flex items-center md:gap-2 gap-1">
                <div className="btn-circle-hover  sm:h-10 sm:w-10">
                  <Icon
                    icon="tabler:phone"
                    height={25}
                    className="sm:h-10 h-5 "
                  />
                </div>
                <div className="btn-circle-hover  sm:h-10 sm:w-10">
                  <Icon
                    icon="tabler:video"
                    height={25}
                    className="sm:h-10 h-5 "
                  />
                </div>
                <div
                  className="btn-circle-hover  sm:h-10 sm:w-10 xl:flex hidden"
                  onClick={handleButtonClick}
                >
                  <Icon
                    icon="tabler:menu-2"
                    width={20}
                    className="sm:h-10 h-5 "
                  />
                </div>
                <div
                  className="btn-circle-hover  sm:h-10 sm:w-10 xl:hidden flex"
                  onClick={() => setIsOpenMedia(true)}
                >
                  <Icon
                    icon="tabler:menu-2"
                    width={22}
                    className="sm:h-10 h-5 "
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <Separator />
      <div className="flex  h-full">
        <div
          className={`transition-all ${!isRightSide
            ? "lg:w-[calc(100%_-_0px)]"
            : "xl:w-[calc(100%_-_300px)] w-full"
            } `}
        >
          <div
            className={`${!isRightSide ? "border-none" : "lg:border-e"
              } border-border h-full flex flex-col`}
          >
            {/* Chat messages scroll container */}
            <div className="flex-1 overflow-hidden">
              <SimpleBar className="h-[calc(100vh_-_480px)]">
                <div className="px-5 py-5">
                  {selectedChat?.messages?.map((msg: MessageType) => (
                    <div
                      className="flex gap-3 mb-[30px]"
                      key={msg.id + msg.createdAt}
                    >
                      {selectedChat.id === msg.senderId ? (
                        <div className="flex gap-3">
                          <div className="w-10">
                            <Image
                              src={selectedChat.thumb}
                              height={40}
                              width={40}
                              alt="user"
                              className="rounded-full"
                            />
                          </div>
                          {msg.type === "text" ? (
                            <div>
                              <div className="text-xs text-muted-foreground font-semibold mb-1 block">
                                {selectedChat.name},{" "}
                                {formatDistanceToNowStrict(
                                  new Date(msg.createdAt || new Date()),
                                  {
                                    addSuffix: false,
                                  }
                                )}{" "}
                                ago
                              </div>
                              <div className="p-2 bg-accent  dark:bg-accent/40 rounded-md">
                                {msg.msg}
                              </div>
                            </div>
                          ) : null}
                          {msg.type === "image" ? (
                            <Image
                              src={msg.msg}
                              height={150}
                              width={150}
                              alt="user"
                              className="rounded-md"
                            />
                          ) : null}
                        </div>
                      ) : (
                        <div className="flex  justify-end w-full">
                          <div>
                            {msg.createdAt ? (
                              <div className="text-xs text-muted-foreground  font-medium mb-1 block text-end">
                                {formatDistanceToNowStrict(
                                  new Date(msg.createdAt),
                                  {
                                    addSuffix: false,
                                  }
                                )}{" "}
                                ago
                              </div>
                            ) : null}
                            {msg.type === "text" ? (
                              <div className="p-2  bg-blue-600/10 rounded-md">
                                {msg.msg}
                              </div>
                            ) : null}
                            {msg.type === "image" ? (
                              <Image
                                src={msg.msg}
                                height={150}
                                width={150}
                                alt="user"
                                className="rounded-md"
                              />
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </SimpleBar>
            </div>
          </div>
        </div>
        <Activity mode={isRightSide ? "visible" : "hidden"}>
          <>
            <div
              className={`shrink-0 ${!isRightSide ? "max-w-[0]" : "xl:max-w-[300px] max-w-0 w-full"
                }`}
            >
              <ChatInsideSidebar />
            </div>
            <Sheet open={isOpenMedia} onOpenChange={handleClose}>
              <SheetContent side="right" className="max-w-[100px]">
                <ChatInsideSidebar />
              </SheetContent>
            </Sheet>
          </>
        </Activity>
      </div>
    </>
  );
};

export default ChatContent;
