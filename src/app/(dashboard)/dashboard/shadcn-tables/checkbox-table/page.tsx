import TitleCard from "@/components/dashboard/shared/titleborder-card";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import CheckboxTable from "@/components/dashboard/shadcn-table/checkbox/checkbox-table";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Checkbox Table",
  },
];

function page() {
  return (
    <>
      <BreadcrumbComp title="Shadcn Checkbox Table" items={BCrumb} />
      <TitleCard title="Checkbox Table">
        <div className="grid grid-cols-12 gap-7">
          <div className="col-span-12">
            <CheckboxTable />
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default page;
