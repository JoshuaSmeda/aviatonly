"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { ChevronRight, LucideIcon, Users, Building, Search, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProjectType = {
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
};


const projectTypes: ProjectType[] = [
    {
        title: "Client Workspace",
        description: "Manage client projects, files, and communication in one place.",
        icon: Users,
        color: "bg-chart-2/10 text-chart-2",
    },
    {
        title: "Internal Operations",
        description: "Streamline team workflows, tasks, and internal processes.",
        icon: Building,
        color: "bg-chart-1/10 text-chart-1",
    },
    {
        title: "Research & Planning",
        description: "Collect ideas, insights, and plan your next big move.",
        icon: Search,
        color: "bg-chart-5/10 text-chart-5",
    },
];

function Emptypage02() {
    return (
        <div className='flex justify-center items-center w-full min-h-[calc(100vh-140px)] '>

            <Card className='mx-auto max-w-2xl text-center'>

                <CardHeader>
                    <CardTitle className='text-2xl  font-bold'>Create your first project</CardTitle>
                    <CardDescription className='text-muted-foreground text-sm'>Pick a starting point or create your project from scratch.</CardDescription>

                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                    {projectTypes.map((item, index) => (
                        <Card
                            key={index}
                            className="group flex cursor-pointer flex-row items-center gap-4 p-4 transition hover:bg-muted"
                        >
                            <div
                                className={`flex size-10 shrink-0 items-center justify-center rounded-full ${item.color}`}
                            >

                                <item.icon size={18} />
                            </div>

                            <div className="grow text-left">
                                <h3 className="text-base font-medium">{item.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {item.description}
                                </p>
                            </div>

                            <span className="ml-auto flex size-6 items-center justify-center rounded-full border">
                                <ChevronRight size={16} />
                            </span>
                        </Card>
                    ))}

                    <Button
                        variant="link"
                        className="text-muted-foreground"
                        size="sm"
                    >
                        <a href="#" className="flex items-center gap-1">
                            or start with a blank project<ArrowUpRight />
                        </a>
                    </Button>
                </CardContent>


            </Card>
        </div>
    )
}

export default Emptypage02