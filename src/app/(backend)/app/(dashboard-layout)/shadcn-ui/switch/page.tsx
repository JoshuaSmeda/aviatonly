import { Metadata } from 'next';
import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp';
import SwitchActiveEffectDemo from '@/app/components/shadcn-ui/switch/switch-01';
import CodePreview from '@/app/components/shared/code-preview';
import SwitchWithIconDemo from '@/app/components/shadcn-ui/switch/switch-02';
import SwitchToggleThemeDemo from '@/app/components/shadcn-ui/switch/switch-03';
import SwitchWithDescriptionDemo from '@/app/components/shadcn-ui/switch/switch-04';
import SwitchWithNormalLabelDemo from '@/app/components/shadcn-ui/switch/switch-05';
import SwitchCustomColorDemo from '@/app/components/shadcn-ui/switch/switch-06';



export const metadata: Metadata = {
    title: "Ui Switch",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Switch",
    },
];


function page() {
    return (
        <>

            <BreadcrumbComp title="Switch" items={BCrumb} />
            <div className="grid  sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3  gap-6">
                <CodePreview
                    component={<SwitchActiveEffectDemo />}
                    filePath="/app/components/shadcn-ui/switch/switch-01.tsx"
                    title="Active Effect Switch"
                />
                <CodePreview
                    component={<SwitchWithIconDemo />}
                    filePath="/app/components/shadcn-ui/switch/switch-02.tsx"
                    title="Switch WithIcon"
                />

                <CodePreview
                    component={<SwitchToggleThemeDemo />}
                    filePath="/app/components/shadcn-ui/switch/switch-03.tsx"
                    title="Switch ToggleTheme"
                />
                <CodePreview
                    component={<SwitchWithDescriptionDemo />}
                    filePath="/app/components/shadcn-ui/switch/switch-04.tsx"
                    title="Switch WithDescription"
                />
                <CodePreview
                    component={<SwitchWithNormalLabelDemo />}
                    filePath="/app/components/shadcn-ui/switch/switch-05.tsx"
                    title="Switch WithNormalLabel"
                />
                <CodePreview
                    component={<SwitchCustomColorDemo />}
                    filePath="/app/components/shadcn-ui/switch/switch-06.tsx"
                    title="Switch CustomColor"
                />
            </div>
        </>
    )
}

export default page