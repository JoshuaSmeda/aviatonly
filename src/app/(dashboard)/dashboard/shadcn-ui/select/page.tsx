import { Metadata } from 'next';
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp';
import CodePreview from '@/components/dashboard/shared/code-preview';
import SelectWithSeparatorDemo from '@/components/dashboard/shadcn-ui/select/select-09';
import SelectWithLeadingTextDemo from '@/components/dashboard/shadcn-ui/select/select-08';
import SelectWithAvatarsDemo from '@/components/dashboard/shadcn-ui/select/select-07';

import SelectWithOverlappingLabelDemo from '@/components/dashboard/shadcn-ui/select/select-05';
import SelectProgrammingDemo from '@/components/dashboard/shadcn-ui/select/select-04';
import SelectStatusDemo from '@/components/dashboard/shadcn-ui/select/select-03';
import SelectwithIconDemo from '@/components/dashboard/shadcn-ui/select/select-02';
import SelectRequiredDemo from '@/components/dashboard/shadcn-ui/select/select-01';


export const metadata: Metadata = {
    title: "Ui Select",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Select",
    },
];


function page() {
    return (
        <>

            <BreadcrumbComp title="Select" items={BCrumb} />
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">

                <CodePreview
                    component={<SelectRequiredDemo />}
                    filePath="/app/components/shadcn-ui/select/select-01.tsx"
                    title="Required Select"
                />

                <CodePreview
                    component={<SelectwithIconDemo />}
                    filePath="/app/components/shadcn-ui/select/select-02.tsx"
                    title="Icon Select"
                />
                <CodePreview
                    component={<SelectStatusDemo />}
                    filePath="/app/components/shadcn-ui/select/select-03.tsx"
                    title="Status Select"
                />
                <CodePreview
                    component={<SelectProgrammingDemo />}
                    filePath="/app/components/shadcn-ui/select/select-04.tsx"
                    title="Programming Select"
                />
                <CodePreview
                    component={<SelectWithOverlappingLabelDemo />}
                    filePath="/app/components/shadcn-ui/select/select-05.tsx"
                    title="Overlapping Label Select"
                />

                <CodePreview
                    component={<SelectWithAvatarsDemo />}
                    filePath="/app/components/shadcn-ui/select/select-07.tsx"
                    title="Avatars Select"
                />
                <CodePreview
                    component={<SelectWithLeadingTextDemo />}
                    filePath="/app/components/shadcn-ui/select/select-08.tsx"
                    title="Leading Text Select"
                />
                <CodePreview
                    component={<SelectWithSeparatorDemo />}
                    filePath="/app/components/shadcn-ui/select/select-09.tsx"
                    title="Separator Select"
                />
            </div>
        </>
    )
}

export default page