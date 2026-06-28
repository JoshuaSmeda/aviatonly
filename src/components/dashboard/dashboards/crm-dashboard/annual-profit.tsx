"use client";


import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@iconify/react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
} from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const AnnualProfit = () => {
    const dropdownItems = ["Action", "Another action", "Something else"];

    const chartData = [
        { month: "Jan", users: 25 },
        { month: "Feb", users: 66 },
        { month: "Mar", users: 20 },
        { month: "Apr", users: 40 },
        { month: "May", users: 12 },
        { month: "Jun", users: 58 },
        { month: "Jul", users: 20 },
    ]

    const chartConfig = {
        users: {
            label: "Users",
            color: "var(--color-primary)",
        },
    } satisfies ChartConfig
    return (
        <>
            <Card className="h-full py-6 gap-4">
                <CardHeader className="flex items-center justify-between px-6">
                    <CardTitle className="text-lg">Sales Funnel</CardTitle>
                    <div>
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <span className="h-9 w-9 flex justify-center items-center rounded-full hover:bg-accent  hover:text-accent-foreground cursor-pointer">
                                    <Icon icon='solar:menu-dots-bold' width={16} height={16} className='rotate-90' />
                                </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                {dropdownItems.map((items, index) => {
                                    return (
                                        <DropdownMenuItem
                                            key={index}
                                            className="font-normal cursor-pointer"
                                        >
                                            {items}
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>

                <CardContent className="px-6">
                    <div className="bg-muted rounded-md">
                        <div className="p-6 flex justify-between items-center">
                            <p className="text-sm font-normal text-muted-foreground">
                                Conversion Rate
                            </p>
                            <h4 className="text-xl font-semibold text-foreground">18.4%</h4>
                        </div>
                        <div className="h-[80px]!">
                            <ChartContainer config={chartConfig} className="h-[80px]! w-full">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-users)"
                                                stopOpacity={0.1}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-users)"
                                                stopOpacity={0.1}
                                            />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid vertical={false} strokeDasharray="3 3" />

                                    <XAxis
                                        dataKey="month"
                                        hide
                                    />

                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />

                                    <Area
                                        type="monotone"
                                        dataKey="users"
                                        stroke="var(--color-users)"
                                        fillOpacity={1}
                                        fill="url(#fillUsers)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="bg-card border-t-0 p-6 pt-0 pb-0">
                    <div className="flex flex-col gap-3 w-full divide-y divide-border ">
                        <div className="flex justify-between pb-3">
                            <div>
                                <h6 className="text-base font-medium text-foreground">
                                    Leads Generated
                                </h6>
                                <p className="text-sm font-normal text-muted-foreground">
                                    5 clicks
                                </p>
                            </div>
                            <div>
                                <h6 className="text-base font-semibold tracking-wide">
                                    $21,120
                                </h6>
                                <p className="font-medium text-sm text-right text-emerald-600">
                                    +13.2%
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between pb-3">
                            <div>
                                <h6 className="text-base font-medium text-foreground">
                                    Opportunities
                                </h6>
                                <p className="text-sm font-normal text-muted-foreground">
                                    5 clicks
                                </p>
                            </div>
                            <div>
                                <h6 className="text-base font-semibold tracking-wide">
                                    $21,120
                                </h6>
                                <p className="font-medium text-sm text-right text-emerald-600">
                                    +13.2%
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <h6 className="text-base font-medium text-foreground">
                                    Deals Closed
                                </h6>
                                <p className="text-sm font-normal text-muted-foreground">
                                    12 clicks
                                </p>
                            </div>
                            <div>
                                <h6 className="text-base font-semibold tracking-wide">
                                    $16,100
                                </h6>
                                <p className="text-sm font-medium text-right text-red-500">
                                    -7.4%
                                </p>
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
};

export default AnnualProfit;
