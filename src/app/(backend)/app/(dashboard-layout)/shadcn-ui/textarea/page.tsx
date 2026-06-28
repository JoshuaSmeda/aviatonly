import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp'
import { Metadata } from 'next';
import CodePreview from '@/app/components/shared/code-preview';
import TextareaWithHelperTextRightDemo from '@/app/components/shadcn-ui/textarea/textarea-08';
import TextareaDisabledDemo from '@/app/components/shadcn-ui/textarea/textarea-09';
import TextareaWithFloatingLabelDemo from '@/app/components/shadcn-ui/textarea/textarea-07';
import Example from '@/app/components/shadcn-ui/textarea/textarea-06';
import TextareaAutoGrowDemo from '@/app/components/shadcn-ui/textarea/textarea-05';
import TextareaWithButtonDemo from '@/app/components/shadcn-ui/textarea/textarea-04';
import TextareaRequiredDemo from '@/app/components/shadcn-ui/textarea/textarea-03';
import TextareaIconDemo from '@/app/components/shadcn-ui/textarea/textarea-02';
import FeedbackTextarea from '@/app/components/shadcn-ui/textarea/textarea-01';

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Textarea",
    },
];

export const metadata: Metadata = {
    title: "Ui Textarea",
};


function page() {
    return (
        <>
            <BreadcrumbComp title="Textarea" items={BCrumb} />
            <div className='grid gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'>
                <CodePreview
                    component={<FeedbackTextarea />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-01.tsx"
                    title="Feedback  Textarea"
                />
                <CodePreview
                    component={<TextareaIconDemo />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-02.tsx"
                    title="Icon  Textarea"
                />
                <CodePreview
                    component={<TextareaRequiredDemo />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-03.tsx"
                    title="Required  Textarea"
                />
                <CodePreview
                    component={<TextareaWithButtonDemo />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-04.tsx"
                    title="Button  Textarea"
                />
                <CodePreview
                    component={<TextareaAutoGrowDemo />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-05.tsx"
                    title="AutoGrow  Textarea"
                />

                <CodePreview
                    component={<Example />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-06.tsx"
                    title="FloatingLabel  Textarea"
                />
                <CodePreview
                    component={<TextareaWithHelperTextRightDemo />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-08.tsx"
                    title="HelperTextRight  Textarea"
                />
                <CodePreview
                    component={<TextareaDisabledDemo />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-09.tsx"
                    title="Standard  Textarea"
                />
                <CodePreview
                    component={<TextareaWithFloatingLabelDemo />}
                    filePath="/app/components/shadcn-ui/textarea/textarea-07.tsx"
                    title="FloatingLabel  Textarea"
                />


            </div>

        </>

    )
}

export default page