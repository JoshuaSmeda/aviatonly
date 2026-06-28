"use client";

import React, { useRef } from "react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardAction,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Ellipsis } from "lucide-react";

const DEFAULT_DROPDOWN_ITEMS = [
  { title: "Action", link: "#" },
  { title: "Another action", link: "#" },
  { title: "Something else", link: "#" },
];

const DEFAULT_TRANS_DATA = [
  {
    img: "https://images.shadcnspace.com/assets/socials/icon-instagram.svg",
    title: "PayPal Transfer",
    country: "5,230 leads",
    platform: "Instagram",
    badgeData: "Running",
    badgeBG: "bg-emerald-600/10 text-emerald-600",
  },
  {
    img: "https://images.shadcnspace.com/assets/socials/icon-facebool.svg",
    title: "Wallet",
    country: "5,490 leads",
    platform: "Facebook",
    badgeData: "Running",
    badgeBG: "bg-emerald-600/10 text-emerald-600",
  },
  {
    img: "https://images.shadcnspace.com/assets/socials/icon-adwords.svg",
    title: "Credit Card",
    country: "790 leads",
    platform: "Google Adwords",
    badgeData: "Paused",
    badgeBG: "bg-red-500/10 text-red-500",
  },
  {
    img: "https://images.shadcnspace.com/assets/socials/icon-youtube.svg",
    title: "Bank Transfer",
    country: "2,763 leads",
    platform: "Youtube",
    badgeData: "Paused",
    badgeBG: "bg-red-500/10 text-red-500",
  },
  {
    img: "https://images.shadcnspace.com/assets/socials/icon-linkedin.svg",
    title: "Refund",
    country: "5,039 leads",
    platform: "Linkedin",
    badgeData: "Paused",
    badgeBG: "bg-red-500/10 text-red-500",
  },
];

interface TransactionProps {
  img: string;
  title: string;
  country: string;
  platform: string;
  badgeData: string;
  badgeBG: string;
}

interface DropdownItemProps {
  title: string;
  link?: string;
}

interface WidgetProps {
  recentTransData?: TransactionProps[];
  dropdownItems?: DropdownItemProps[];
}

const CampaignPerformance = ({
  recentTransData = DEFAULT_TRANS_DATA,
  dropdownItems = DEFAULT_DROPDOWN_ITEMS,
}: WidgetProps) => {
  const ref = useRef(null);

  return (
    <Card className="w-full h-full py-6 gap-6">
      <CardHeader className="flex items-center justify-between px-6">
        <CardTitle className="text-lg font-medium text-foreground">
          Lead Sources
        </CardTitle>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full hover:bg-accent cursor-pointer p-2">
              <Ellipsis width={16} height={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {dropdownItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  className="font-normal cursor-pointer"
                >
                  {item.link ? (
                    <a href={item.link} className="w-full">
                      {item.title}
                    </a>
                  ) : (
                    <span className="w-full justify-start">{item.title}</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="px-0">
        <div className="flex flex-col gap-3.5">
          {recentTransData.map((item, index) => (
            <React.Fragment key={index}>
              <div className="flex gap-3 items-center px-6">
                <div
                  className={cn(
                    `flex justify-center items-center overflow-hidden p-3 rounded-xl outline outline-border`,
                  )}
                >
                  <img src={item.img} alt="icon" width={24} height={24} />
                </div>
                <div className="flex items-center justify-between flex-1">
                  <div>
                    <h5 className="text-base font-medium text-foreground">
                      {item.platform}
                    </h5>
                    <p className="text-sm font-normal tracking-wide text-muted-foreground">
                      {item.country}
                    </p>
                  </div>
                  <Badge
                    className={cn(`${item.badgeBG}`)}
                  >
                    {item.badgeData}
                  </Badge>
                </div>
              </div>
              {index < recentTransData.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignPerformance;
