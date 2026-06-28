"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, TooltipProps,} from "recharts";
import { EllipsisVertical, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";

const chartData = [
  { name: "Mon", Status: 15 },
  { name: "Tue", Status: 25 },
  { name: "Wed", Status: 18 },
  { name: "Thu", Status: 15 },
  { name: "Fri", Status: 23 },
  { name: "Sat", Status: 20 },
  { name: "Sun", Status: 15 },
];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg bg-background px-3 py-2 text-foreground shadow-lg">
      {/* Title */}
      <p className="mb-1 text-sm font-semibold">{label}</p>

      {/* Row */}
      <div className="flex items-center gap-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-muted-foreground" />
        <span className="text-foreground/80">Weekly Stats:</span>
        <span className="font-semibold text-foreground">{payload[0].value}</span>
      </div>
    </div>
  );
};

const WeeklySales = () => {
  return (
    <Card className="py-6 gap-6 h-full">
      <CardHeader className="px-6 gap-6">
        <div className="flex items-center justify-between gap-2 ">
          <CardTitle className="text-lg font-medium">Weekly Sales</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={"p-2.5 rounded-full hover:bg-muted cursor-pointer"}
            >
              <EllipsisVertical width={16} height={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[150px]">
              <DropdownMenuItem>Weekly</DropdownMenuItem>
              <DropdownMenuItem>Monthly</DropdownMenuItem>
              <DropdownMenuItem>Yearly</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-4 rounded-full outline outline-border">
            <CalendarDays width={16} height={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-medium text-card-foreground">
                $96,850
              </p>
              <Badge className="h-auto px-2 py-0.5 bg-red-500/10 text-red-500">
                -5%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </div>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="px-6">
        <div className="-me-3 rtl:me-0 rtl:-ms-12">
          <ResponsiveContainer width="100%" height={256}>
            <BarChart
              data={chartData}
              barSize={28}
              barGap={0}
              barCategoryGap="40%"
              margin={{ top: 0, right: 0, left: -10, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#adb0bb", fontSize: 12 }}
              />
              <YAxis hide />

              <Tooltip
                cursor={{ fill: "transparent" }}
                content={<CustomTooltip />}
              />

              <Bar dataKey="Status" radius={[40, 40, 40, 40]}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fillOpacity={index === 1 ? 1 : 0.2}
                    fill="var(--color-primary)"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklySales;
