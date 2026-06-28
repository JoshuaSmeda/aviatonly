import React from 'react'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { Folder, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

function Emptypage01() {
    return (
        <div className='flex justify-center items-center w-full min-h-[calc(100vh-140px)] '>
            <Card className='mx-auto max-w-sm '>
                <Empty className='p-8 gap-6 '>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <Folder />
                        </EmptyMedia>
                        <EmptyTitle>No Projects Yet</EmptyTitle>
                        <EmptyDescription>
                            You haven&apos;t created any projects yet. Get started by creating
                            your first project.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent className="flex-row justify-center gap-2">
                        <Button>Create Project</Button>
                        <Button variant="outline">Import Project</Button>
                    </EmptyContent>
                    <Button
                        variant="link"
                        className="text-muted-foreground"
                        size="sm"
                    >
                        <a href="#" className="flex items-center gap-1">
                            Learn More <ArrowUpRight />
                        </a>
                    </Button>
                </Empty >
            </Card>
        </div>

    )
}

export default Emptypage01