import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import React, { useContext } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { last } from "lodash";
import { formatDistanceToNowStrict } from "date-fns";
import { ChatsType } from "@/app/(dashboard)/dashboard/types/apps/chat";
import SimpleBar from "simplebar-react";
import { ChatContext } from "@/app/context/chat-context/index";
import { cn } from "@/lib/utils";
import { EllipsisVertical, SearchIcon } from "lucide-react";
import PlaceholdersInput from "../../animated-components/animatedinput-placeholder";
const ChatListing = () => {
  const DropdownAction = [
    {
      icon: "solar:settings-outline",
      listtitle: "Setting",
      divider: true,
    },
    {
      icon: "solar:question-circle-outline",
      listtitle: "Help and feedback",
      divider: false,
    },
    {
      icon: "solar:align-horizonta-spacing-line-duotone",
      listtitle: "Enable split View mode",
      divider: false,
    },
    {
      icon: "solar:keyboard-outline",
      listtitle: "Keyboard shortcut",
      divider: true,
    },
    {
      icon: "solar:logout-2-outline",
      listtitle: "Sign Out",
      divider: false,
    },
  ];

  const lastActivity = (chat: ChatsType) => last(chat.messages)?.createdAt;

  const getDetails = (conversation: ChatsType) => {
    let displayText = "";
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage) {
      const sender = lastMessage.senderId === conversation.id ? "You: " : "";
      const message =
        lastMessage.type === "image" ? "Sent a photo" : lastMessage.msg;
      displayText = `${sender}${message}`;
    }
    return displayText;
  };

  const {
    chatData,
    chatSearch,
    setChatSearch,
    setSelectedChat,
    setActiveChatId,
    activeChatId,
  } = useContext(ChatContext);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChatSearch(event.target.value);
  };

  const filteredChats = chatData.filter((chat) =>
    chat.name.toLowerCase().includes(chatSearch.toLowerCase())
  );

  const handleChatSelect = (chat: ChatsType) => {
    const chatId =
      typeof chat.id === "string" ? parseInt(chat.id, 10) : chat.id;
    setSelectedChat(chat);
    setActiveChatId(chatId);
  };

  return (
    <>
      <div className="w-80  p-6 w-full px-0">
        {/* Header */}
        <div className="flex justify-between items-center px-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/images/profile/avtar.webp"
                height={56}
                width={56}
                alt="user"
                className="rounded-full"
              />
              <Badge className="p-0 h-2 w-2 absolute bottom-1 end-1 bg-chart-2" />
            </div>
            <div>
              <h5 className="text-sm mb-1">Cameron</h5>
              <p className=" text-xs text-muted-foreground">Designer</p>
            </div>
          </div>

          {/* ShadCN Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-primary/5 hover:text-primary cursor-pointer">
                <EllipsisVertical size={20} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {DropdownAction.map((item, index) => (
                <React.Fragment key={index}>
                  <DropdownMenuItem className="flex items-center gap-3 cursor-pointer">
                    <Icon icon={item.icon} height={18} />
                    <span>{item.listtitle}</span>
                  </DropdownMenuItem>
                  {item.divider && <DropdownMenuSeparator />}
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search Box */}
        <div className="px-6">
          <div className="flex gap-3  py-5 items-center">
            <div className="relative w-full">

              <SearchIcon size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />

              <PlaceholdersInput
                className="pl-8"
                value={chatSearch}
                onChange={(val) => setChatSearch(val)}
                placeholders={[
                  "Search Chats...",
                  "Find top Chats...",
                  "Look up Chats...",
                ]}
              />
            </div>
          </div>

          {/* Sorting Dropdown (Also converted to ShadCN) */}
          <div className="sorting mb-3">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="flex items-center gap-2 cursor-pointer text-sm font-medium  ">
                  Recent Chats
                  <Icon icon="ci:chevron-down" width={16} height={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem>Sort by Time</DropdownMenuItem>
                <DropdownMenuItem>Sort by Unread</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Sort by Favourites</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Chat Listing */}
        <SimpleBar className="lg:h-[calc(100vh_-_520px)] h-[calc(100vh_-_200px)]">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`cursor-pointer py-4 px-6 mb-0.5 gap-0 flex justify-between group  hover:bg-primary/5 ${activeChatId === chat.id ? "bg-primary/5 " : "initial"
                }`}
              onClick={() => handleChatSelect(chat)}
            >
              <div className="flex items-center gap-3 max-w-[235px] w-full">
                <div className="relative min-w-12">
                  <Image
                    src={chat.thumb}
                    height={48}
                    width={48}
                    alt="user"
                    className="rounded-full"
                  />
                  <Badge
                    className={cn(
                      "p-0 h-2 w-2 absolute bottom-1 end-0 ",
                      chat.status === "online"
                        ? "bg-chart-2"
                        : chat.status === "busy"
                          ? "bg-destructive"
                          : chat.status === "away"
                            ? "bg-chart-4"
                            : "bg-chart-5"
                    )}
                  />
                </div>
                <div>
                  <h5 className="text-sm mb-1">{chat.name}</h5>
                  <div className="text-sm text-muted-foreground font-normal  line-clamp-1">
                    {getDetails(chat)}
                  </div>
                </div>
              </div>
              <div className="text-xs pt-1 whitespace-nowrap text-muted-foreground">
                {formatDistanceToNowStrict(new Date(lastActivity(chat)!), {
                  addSuffix: false,
                })}
              </div>
            </div>
          ))}
        </SimpleBar>
      </div>
    </>
  );
};

export default ChatListing;
