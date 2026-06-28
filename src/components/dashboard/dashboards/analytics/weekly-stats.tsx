"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Presentation, MessageSquareMore } from 'lucide-react'
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge";

export const WeeklyStats = () => {
    const chartData = [
        { name: "1", sales: 5 },
        { name: "1", sales: 7 },
        { name: "2", sales: 15 },
        { name: "3", sales: 5 },
        { name: "4", sales: 10 },
        { name: "5", sales: 5 },
        { name: "5", sales: 8 },
    ]

    const chartConfig = {
        sales: {
            label: "Sales",
            color: "var(--color-primary)",
        },
    }
    const SalesData = [
        {
            key: "topSales",
            title: "Top Sales",
            subtitle: "Johnathan Doe",
            badgeColor: "bg-teal-500/10 text-teal-500",
            bgcolor: "bg-sky-400/10 text-sky-400",
            record: '+68',
            Icon: Presentation,
        },
        {
            key: "topSeller",
            title: "Best Seller",
            subtitle: "Footware",
            badgeColor: "bg-teal-500/10 text-teal-500",
            bgcolor: "bg-teal-400/10 text-teal-400",
            record: '+12',
            Icon: Star,
        },
        {
            key: "topCommented",
            title: " Most Commented",
            subtitle: "Fashionware",
            badgeColor: "bg-red-500/10 text-red-500",
            bgcolor: "bg-orange-400/10 text-orange-400",
            record: '-36',
            Icon: MessageSquareMore,
        }
    ]
    return (
        <Card className="py-6 gap-6">
            <div className="flex flex-col h-full">
                <CardHeader className="px-6 gap-0">
                    <CardTitle className="text-lg font-semibold">Weekly Stats</CardTitle>
                    <CardDescription className="text-sm font-normal"> Average sales</CardDescription>
                </CardHeader>
                <CardContent className="px-6">
                    <div className="my-6">
                        <ChartContainer config={chartConfig} className="h-44! w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                                            <stop
                                                offset="5%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0.3}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--color-primary)"
                                                stopOpacity={0}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <Tooltip
                                        content={<ChartTooltipContent />}
                                        cursor={false}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="var(--color-primary)"
                                        fill="url(#earningGradient)"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        dot={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                    <div className="flex flex-col gap-6 ">
                        {SalesData.map((item) => {
                            return (
                                <div key={item.key} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 flex justify-center items-center rounded-lg border border-border`}>
                                            <item.Icon className="h-5 w-5 text-center" />
                                        </div>
                                        <div>
                                            <h6 className="text-base">{item.title}</h6>
                                            <p className="text-sm font-normal text-muted-foreground">{item.subtitle}</p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={cn(
                                            "py-0.5 px-2 rounded-full text-sm font-normal text-muted-foreground",
                                            item.badgeColor,
                                        )}
                                    >{item.record}
                                    </Badge>
                                </div>
                            )
                        })}
                    </div>
                </CardContent>
            </div>
        </Card>
    )
}