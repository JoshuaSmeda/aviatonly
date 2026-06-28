import { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import CalendarOne from "@/components/dashboard/shadcn-ui/calendar/calendar-01";
import CodePreview from "@/components/dashboard/shared/code-preview";
import CalendarTwo from "@/components/dashboard/shadcn-ui/calendar/calendar-02";
import CalendarThree from "@/components/dashboard/shadcn-ui/calendar/calendar-03";
import CalendarDialog from "@/components/dashboard/shadcn-ui/calendar/calendar-04";

export const metadata: Metadata = {
  title: "Ui Datepicker",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Datepicker",
  },
];

const page = () => {
  return (
    <>
      <BreadcrumbComp title="Datepicker" items={BCrumb} />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <CodePreview
            component={<CalendarOne />}
            filePath="/app/components/shadcn-ui/calendar/calendar-01.tsx"
            title="Standard  Calendar"
          />
        </div>
        <div className="col-span-12">
          <CodePreview
            component={<CalendarTwo />}
            filePath="/app/components/shadcn-ui/calendar/calendar-02.tsx"
            title="Style  Calendar "
          />
        </div>
        <div className="col-span-12">
          <CodePreview
            component={<CalendarThree />}
            filePath="/app/components/shadcn-ui/calendar/calendar-03.tsx"
            title="Time Calendar "
          />
        </div>
        <div className="col-span-12 ">
          <CodePreview
            component={<CalendarDialog />}
            filePath="/app/components/shadcn-ui/calendar/calendar-04.tsx"
            title="Dialog  Calendar"
          />
        </div>
      </div>
    </>
  );
};

export default page;
