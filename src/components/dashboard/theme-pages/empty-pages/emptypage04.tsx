import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"

import { RefreshCcwIcon } from "lucide-react"
import { Card } from '@/components/ui/card';
import { WifiOff } from 'lucide-react';


function Emptypage04() {
    return (
        <div className='flex justify-center items-center w-full min-h-[calc(100vh-140px)] '>

            <Card className='mx-auto max-w-sm p-8'>
                <Empty className="h-full p-8 gap-6">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <WifiOff />
                        </EmptyMedia>
                        <EmptyTitle>No Internet Connection</EmptyTitle>
                        <EmptyDescription className="max-w-xs text-pretty">
                            It seems you are offline. Check your internet connection and try again.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button >
                            <RefreshCcwIcon />
                            Try Again
                        </Button>
                    </EmptyContent>
                </Empty>
            </Card>
        </div>
    )
}

export default Emptypage04