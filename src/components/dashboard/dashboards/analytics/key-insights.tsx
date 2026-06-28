"use client";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { BarChart, Bar, XAxis, YAxis, } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CirclePlus, Ellipsis, Pencil, Trash2 } from "lucide-react";


export default function KeyInsights() {
  /*Table Action*/
  const Action = [
    {
      icon: CirclePlus,
      listtitle: "Add",
    },
    {
      icon: Pencil,
      listtitle: "Edit",
    },
    {
      icon: Trash2,
      listtitle: "Delete",
    },
  ];



  const chartConfig = {
    Asia: {
      label: "Asia",
      color: "var(--chart-1)",
    },
    USA: {
      label: "USA",
      color: "var(--chart-2)",
    },
    Europe: {
      label: "Europe",
      color: "var(--chart-3)",
    },
  }


  const data = [
    {
      name: "distribution",
      Asia: 60,
      USA: 25,
      Europe: 15,
    },
  ];

  return (
    <Card className="gap-4">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 px-6">
        <div className="flex flex-col gap-6">
          <CardTitle className="text-lg font-semibold text-card-foreground">
            Key Insights
          </CardTitle>
          <div className="flex flex-col gap-1">
            <p className="text-base font-normal text-muted-foreground">
              All-time Revenue
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-semibold text-foreground">$395.7k</p>
              <Badge variant="secondary" className="bg-chart-2/10  text-chart-2  border-none font-normal px-2 py-0.5 text-xs">
                +2.7%
              </Badge>
            </div>
          </div>
        </div>


        <DropdownMenu>

          <DropdownMenuTrigger>
            <Button variant="ghost" className="cursor-pointer" size="icon">
              <Ellipsis
                size={24}
                className="text-muted-foreground "
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-1">
            {Action.map((items, index) => (
              <DropdownMenuItem
                key={index}
                className="flex items-center gap-2 font-normal cursor-pointer"
              >
                <items.icon size={16} />
                <span className="text-xs">{items.listtitle}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 pt-0 px-6">
        <div className="flex flex-col gap-1.5 ">
          <ChartContainer
            config={chartConfig}

            className="w-full h-4!"
          >
            <BarChart
              data={data}
              layout="vertical"
              margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
            >
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                dataKey="Asia"
                stackId="a"
                fill="var(--color-Asia)"
                radius={5}
                barSize={18}
                stroke="var(--background)"
                strokeWidth={2}
              />
              <Bar
                dataKey="USA"
                stackId="a"
                fill="var(--color-USA)"

                radius={5}
                barSize={18}

                stroke="var(--background)"
                strokeWidth={2}
              />
              <Bar
                dataKey="Europe"
                stackId="a"
                fill="var(--color-Europe)"
                radius={5}
                barSize={18}


                stroke="var(--background)"
                strokeWidth={2}
              />
            </BarChart>
          </ChartContainer>


        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-chart-1"></div>
            <p className="text-xs font-normal text-foreground">Asia</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full  bg-chart-2"></div>
            <p className="text-xs font-normal text-foreground">USA</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full  bg-chart-3"></div>
            <p className="text-xs font-normal text-foreground">Europe</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
