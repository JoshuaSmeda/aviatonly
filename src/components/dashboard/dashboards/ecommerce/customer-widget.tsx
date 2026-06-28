"use client";

import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart } from "recharts";

const chartConfig = {
    customers: {
        label: "Customers",
        color: "var(--color-sky-400)",
    },
} satisfies ChartConfig;

const data = [
    { day: "Day 1", customers: 15 },
    { day: "Day 2", customers: 18 },
    { day: "Day 3", customers: 66 },
    { day: "Day 4", customers: 20 },
    { day: "Day 5", customers: 40 },
    { day: "Day 6", customers: 12 },
    { day: "Day 7", customers: 30 },
];

const Customer = () => {
    return (
        <>
            <Card className="ring-border shadow-none justify-between h-full py-6 gap-6">
                <CardHeader className="flex flex-row items-center justify-between pb-2 px-6">
                    <div className="text-start">
                        <CardTitle className="text-lg font-semibold text-card-foreground">
                            Customers
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Last 7 days
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <h5 className="text-lg font-semibold text-card-foreground">6,380</h5>
                        <Badge className="bg-teal-500/10 text-teal-500 font-normal">
                            +26.5%
                        </Badge>
                    </div>
                </CardHeader>

                <CardContent className="px-6">
                    <div className="h-24! w-full">
                        <ChartContainer config={chartConfig} className="h-24! w-full">
                            <AreaChart
                                data={data}
                                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorCustomers"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="var(--color-primary)"
                                            stopOpacity={0.15}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="var(--color-primary)"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="customers"
                                    stroke="var(--color-primary)"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorCustomers)"
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </CardContent>

                <CardFooter className="bg-card border-t-0 flex flex-col gap-3 p-6 pt-0 pb-0">
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="bg-primary rounded-lg w-5 h-3"></span>
                            <p className="text-sm font-normal text-card-foreground">
                                April 07 - April 14
                            </p>
                        </div>
                        <p className="text-sm font-normal text-muted-foreground">6,380</p>
                    </div>
                    <div className="w-full flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="bg-muted rounded-lg w-5 h-3"></span>
                            <p className="text-sm font-normal text-muted-foreground">Last Week</p>
                        </div>
                        <p className="text-sm font-normal text-muted-foreground">4,298</p>
                    </div>
                </CardFooter>
            </Card>
        </>
    );
};

export default Customer;
