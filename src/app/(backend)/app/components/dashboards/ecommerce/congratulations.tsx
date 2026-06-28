"use client";

import {
    Card,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, Handbag, FileText, ClipboardList } from "lucide-react";

export interface ItemProps {
    icon: LucideIcon;
    orders: string;
    status: string;
}

const items: ItemProps[] = [
    {
        icon: Handbag,
        orders: "64 new orders",
        status: "Processing",
    },
    {
        icon: FileText,
        orders: "4 orders",
        status: "On hold",
    },
    {
        icon: ClipboardList,
        orders: "12 orders",
        status: "Delivered",
    },
];

const Congratulations = () => {
    return (

        <Card className="w-full h-full py-0">
            <CardContent className="flex items-center justify-between sm:flex-row flex-col sm:gap-0 gap-6 px-6 h-full">
                <div className="flex flex-col justify-between gap-6 h-full py-6">
                    <div>
                        <CardTitle className="text-lg font-semibold ">
                            Congratulations Jonathan
                        </CardTitle>
                        <CardDescription className="text-sm text-muted-foreground font-normal">
                            You have done 38% more sales
                        </CardDescription>
                    </div>
                    <div className="flex flex-col gap-6">
                        {items.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className={cn("p-3 rounded-lg border border-border")}>
                                    <item.icon width={16} height={16} />
                                </div>
                                <div>
                                    <p className="text-base font-semibold">{item.orders}</p>
                                    <p className="text-sm font-normal text-muted-foreground">{item.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="h-full flex items-end">
                    <img src="/images/backgrounds/ecommerce-img.svg" alt="ecommerce-img" width={270} height={300} className="dark:hidden" />
                    <img src="/images/backgrounds/ecommerce-img-dark.svg" alt="ecommerce-img" width={270} height={300} className="hidden dark:block" />
                </div>
            </CardContent>
        </Card>

    );
};

export default Congratulations;
