import TaskManager from "@/app/components/apps/kanban/task-manager";

import { Card } from "@/components/ui/card";
import { KanbanDataContextProvider } from "@/app/context/kanban-context/index";
import type { Metadata } from "next";
import BreadcrumbComp from "../../layout/shared/breadcrumb/breadcrumb-comp";
export const metadata: Metadata = {
  title: "Kanban App",
};

const BCrumb = [
  {
    to: "/",
    title: "Home",
  },
  {
    title: "Kanban",
  },
];

function kanban() {
  return (
    <>
      <KanbanDataContextProvider>
        <BreadcrumbComp title="Kanban app" items={BCrumb} />
        <Card className="p-6">
          <TaskManager />
        </Card>
      </KanbanDataContextProvider>
    </>
  );
}
export default kanban;
