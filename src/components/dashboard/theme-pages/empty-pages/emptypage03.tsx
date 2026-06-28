import React from 'react'
import { Card } from '@/components/ui/card';
import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { ArrowLeft } from 'lucide-react';

function Emptypage03() {
    return (
        <div className='flex justify-center items-center w-full min-h-[calc(100vh-140px)] '>

            <Card className='mx-auto max-w-md'>
                <Empty className='gap-6 p-8' >


                    <EmptyHeader>
                        <EmptyMedia>
                            <img
                                src="/images/backgrounds/404.svg"
                                alt="Access Blocked"
                                width={160}
                                height={160}
                                className="mx-auto"
                            />
                        </EmptyMedia>


                        <EmptyTitle>
                            Access to this page is blocked!
                        </EmptyTitle>

                        <EmptyDescription className="text-muted-foreground ">
                            Please try another way or make sure you have the necessary permissions.
                        </EmptyDescription>
                    </EmptyHeader>


                    <EmptyContent className="flex items-center justify-center flex-row gap-3">
                        <Button variant="default"><ArrowLeft /> Go back </Button>
                        <Button variant="outline">Contact support</Button>
                    </EmptyContent>

                </Empty>
            </Card>
        </div>

    )
}

export default Emptypage03