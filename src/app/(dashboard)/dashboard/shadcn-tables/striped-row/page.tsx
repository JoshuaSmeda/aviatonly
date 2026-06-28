import StripedRowTable from "@/components/dashboard/shadcn-table/striped-row/stripedrow-table";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
import TitleCard from "@/components/dashboard/shared/titleborder-card";

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Striped Raw",
  },
];

function page() {
  return (
    <>
      <BreadcrumbComp title="Shadcn Striped Table" items={BCrumb} />
      <TitleCard title="Striped Table">
        <div className="grid grid-cols-12 gap-7">
          <div className="col-span-12">
            <StripedRowTable />
          </div>
        </div>
      </TitleCard>
    </>
  );
}

export default page;
