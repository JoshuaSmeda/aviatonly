"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig, } from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

const chartData = [
    { year: "2024", revenue: 275, fill: "var(--color-chart-2)" },
    { year: "2025", revenue: 200, fill: "var(--color-chart-1)" },
    { year: "current", revenue: 187, fill: "var(--color-primary)" },
];

const chartConfig = {
    revenue: {
        label: "Revenue",
    },
    y2024: {
        label: "2024",
        color: "var(--color-chart-2)",
    },
    y2025: {
        label: "2025",
        color: "var(--color-chart-1)",
    },
    current: {
        label: "Current",
        color: "var(--color-primary)",
    },
} satisfies ChartConfig;

const YearlyBreakup = () => {
    return (
        <Card className="w-full py-6 ring-border shadow-none">
            <CardContent className="flex items-center gap-6 px-6">
                <div className="flex flex-col items-start justify-between gap-6 grow">
                    <p className="text-lg font-semibold text-card-foreground">
                        Yearly Backup
                    </p>
                    <div className="flex flex-col gap-0.5">
                        <p className="text-xl font-semibold text-card-foreground">
                            $36,358
                        </p>
                        <div className="flex items-center gap-1">
                            <Badge className="font-normal bg-teal-500/10 text-teal-500">
                                +9%
                            </Badge>
                            <p className="text-sm text-muted-foreground">last year</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-chart-2" />
                            <p className="text-sm text-muted-foreground">2024</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-chart-1" />
                            <p className="text-sm text-muted-foreground">2025</p>
                        </div>
                    </div>
                </div>
                {/* chart */}
                <ChartContainer config={chartConfig} className="w-36! h-36!">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="revenue"
                            nameKey="year"
                            innerRadius={38}
                            strokeWidth={0}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>

    );
};

export default YearlyBreakup;
