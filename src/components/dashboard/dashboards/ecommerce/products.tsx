"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";

const chartConfig = {
    value: {
        label: "Share",
    },
    year2024: {
        label: "2024",
        color: "var(--color-blue-500)",
    },
    year2023: {
        label: "2023",
        color: "var(--color-teal-400)",
    },
    year2022: {
        label: "2022",
        color: "var(--muted)",
    },
} satisfies ChartConfig;

const data = [
    { year: "2022", value: 18, fill: "var(--color-chart-1)" },
    { year: "2023", value: 30, fill: "var(--color-chart-2)" },
    { year: "2024", value: 70, fill: "var(--color-primary)" },
];

const Products = () => {
    return (
        <>
            <Card className="ring-border shadow-none justify-between h-full py-6 gap-6">
                <CardHeader className="flex flex-row items-center justify-between text-start px-6">
                    <div>
                        <CardTitle className="text-lg font-semibold text-card-foreground">
                            Products
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                            Last 7 days
                        </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                        <p className="text-base font-semibold text-card-foreground">
                            12,389
                        </p>
                        <Badge className="bg-teal-500/10 text-teal-500 font-normal">
                            +26.5%
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="px-6">
                    <div className="h-40! w-full">
                        <ChartContainer
                            config={chartConfig}
                            className="mx-auto aspect-square h-40!"
                        >
                            <PieChart>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    nameKey="year"
                                    innerRadius={50}
                                />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </CardContent>
                <CardFooter className="justify-center bg-card border-t-0 p-6 pt-0 pb-0">
                    <p className="text-sm font-medium text-muted-foreground text-center">
                        $18k Profit more than last month
                    </p>
                </CardFooter>
            </Card>
        </>
    );
};

export default Products;
