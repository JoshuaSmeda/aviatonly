"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const purchasers = [
    {
        id: 1,
        name: "User 1",
        img: "https://images.shadcnspace.com/assets/profiles/user-1.jpg",
    },
    {
        id: 2,
        name: "User 2",
        img: "https://images.shadcnspace.com/assets/profiles/user-2.jpg",
    },
    {
        id: 3,
        name: "User 3",
        img: "https://images.shadcnspace.com/assets/profiles/user-3.jpg",
    },
];

const LatestDeal = () => {
    return (
        <Card className={"ring-border shadow-none gap-8 justify-between h-full py-6"}>
            <CardHeader className="flex flex-row items-baseline justify-between space-y-0 px-6">
                <div className="text-start flex flex-col gap-1">
                    <CardTitle className="text-lg font-semibold text-card-foreground">
                        Latest Deal 
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Last 7 days
                    </CardDescription>
                </div>
                <Badge className="bg-teal-500/10 text-teal-500 px-2 leading-0">
                    86.5%
                </Badge>
            </CardHeader>

            <CardContent className="flex flex-col gap-8 px-6">
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-baseline">
                        <p className="text-base font-semibold text-card-foreground">
                            $98,500
                        </p>
                        <p className="text-base font-semibold text-card-foreground">
                            $1,22,900
                        </p>
                    </div>
                    <Progress
                        value={80}
                        className="w-full h-1.5 [&>div]:h-1.5 gap-0 **:data-[slot=progress-track]:bg-primary/5 **:data-[slot=progress-indicator]:bg-primary"
                    />
                    <p className="text-sm text-muted-foreground">Coupons used: 18/22</p>
                </div>

                <div className="flex flex-col gap-4 text-start">
                    <p className="text-sm font-semibold text-card-foreground">
                        Recent Purchasers
                    </p>
                    <div className="flex -space-x-2">
                        {purchasers.map((p) => (
                            <Avatar key={p.id} className="size-10 border-2 border-background">
                                <AvatarImage src={p.img} alt={p.name} />
                                <AvatarFallback className="text-sm font-semibold text-card-foreground">
                                    {p.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                        ))}
                        <Avatar className="size-10 border-2 border-background">
                            <AvatarFallback className="bg-muted text-base font-medium text-card-foreground ring-0">
                                +4
                            </AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default LatestDeal;
