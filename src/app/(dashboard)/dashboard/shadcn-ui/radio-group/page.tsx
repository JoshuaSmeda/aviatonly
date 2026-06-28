import { Metadata } from 'next';
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp';
import CodePreview from '@/components/dashboard/shared/code-preview';
import RadioGroupAnimatedDemo from '@/components/dashboard/shadcn-ui/radio-group/radio-group-01';
import RadioGroupColorsDemo from '@/components/dashboard/shadcn-ui/radio-group/radio-group-02';
import RadioGroupwithPanCard from '@/components/dashboard/shadcn-ui/radio-group/radio-group-03';
import RadioGroupCardVerticalRadioDemo from '@/components/dashboard/shadcn-ui/radio-group/radio-group-04';
import RadioGroupDashedDemo from '@/components/dashboard/shadcn-ui/radio-group/radio-group-05';
import RadioGroupListGroupDemo from '@/components/dashboard/shadcn-ui/radio-group/radio-group-06';



export const metadata: Metadata = {
    title: "Ui Radio Group",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Radio Group",
    },
];


function RadioGroupPage() {
    return (
        <>
            <BreadcrumbComp title="Radio Group" items={BCrumb} />
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                <CodePreview
                    component={<RadioGroupAnimatedDemo />}
                    filePath="/app/components/shadcn-ui/radio-group/radio-group-01.tsx"
                    title="Animated Radio Group"
                />
                <CodePreview
                    component={<RadioGroupColorsDemo />}
                    filePath="/app/components/shadcn-ui/radio-group/radio-group-02.tsx"
                    title="Radio Group Colors"
                /><CodePreview
                    component={<RadioGroupwithPanCard />}
                    filePath="/app/components/shadcn-ui/radio-group/radio-group-03.tsx"
                    title="Radio Group with Pan Card"
                />

                <CodePreview
                    component={<RadioGroupCardVerticalRadioDemo />}
                    filePath="/app/components/shadcn-ui/radio-group/radio-group-04.tsx"
                    title="Radio Group Card Vertical Radio"
                />
                <CodePreview
                    component={<RadioGroupDashedDemo />}
                    filePath="/app/components/shadcn-ui/radio-group/radio-group-05.tsx"
                    title="Radio Group Dashed"
                />
                <CodePreview
                    component={<RadioGroupListGroupDemo />}
                    filePath="/app/components/shadcn-ui/radio-group/radio-group-06.tsx"
                    title="Radio Group List Group"
                />
            </div>

        </>
    )
}

export default RadioGroupPage