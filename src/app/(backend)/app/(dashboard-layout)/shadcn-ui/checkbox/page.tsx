import { Metadata } from 'next';
import React from 'react'
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp';
import CodePreview from '@/app/components/shared/code-preview';
import SelectRequiredDemo from '@/app/components/shadcn-ui/select/select-01';
import CheckboxVerticalGroupDemo from '@/app/components/shadcn-ui/checkbox/checkbox-02';
import CheckboxColorsDemo from '@/app/components/shadcn-ui/checkbox/checkbox-03';
import CheckboxTodoListDemo from '@/app/components/shadcn-ui/checkbox/checkbox-04';
import CheckboxListGroupDemo from '@/app/components/shadcn-ui/checkbox/checkbox-05';
import CheckboxFormDemo from '@/app/components/shadcn-ui/checkbox/checkbox-06';
import CheckboxCustomIconsDemo from '@/app/components/shadcn-ui/checkbox/checkbox-07';
import CheckboxDashedDemo from '@/app/components/shadcn-ui/checkbox/checkbox-08';
import CheckboxTreeDemo from '@/app/components/shadcn-ui/checkbox/checkbox-09';


export const metadata: Metadata = {
    title: "Ui Checkbox",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Checkbox",
    },
];


function page() {
    return (
        <>
            <BreadcrumbComp title="Checkbox" items={BCrumb} />
            <div className="grid  sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                <CodePreview title="Checkbox" component={<SelectRequiredDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-01.tsx'} />
                <CodePreview title="Checkbox VerticalGroup" component={<CheckboxVerticalGroupDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-02.tsx'} />
                <CodePreview title="Checkbox Colors" component={<CheckboxColorsDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-03.tsx'} />
                <CodePreview title="Checkbox TodoList" component={<CheckboxTodoListDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-04.tsx'} />
                <CodePreview title="Checkbox ListGroup" component={<CheckboxListGroupDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-05.tsx'} />
                <CodePreview title="Checkbox Form" component={<CheckboxFormDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-06.tsx'} />
                <CodePreview title="Checkbox CustomIcons" component={<CheckboxCustomIconsDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-07.tsx'} />
                <CodePreview title="Checkbox Dashed" component={<CheckboxDashedDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-08.tsx'} />
                <CodePreview title="Checkbox Tree" component={<CheckboxTreeDemo />} filePath={'/app/components/shadcn-ui/checkbox/checkbox-09.tsx'} />

            </div>
        </>
    )
}

export default page