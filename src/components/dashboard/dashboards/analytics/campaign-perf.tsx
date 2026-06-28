"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import { Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from 'lucide-react';

// ---- DATA ----
const CampaignData = [
  {
    title: "Instagram",
    users: "8.49k users",
    icon: "simple-icons:instagram",

    badgevalue: "Running",
    badgeColor: "bg-chart-2/10 text-chart-2",
    divider: true,
  },
  {
    title: "Google",
    users: "9.12k users",
    icon: "devicon:google",
    badgevalue: "Running",
    badgeColor: "bg-orange-600/10 text-orange-600",
    divider: true,
  },
  {
    title: "Facebook",
    users: "6.98k users",
    icon: "logos:facebook",
    badgevalue: "Stopped",
    badgeColor: "bg-rose-600/10 text-rose-600",
    divider: true,
  },
  {
    title: "X/Twiter",
    users: "8.92k users",
    icon: "pajamas:twitter",
    badgevalue: "Stopped",
    badgeColor: "bg-rose-600/10 text-rose-600",
    divider: true,
  },

];

const CampaignPerformance = () => {
  const [items] = useState([{ title: "Export Data" }]);

  return (
    <Card className="p-0 gap-0 h-full">
      <CardHeader className="gap-0 p-6">
        <CardTitle><h4 className="text-lg font-medium ">Campaign Performance</h4></CardTitle>

        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="ghost" className="cursor-pointer" size="icon">
                <Ellipsis
                  size={24}
                  className="text-muted-foreground "
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 shadow-md bg-card border-0">
              {items.map((item, i) => (
                <DropdownMenuItem
                  key={i}
                  className="rounded-sm cursor-pointer hover:text-primary text-sm"
                >
                  {item.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>



      <CardContent className='px-0'>
        <div

          className='flex flex-col '
        >
          {CampaignData.map((item, index) => (
            <React.Fragment key={index}>
              <div
                className='flex gap-3 items-center px-6 py-4'
              >
                <div
                  className={cn(`flex justify-center items-center overflow-hidden p-3 rounded-md outline outline-border`)}
                >
                  <Icon icon={item.icon} height={20} width={20} />
                </div>
                <div className="flex items-center justify-between flex-1">
                  <div>
                    <h5 className='text-base font-medium text-foreground'>{item.title}</h5>
                    <p className='text-sm font-normal tracking-wide text-muted-foreground'>
                      {item.users}
                    </p>
                  </div>
                  <Badge
                    className={cn(item.badgeColor)}
                  >
                    {item.badgevalue}
                  </Badge>
                </div>
              </div>
              <Separator />
            </React.Fragment>
          ))}
          <div className="py-4 px-6 flex justify-center gap-1.5 items-center" >
            <Button variant="ghost" className={"px-4 py-2 cursor-pointer"}>
              View Detailed Analytics
              <ArrowRight size={16} />
            </Button>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignPerformance;
