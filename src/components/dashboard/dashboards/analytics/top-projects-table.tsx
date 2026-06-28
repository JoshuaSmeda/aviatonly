"use client";

import { LucideIcon, AppWindowMac, HandMetal, Megaphone, Contrast, Brush, ShieldUser } from 'lucide-react';
import { FolderPlus, FolderPen, FolderMinus } from 'lucide-react';
import { EllipsisVertical, Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Input } from '@/components/ui/input';

interface TableAction {
    icon: LucideIcon;
    listtitle: string;
}

interface ProjectData {
    project: string;
    date: string;
    budget: string;
    icon: LucideIcon;
    avatar: string[];
    name: string;
    handle: string;
    progress: number;
    progressColor: string;
}

const TopProjectsTable = () => {
    const tableActionData: TableAction[] = [
        { icon: FolderPlus, listtitle: "Add" },
        { icon: FolderPen, listtitle: "Edit" },
        { icon: FolderMinus, listtitle: "Delete" },
    ];

    const checkboxTableData: ProjectData[] = [
        {
            project: 'Web App Project',
            date: "04 June 2026",
            budget: 'Organic',
            icon: AppWindowMac,
            avatar: ["https://images.shadcnspace.com/assets/profiles/user-8.jpg", "https://images.shadcnspace.com/assets/profiles/user-11.jpg", "https://images.shadcnspace.com/assets/profiles/user-3.jpg"],
            name: 'Olivia Rhye',
            handle: 'olivia@ui.com',
            progress: 60,
            progressColor: '**:data-[slot=progress-indicator]:bg-orange-600'
        },
        {
            project: 'MaterialM Admin',
            date: "09 January 2026",
            budget: 'Paid',
            icon: HandMetal,
            avatar: ["https://images.shadcnspace.com/assets/profiles/user-8.jpg", "https://images.shadcnspace.com/assets/profiles/user-7.jpg", "https://images.shadcnspace.com/assets/profiles/user-3.jpg"],
            name: 'Barbara Steele',
            handle: 'steele@ui.com',
            progress: 30,
            progressColor: '**:data-[slot=progress-indicator]:bg-emerald-600'
        },
        {
            project: 'Digital Marketing',
            date: "15 April 2026",
            budget: 'Email',
            icon: Megaphone,
            avatar: ["https://images.shadcnspace.com/assets/profiles/user-8.jpg", "https://images.shadcnspace.com/assets/profiles/user-5.jpg", "https://images.shadcnspace.com/assets/profiles/user-3.jpg"],
            name: 'Leonard Gordon',
            handle: 'olivia@ui.com',
            progress: 45,
            progressColor: '**:data-[slot=progress-indicator]:bg-orange-600'
        },
        {
            project: 'Shadcn Space Design',
            date: "30 March 2026",
            budget: 'Social',
            icon: Contrast,
            avatar: ["https://images.shadcnspace.com/assets/profiles/user-8.jpg", "https://images.shadcnspace.com/assets/profiles/user-1.jpg", "https://images.shadcnspace.com/assets/profiles/user-3.jpg"],
            name: 'Evelyn Pope',
            handle: 'steele@ui.com',
            progress: 37,
            progressColor: '**:data-[slot=progress-indicator]:bg-red-500'
        },
        {
            project: 'Graphic Design',
            date: "23 October 2026",
            budget: 'Social',
            icon: Brush,
            avatar: ["https://images.shadcnspace.com/assets/profiles/user-8.jpg", "https://images.shadcnspace.com/assets/profiles/user-11.jpg"],
            name: 'Tommy Garza',
            handle: 'olivia@ui.com',
            progress: 87,
            progressColor: '**:data-[slot=progress-indicator]:bg-emerald-600'
        },
        {
            project: 'Digital Marketing',
            date: "15 April 2026",
            budget: 'Paid',
            icon: Megaphone,
            avatar: ["https://images.shadcnspace.com/assets/profiles/user-8.jpg", "https://images.shadcnspace.com/assets/profiles/user-1.jpg"],
            name: 'Leonard Gordon',
            handle: 'olivia@ui.com',
            progress: 45,
            progressColor: '**:data-[slot=progress-indicator]:bg-amber-400'
        },
        {
            project: 'ShadcnSpace Admin',
            date: "09 January 2026",
            budget: 'Paid',
            icon: ShieldUser,
            avatar: ["https://images.shadcnspace.com/assets/profiles/user-8.jpg", "https://images.shadcnspace.com/assets/profiles/user-7.jpg", "https://images.shadcnspace.com/assets/profiles/user-3.jpg"],
            name: 'Barbara Steele',
            handle: 'steele@ui.com',
            progress: 30,
            progressColor: '**:data-[slot=progress-indicator]:bg-emerald-600'
        },
    ];

    return (
        <Card className="w-full h-full gap-6 py-6 justify-between">
            <CardHeader className='sm:flex items-center justify-between px-6'>
                <div>
                    <CardTitle className='text-lg font-medium'>Top Campaigns</CardTitle>
                </div>
                <div className='relative'>
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                        <Search size={18} />
                    </span>
                    <Input
                        type='text'
                        placeholder='Search'
                        required
                        className='pl-10 focus-visible:ring-0 '
                    />
                </div>
            </CardHeader>
            <CardContent className="px-0">
                <div className="overflow-x-auto">
                    <Table className="min-w-2xl">
                        <TableHeader className='border-t border-border'>
                            <TableRow className="hover:bg-transparent!">
                                <TableHead className="p-3 ps-6">#</TableHead>
                                <TableHead className="p-2">Campaign Name</TableHead>
                                <TableHead className="p-2">Channel</TableHead>
                                <TableHead className="p-2">Audience</TableHead>
                                <TableHead className="p-2">Performance</TableHead>
                                <TableHead className="p-3 pe-6 flex justify-end">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-border dark:divide-darkborder">
                            {checkboxTableData.map((item, index) => (
                                <TableRow key={index}>
                                    {/* Checkbox */}
                                    <TableCell className="whitespace-nowrap p-3 ps-6">
                                        <Checkbox className="data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 dark:data-[state=checked]:border-blue-500 cursor-pointer" />
                                    </TableCell>

                                    {/* project */}
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className={cn("h-9 w-9 rounded-full flex items-center justify-center border border-border")}>
                                                <item.icon width={18} height={18} />
                                            </div>
                                            <div className="">
                                                <h6 className="text-sm font-medium">{item.project}</h6>
                                                <p className="text-xs text-muted-foreground">{item.date}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Status Badge */}
                                    <TableCell className="whitespace-nowrap">
                                        <p className="text-sm text-foreground">
                                            {item.budget}
                                        </p>
                                    </TableCell>

                                    {/* Customer */}
                                    <TableCell className="whitespace-nowrap">
                                        <div className="flex items-center">
                                            {item.avatar.map((avatar, index) => (
                                                <img
                                                    key={index}
                                                    src={avatar}
                                                    alt="icon"
                                                    className="h-9 w-9 rounded-full object-cover"
                                                    style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                                                    width={36}
                                                    height={36}
                                                />
                                            ))}
                                        </div>
                                    </TableCell>

                                    {/* Progress */}
                                    <TableCell className="whitespace-nowrap">
                                        <Progress
                                            value={item.progress}
                                            className={cn("w-full [&>div]:h-1.5", `${item.progressColor}`)}
                                        />
                                    </TableCell>

                                    {/* Dropdown Menu */}
                                    <TableCell className="whitespace-nowrap p-3 pe-6">
                                        <div className="flex items-center justify-end">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger>
                                                    <span className="flex justify-center items-center rounded-full p-2 hover:bg-muted cursor-pointer">
                                                        <EllipsisVertical width={16} height={16} />
                                                    </span>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent align="end">
                                                    {tableActionData.map((action, idx) => (
                                                        <DropdownMenuItem key={idx} className="group flex gap-3 hover:bg-accent! cursor-pointer">
                                                            <action.icon />
                                                            <span>{action.listtitle}</span>
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default TopProjectsTable;
