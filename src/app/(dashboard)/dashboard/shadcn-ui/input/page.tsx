import { Metadata } from 'next';
import BreadcrumbComp from '../../layout/shared/breadcrumb/breadcrumb-comp';
import CodePreview from '@/components/dashboard/shared/code-preview';
import InputDateDemo from '@/components/dashboard/shadcn-ui/input/input-01';
import InputTimeDemo from '@/components/dashboard/shadcn-ui/input/input-02';
import InputCurrencyDemo from '@/components/dashboard/shadcn-ui/input/input-03';
import InputRealTimeValidationDemo from '@/components/dashboard/shadcn-ui/input/input-04';
import InputAddOnsDemo from '@/components/dashboard/shadcn-ui/input/input-08';
import InputWithControlsDemo from '@/components/dashboard/shadcn-ui/input/input-07';
import InputCharacterLimitDemo from '@/components/dashboard/shadcn-ui/input/input-06';
import InputStartSelectDemo from '@/components/dashboard/shadcn-ui/input/input-05';
import InputFloatingLabelDemo from '@/components/dashboard/shadcn-ui/input/input-09';
import InputClearDemo from '@/components/dashboard/shadcn-ui/input/input-10';
import InputEndInlineButtonDemo from '@/components/dashboard/shadcn-ui/input/input-11';
import InputEndButtonDemo from '@/components/dashboard/shadcn-ui/input/input-12';
import InputFileDemo from '@/components/dashboard/shadcn-ui/input/input-13';
import InputErrorDemo from '@/components/dashboard/shadcn-ui/input/input-14';
import InputRequiredDemo from '@/components/dashboard/shadcn-ui/input/input-15';
import InputDefaultDemo from '@/components/dashboard/shadcn-ui/input/input-16';
import InputWithLabelDemo from '@/components/dashboard/shadcn-ui/input/input-17';
import InputDisabledDemo from '@/components/dashboard/shadcn-ui/input/input-18';




export const metadata: Metadata = {
    title: "Ui Input",
};

const BCrumb = [
    {
        to: "/",
        title: "Home",
    },
    {
        title: "Input",
    },
];



function page() {
    return (
        <>
            <BreadcrumbComp title="Input" items={BCrumb} />
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
                <div >
                    <CodePreview
                        component={<InputDateDemo />}
                        filePath="/app/components/shadcn-ui/input/input-01.tsx"
                        title="Date Input"
                    />
                </div>
                <div >
                    <CodePreview
                        component={<InputTimeDemo />}
                        filePath="/app/components/shadcn-ui/input/input-02.tsx"
                        title="Time Input "
                    />
                </div>
                <div >
                    <CodePreview
                        component={<InputCurrencyDemo />}
                        filePath="/app/components/shadcn-ui/input/input-03.tsx"
                        title="Currency Input "
                    />
                </div>

                <div>
                    <CodePreview
                        component={<InputStartSelectDemo />}
                        filePath="/app/components/shadcn-ui/input/input-05.tsx"
                        title="Start Select"
                    />
                </div> <div>
                    <CodePreview
                        component={<InputCharacterLimitDemo />}
                        filePath="/app/components/shadcn-ui/input/input-06.tsx"
                        title="Character Limit"
                    />
                </div> <div>
                    <CodePreview
                        component={<InputWithControlsDemo />}
                        filePath="/app/components/shadcn-ui/input/input-07.tsx"
                        title="With Controls"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputAddOnsDemo />}
                        filePath="/app/components/shadcn-ui/input/input-08.tsx"
                        title="Add Ons"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputFloatingLabelDemo />}
                        filePath="/app/components/shadcn-ui/input/input-09.tsx"
                        title="Floating Label"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputClearDemo />}
                        filePath="/app/components/shadcn-ui/input/input-10.tsx"
                        title="Clear"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputEndInlineButtonDemo />}
                        filePath="/app/components/shadcn-ui/input/input-11.tsx"
                        title="End Inline Button"
                    />
                </div>  <div>
                    <CodePreview
                        component={<InputEndButtonDemo />}
                        filePath="/app/components/shadcn-ui/input/input-12.tsx"
                        title="Input End Button"
                    />
                </div>

                <div>
                    <CodePreview
                        component={<InputFileDemo />}
                        filePath="/app/components/shadcn-ui/input/input-13.tsx"
                        title="Input File"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputErrorDemo />}
                        filePath="/app/components/shadcn-ui/input/input-14.tsx"
                        title="Input Error"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputRequiredDemo />}
                        filePath="/app/components/shadcn-ui/input/input-15.tsx"
                        title="Input End"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputDefaultDemo />}
                        filePath="/app/components/shadcn-ui/input/input-16.tsx"
                        title="Input Default"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputWithLabelDemo />}
                        filePath="/app/components/shadcn-ui/input/input-17.tsx"
                        title="Input With Label"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputDisabledDemo />}
                        filePath="/app/components/shadcn-ui/input/input-18.tsx"
                        title="Input Disabled"
                    />
                </div>
                <div>
                    <CodePreview
                        component={<InputRealTimeValidationDemo />}
                        filePath="/app/components/shadcn-ui/input/input-04.tsx"
                        title="Real Time Validation"
                    />
                </div>
            </div>

        </>
    )
}

export default page